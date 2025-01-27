export function isLowEnd() {
  const deviceMemory = navigator.deviceMemory || 4;
  return deviceMemory <= 4;
}
