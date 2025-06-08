import { useEffect, useState } from "react"
import { Config } from "./Config"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { UploadForm } from "./UploadForm"
import { VideoError } from "./VideoError"
import { useConfig } from "./configContext"
import {
  createVideoThumbnail,
  getVideoMetadata,
} from "./create-video-thumbnail"
import { formatDuration } from "./formatDuration"
import type { Thumbnail, VideoMetadata } from "./types"

export function Home() {
  const { config } = useConfig()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)

  function uploadHandler(file: File) {
    setFile(file)
  }

  useEffect(() => {
    if (file) {
      getVideoMetadata(file)
        .then((metadata) => {
          setVideoMetadata(metadata)
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [file])

  useEffect(() => {
    if (file && videoMetadata) {
      const captureTimes = [0.0, 5.0, 10]

      const captureCallback = (captureTime: number) => {
        const captureConfig = { ...config, captureTime }
        createVideoThumbnail(file, captureConfig)
          .then((dataURI) => {
            setThumbnails((prev) => {
              return [
                ...prev.filter(
                  (t) =>
                    !(
                      t.name === file.name &&
                      t.config.captureTime === captureTime
                    ),
                ),
                {
                  dataURI,
                  name: file.name,
                  videoMetadata,
                  config: captureConfig,
                },
              ]
            })
            setError(null)
            const nextCaptureTime = captureTimes.shift()
            if (nextCaptureTime !== undefined) {
              captureCallback(nextCaptureTime)
            }
          })
          .catch((error) => {
            setError(error)
          })
      }

      const captureTime = captureTimes.shift()
      if (captureTime !== undefined) {
        // Start the recursive capture process!
        captureCallback(captureTime)
      }
    }
  }, [file, config, videoMetadata])

  return (
    <div>
      Upload a video
      <UploadForm onUpload={uploadHandler} />
      {error && <VideoError error={error} />}
      {videoMetadata !== null && (
        <p>Video duration {formatDuration(videoMetadata.duration)}.</p>
      )}
      <DisplayThumbnails thumbnails={thumbnails} />
      <Config />
    </div>
  )
}
