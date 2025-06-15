export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  // return `${minutes}m ${secs.toString().padStart(2, "0")}`
  return `${minutes}m${secs.toFixed(0)}s`
}
