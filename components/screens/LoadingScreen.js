export default function LoadingScreen() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ fontSize: '32px' }}>Juice</div>
      <div style={{
        width: '300px',
        height: '4px',
        backgroundColor: '#333'
      }}>
        <div 
          id="progress-bar"
          style={{
            width: '0%',
            height: '100%',
            backgroundColor: 'white',
            transition: 'width 0.1s linear'
          }}
        />
      </div>
    </div>
  );
} 