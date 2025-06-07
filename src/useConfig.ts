import { useEffect, useState } from "react"
import type { Options } from "./create-video-thumbnail"

export function useConfig() {
  // Default configuration for video thumbnail generation
  const [config, setConfig] = useState<Options>({
    maxWidth: 900,
    maxHeight: 507,
    quality: 0.85,
    captureTime: 0.1,
    format: "image/jpeg",
  })

  useEffect(() => {
    const storedConfig = localStorage.getItem("videoThumbnailConfig")
    if (storedConfig) {
      // XXX make safer
      setConfig(JSON.parse(storedConfig))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("videoThumbnailConfig", JSON.stringify(config))
  }, [config])

  return [config, setConfig] as const
}
