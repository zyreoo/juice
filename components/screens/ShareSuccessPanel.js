import React, { useState, useEffect, useRef } from 'react';

export default function ShareSuccessPanel() {
    const [isSharing, setIsSharing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cropBox, setCropBox] = useState(() => {
        const savedCropBox = localStorage.getItem('cropBoxPosition');
        if (savedCropBox) {
            try {
                const parsed = JSON.parse(savedCropBox);
                return {
                    ...parsed,
                    isDragging: false,
                    isResizing: false,
                    dragStart: { x: 0, y: 0 },
                    resizeCorner: null
                };
            } catch (e) {
                console.error('Failed to parse saved crop box position:', e);
            }
        }
        return {
            x: 20,
            y: 20,
            width: 200,
            height: 150,
            isDragging: false,
            isResizing: false,
            dragStart: { x: 0, y: 0 },
            resizeCorner: null
        };
    });
    const containerRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const canvasRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [showingPreview, setShowingPreview] = useState(false);
    const [kudosSent, setKudosSent] = useState(false);

    // Save crop box position whenever it changes
    useEffect(() => {
        if (!cropBox.isDragging && !cropBox.isResizing) {
            const positionToSave = {
                x: cropBox.x,
                y: cropBox.y,
                width: cropBox.width,
                height: cropBox.height
            };
            localStorage.setItem('cropBoxPosition', JSON.stringify(positionToSave));
        }
    }, [cropBox]);

    const setupStream = async (stream) => {
        console.log('Setting up video element...');
        if (videoRef.current) {
            // Clear any existing srcObject
            if (videoRef.current.srcObject) {
                videoRef.current.srcObject = null;
            }
            
            videoRef.current.srcObject = stream;
            
            videoRef.current.onloadedmetadata = () => {
                console.log('Video metadata loaded:', {
                    videoWidth: videoRef.current.videoWidth,
                    videoHeight: videoRef.current.videoHeight,
                    readyState: videoRef.current.readyState
                });
                
                videoRef.current.play().then(() => {
                    console.log('Video playback started');
                    setIsLoading(false);
                }).catch(err => {
                    console.error('Video playback failed:', err);
                    setError('Failed to start video playback');
                    setIsLoading(false);
                });
            };

            videoRef.current.onerror = (e) => {
                console.error('Video error:', e);
                setError('Video playback error');
                setIsLoading(false);
            };
        } else {
            console.error('No video element reference');
            setError('Video element not initialized');
            setIsLoading(false);
        }
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    // Effect to handle stream setup after video element is available
    useEffect(() => {
        if (streamRef.current && videoRef.current && isSharing) {
            setupStream(streamRef.current);
        }
    }, [isSharing, streamRef.current]); // Add streamRef.current as dependency

    const startScreenShare = async () => {
        console.log('Starting screen share...');
        setError(null);
        setIsLoading(true);
        
        // If we already have a stream, just reuse it
        if (streamRef.current && streamRef.current.active) {
            console.log('Reusing existing stream...');
            setIsSharing(true);
            setIsLoading(false);
            return;
        }
        
        try {
            // Stop existing stream if any
            if (streamRef.current) {
                console.log('Stopping existing stream...');
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
            
            console.log('Requesting display media...');
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: false
            });
            
            console.log('Got stream:', {
                active: stream.active,
                id: stream.id,
                tracks: stream.getTracks().map(track => ({
                    kind: track.kind,
                    label: track.label,
                    enabled: track.enabled,
                    muted: track.muted,
                    readyState: track.readyState,
                    settings: track.getSettings()
                }))
            });
            
            streamRef.current = stream;
            
            // Handle stream end
            stream.getVideoTracks()[0].onended = () => {
                console.log('Stream track ended');
                setIsSharing(false);
                setIsLoading(false);
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            };

            setIsSharing(true);

        } catch (err) {
            console.error('Screen share error:', err);
            setError(err.message);
            setIsSharing(false);
            setIsLoading(false);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const getCursorStyle = (x, y) => {
        if (!isSharing) return 'default';
        
        const edgeThreshold = 10;
        const nearLeft = Math.abs(x - cropBox.x) < edgeThreshold;
        const nearRight = Math.abs(x - (cropBox.x + cropBox.width)) < edgeThreshold;
        const nearTop = Math.abs(y - cropBox.y) < edgeThreshold;
        const nearBottom = Math.abs(y - (cropBox.y + cropBox.height)) < edgeThreshold;

        // Corner cursors
        if (nearTop && nearLeft) return 'nw-resize';
        if (nearTop && nearRight) return 'ne-resize';
        if (nearBottom && nearLeft) return 'sw-resize';
        if (nearBottom && nearRight) return 'se-resize';

        // Edge cursors
        if (nearLeft || nearRight) return 'ew-resize';
        if (nearTop || nearBottom) return 'ns-resize';

        // Middle area cursor
        if (x >= cropBox.x && x <= cropBox.x + cropBox.width &&
            y >= cropBox.y && y <= cropBox.y + cropBox.height) {
            return cropBox.isDragging ? 'grabbing' : 'grab';
        }

        return 'default';
    };

    const handleMouseDown = (e) => {
        if (!isSharing || isRecording) return; // Prevent interaction during recording
        
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking near the edges for resizing
        const edgeThreshold = 10;
        const nearLeft = Math.abs(x - cropBox.x) < edgeThreshold;
        const nearRight = Math.abs(x - (cropBox.x + cropBox.width)) < edgeThreshold;
        const nearTop = Math.abs(y - cropBox.y) < edgeThreshold;
        const nearBottom = Math.abs(y - (cropBox.y + cropBox.height)) < edgeThreshold;

        // First check edges
        if (nearTop || nearBottom || nearLeft || nearRight) {
            let corner = '';
            if (nearTop) corner += 'n';
            if (nearBottom) corner += 's';
            if (nearLeft) corner += 'w';
            if (nearRight) corner += 'e';
            
            setCropBox(prev => ({
                ...prev,
                isResizing: true,
                isDragging: false,
                dragStart: { x, y },
                resizeCorner: corner
            }));
        } else if (x >= cropBox.x && x <= cropBox.x + cropBox.width &&
                   y >= cropBox.y && y <= cropBox.y + cropBox.height) {
            // If not resizing and inside the box, then drag
            setCropBox(prev => ({
                ...prev,
                isDragging: true,
                isResizing: false,
                dragStart: { x, y }
            }));
        }
    };

    const handleMouseMove = (e) => {
        if (!isSharing || isRecording) return; // Prevent interaction during recording

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update cursor style
        container.style.cursor = getCursorStyle(x, y);

        if (!cropBox.isDragging && !cropBox.isResizing) return;

        const dx = x - cropBox.dragStart.x;
        const dy = y - cropBox.dragStart.y;

        if (cropBox.isResizing) {
            setCropBox(prev => {
                let newBox = { ...prev };
                const corner = prev.resizeCorner;

                // Calculate new dimensions and positions
                let newX = prev.x;
                let newY = prev.y;
                let newWidth = prev.width;
                let newHeight = prev.height;

                if (corner.includes('n')) {
                    const proposedHeight = prev.height - dy;
                    const proposedY = prev.y + dy;
                    if (proposedHeight >= 50 && proposedY >= 0) {
                        newHeight = proposedHeight;
                        newY = proposedY;
                    }
                }
                if (corner.includes('s')) {
                    const proposedHeight = prev.height + dy;
                    if (proposedHeight >= 50 && (prev.y + proposedHeight) <= container.clientHeight) {
                        newHeight = proposedHeight;
                    }
                }
                if (corner.includes('w')) {
                    const proposedWidth = prev.width - dx;
                    const proposedX = prev.x + dx;
                    if (proposedWidth >= 50 && proposedX >= 0) {
                        newWidth = proposedWidth;
                        newX = proposedX;
                    }
                }
                if (corner.includes('e')) {
                    const proposedWidth = prev.width + dx;
                    if (proposedWidth >= 50 && (prev.x + proposedWidth) <= container.clientWidth) {
                        newWidth = proposedWidth;
                    }
                }

                return {
                    ...prev,
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
                    dragStart: { x, y }
                };
            });
        } else if (cropBox.isDragging) {
            setCropBox(prev => {
                const newX = Math.max(0, Math.min(prev.x + dx, container.clientWidth - prev.width));
                const newY = Math.max(0, Math.min(prev.y + dy, container.clientHeight - prev.height));
                return {
                    ...prev,
                    x: newX,
                    y: newY,
                    dragStart: { x, y }
                };
            });
        }
    };

    const handleMouseUp = () => {
        setCropBox(prev => ({
            ...prev,
            isDragging: false,
            isResizing: false,
            resizeCorner: null
        }));
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const startRecording = async () => {
        // If no video stream, start fresh with window selection
        if (!videoRef.current || !videoRef.current.srcObject) {
            await startScreenShare();
            // Wait a bit for the stream to be ready
            await new Promise(resolve => setTimeout(resolve, 500));
            // If still no stream after waiting, return
            if (!videoRef.current || !videoRef.current.srcObject) {
                console.error('Failed to get stream for recording');
                return;
            }
        }

        const canvas = document.createElement('canvas');
        canvasRef.current = canvas;
        const ctx = canvas.getContext('2d');
        
        // Get the actual video dimensions
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        // Get the container dimensions
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate scale factors
        const scaleX = videoWidth / containerWidth;
        const scaleY = videoHeight / containerHeight;
        
        // Calculate actual crop dimensions in video coordinates
        const actualCropX = Math.floor(cropBox.x * scaleX);
        const actualCropY = Math.floor(cropBox.y * scaleY);
        const actualCropWidth = Math.floor(cropBox.width * scaleX);
        const actualCropHeight = Math.floor(cropBox.height * scaleY);
        
        // Set canvas size to actual crop dimensions
        canvas.width = actualCropWidth;
        canvas.height = actualCropHeight;

        console.log('Recording dimensions:', {
            video: { width: videoWidth, height: videoHeight },
            container: { width: containerWidth, height: containerHeight },
            scale: { x: scaleX, y: scaleY },
            crop: {
                preview: { x: cropBox.x, y: cropBox.y, width: cropBox.width, height: cropBox.height },
                actual: { x: actualCropX, y: actualCropY, width: actualCropWidth, height: actualCropHeight }
            }
        });

        const stream = canvas.captureStream(30); // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, {
                type: 'video/mp4'
            });
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
            setShowingPreview(true);
            setIsRecording(false);
        };

        // Start recording
        mediaRecorder.start(1000); // Collect data every second
        setIsRecording(true);

        // Start the frame capture interval
        recordingIntervalRef.current = setInterval(() => {
            if (videoRef.current && videoRef.current.srcObject) {
                // Draw the cropped portion, scaling from actual video dimensions
                ctx.drawImage(
                    videoRef.current,
                    actualCropX,
                    actualCropY,
                    actualCropWidth,
                    actualCropHeight,
                    0,
                    0,
                    actualCropWidth,
                    actualCropHeight
                );
            }
        }, 1000 / 30); // 30 FPS
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            clearInterval(recordingIntervalRef.current);
            
            // Stop the current stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            if (canvasRef.current) {
                const tracks = canvasRef.current.captureStream().getTracks();
                tracks.forEach(track => track.stop());
            }
            
            // Clear all refs
            mediaRecorderRef.current = null;
            canvasRef.current = null;
            recordingIntervalRef.current = null;
            setIsRecording(false);
            setIsSharing(false);
        }
    };

    // Add cleanup for recording
    useEffect(() => {
        return () => {
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const handleRerecord = () => {
        if (recordedVideoUrl) {
            URL.revokeObjectURL(recordedVideoUrl);
        }
        setRecordedVideoUrl(null);
        setShowingPreview(false);
        // Start fresh with a new window selection
        startScreenShare();
    };

    const handleSendForKudos = () => {
        // Stop the current stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsSharing(false);
        console.log('Sending for kudos...');
        setKudosSent(true);
    };

    // Add cleanup for recorded video URL
    useEffect(() => {
        return () => {
            if (recordedVideoUrl) {
                URL.revokeObjectURL(recordedVideoUrl);
            }
        };
    }, [recordedVideoUrl]);

    // Update Change Window button to properly request new window
    const handleChangeWindow = async () => {
        setIsLoading(true);
        // Only stop the stream when explicitly changing windows
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
        
        // Request new window
        await startScreenShare();
    };

    // Cleanup only on component unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (recordedVideoUrl) {
                URL.revokeObjectURL(recordedVideoUrl);
            }
        };
    }, []);

    // Share Another button click handler
    const handleShareAnother = () => {
        if (recordedVideoUrl) {
            URL.revokeObjectURL(recordedVideoUrl);
            setRecordedVideoUrl(null);
        }
        setKudosSent(false);
        setShowingPreview(false);
        // Start fresh with a new window selection
        startScreenShare();
    };

    return (
        <div style={{
            width: 332,
            marginTop: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 1px 20px rgba(0, 0, 0, 0.1)'
        }}>
            <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>
                {kudosSent ? 'Shared your "OMG IT WORKS" moment! Kudos coming your way...' : 'Share your success!'}
            </p>
            {(isSharing || showingPreview) && (
                <div 
                    ref={containerRef}
                    style={{
                        width: "100%",
                        marginBottom: 8,
                        borderRadius: 4,
                        overflow: "hidden",
                        aspectRatio: "16/9",
                        backgroundColor: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        position: "relative",
                        cursor: isRecording ? 'default' : undefined // Reset cursor during recording
                    }}
                    onMouseDown={!showingPreview && !isRecording ? handleMouseDown : undefined}
                    onMouseMove={!showingPreview && !isRecording ? handleMouseMove : undefined}
                >
                    {!showingPreview && (
                        <video 
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: isSharing && !isLoading ? "block" : "none"
                            }}
                        />
                    )}
                    {showingPreview && (
                        <video
                            autoPlay
                            controls
                            loop
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain"
                            }}
                            src={recordedVideoUrl}
                        />
                    )}
                    {isSharing && !isLoading && !showingPreview && (
                        <>
                            <div style={{
                                position: 'absolute',
                                top: cropBox.y,
                                left: cropBox.x,
                                width: cropBox.width,
                                height: cropBox.height,
                                border: '2px solid #ff0000',
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                                zIndex: 1
                            }}>
                                {/* Resize handles */}
                                <div style={{
                                    position: 'absolute',
                                    top: -4,
                                    left: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    cursor: 'nw-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    cursor: 'ne-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: -4,
                                    left: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    cursor: 'sw-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: -4,
                                    right: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    cursor: 'se-resize'
                                }} />
                                {/* Edge handles */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    transform: 'translateY(-50%)',
                                    cursor: 'ew-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    transform: 'translateY(-50%)',
                                    cursor: 'ew-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    transform: 'translateX(-50%)',
                                    cursor: 'ns-resize'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    left: '50%',
                                    bottom: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#ff0000',
                                    transform: 'translateX(-50%)',
                                    cursor: 'ns-resize'
                                }} />
                            </div>
                        </>
                    )}
                    {isLoading && !showingPreview && (
                        <div style={{
                            position: "absolute",
                            color: "white",
                            zIndex: 1
                        }}>
                            Loading...
                        </div>
                    )}
                </div>
            )}
            {error && (
                <p style={{ color: "red", margin: "0 0 8px 0", fontSize: "12px" }}>
                    Error: {error}
                </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!isSharing && !showingPreview && (
                    <button 
                        onClick={startScreenShare}
                        disabled={isLoading}
                        className="rainbow-button"
                        style={{
                            padding: "8px 12px",
                            border: "2px solid rgba(255, 255, 255, 0.8)",
                            borderRadius: 8,
                            cursor: isLoading ? "wait" : "pointer",
                            fontWeight: "800",
                            fontSize: "15px",
                            transition: "transform 0.2s ease, border-color 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            color: "white",
                            textShadow: `
                                -1px -1px 0 #000,  
                                1px -1px 0 #000,
                                -1px 1px 0 #000,
                                1px 1px 0 #000,
                                0 0 8px rgba(0,0,0,0.5)
                            `,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            opacity: isLoading ? 0.7 : 1,
                            ":hover": {
                                transform: isLoading ? "none" : "scale(1.02)",
                                borderColor: "rgba(255, 255, 255, 1)"
                            }
                        }}
                    >
                        {isLoading ? "Loading..." : 'Share an "OMG IT WORKS" moment'}
                    </button>
                )}
                {isSharing && !showingPreview && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="rainbow-button record-button"
                            style={{
                                padding: "8px 12px",
                                border: "2px solid rgba(255, 255, 255, 0.8)",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: "800",
                                fontSize: "15px",
                                transition: "transform 0.2s ease, border-color 0.2s ease",
                                position: "relative",
                                overflow: "hidden",
                                color: "white",
                                textShadow: `
                                    -1px -1px 0 #000,  
                                    1px -1px 0 #000,
                                    -1px 1px 0 #000,
                                    1px 1px 0 #000,
                                    0 0 8px rgba(0,0,0,0.5)
                                `,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                flex: 1,
                                ":hover": {
                                    transform: "scale(1.02)",
                                    borderColor: "rgba(255, 255, 255, 1)"
                                }
                            }}
                        >
                            {isRecording ? "Stop Recording" : "Record Demo"}
                        </button>
                        <button
                            onClick={handleChangeWindow}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                border: "1px solid rgba(0, 0, 0, 0.2)",
                                borderRadius: 8,
                                cursor: "pointer",
                                color: "rgba(0, 0, 0, 0.8)",
                                fontWeight: "500",
                                transition: "all 0.2s ease",
                                flex: 1,
                                fontSize: "14px",
                                ":hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.15)"
                                }
                            }}
                        >
                            Change Window
                        </button>
                    </div>
                )}
                {showingPreview && !kudosSent && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleSendForKudos}
                            className="rainbow-button"
                            style={{
                                padding: "8px 12px",
                                border: "2px solid rgba(255, 255, 255, 0.8)",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: "800",
                                fontSize: "15px",
                                transition: "transform 0.2s ease, border-color 0.2s ease",
                                position: "relative",
                                overflow: "hidden",
                                color: "white",
                                textShadow: `
                                    -1px -1px 0 #000,  
                                    1px -1px 0 #000,
                                    -1px 1px 0 #000,
                                    1px 1px 0 #000,
                                    0 0 8px rgba(0,0,0,0.5)
                                `,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                flex: 1,
                                ":hover": {
                                    transform: "scale(1.02)",
                                    borderColor: "rgba(255, 255, 255, 1)"
                                }
                            }}
                        >
                            Send for Kudos
                        </button>
                        <button
                            onClick={handleRerecord}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                border: "1px solid rgba(0, 0, 0, 0.2)",
                                borderRadius: 8,
                                cursor: "pointer",
                                color: "rgba(0, 0, 0, 0.8)",
                                fontWeight: "500",
                                transition: "all 0.2s ease",
                                flex: 1,
                                fontSize: "14px",
                                ":hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.15)"
                                }
                            }}
                        >
                            Rerecord
                        </button>
                    </div>
                )}
                {kudosSent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            onClick={handleShareAnother}
                            className="rainbow-button"
                            style={{
                                padding: "8px 12px",
                                border: "2px solid rgba(255, 255, 255, 0.8)",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: "800",
                                fontSize: "15px",
                                transition: "transform 0.2s ease, border-color 0.2s ease",
                                position: "relative",
                                overflow: "hidden",
                                color: "white",
                                textShadow: `
                                    -1px -1px 0 #000,  
                                    1px -1px 0 #000,
                                    -1px 1px 0 #000,
                                    1px 1px 0 #000,
                                    0 0 8px rgba(0,0,0,0.5)
                                `,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                ":hover": {
                                    transform: "scale(1.02)",
                                    borderColor: "rgba(255, 255, 255, 1)"
                                }
                            }}
                        >
                            Share Another "OMG IT WORKS" moment
                        </button>
                    </div>
                )}
            </div>
            <style jsx>{`
                .rainbow-button {
                    background-image: linear-gradient(
                        238deg,
                        #0000ff 0%,
                        #4400ff 4%,
                        #8800ff 8%,
                        #cc00ff 12%,
                        #ff00ff 16%,
                        #ff00cc 20%,
                        #ff0088 24%,
                        #ff0044 28%,
                        #ff0000 32%,
                        #ff4400 36%,
                        #ff8800 40%,
                        #ffcc00 44%,
                        #ffff00 48%,
                        #ccff00 52%,
                        #88ff00 56%,
                        #44ff00 60%,
                        #00ff00 64%,
                        #00ff44 68%,
                        #00ff88 72%,
                        #00ffcc 76%,
                        #00ffff 80%,
                        #00ccff 84%,
                        #0088ff 88%,
                        #0044ff 92%,
                        #0000ff 96%,
                        #4400ff 100%
                    );
                    background-size: 400% 400%;
                    animation: gradient 6s linear infinite;
                    image-rendering: pixelated;
                }

                .record-button {
                    animation: gradient 6s linear infinite reverse;
                }

                @keyframes gradient {
                    0% {
                        background-position: 0% center;
                    }
                    100% {
                        background-position: -400% center;
                    }
                }
            `}</style>
        </div>
    );
} 