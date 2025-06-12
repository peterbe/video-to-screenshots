import { useEffect, useState } from "react"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { UploadForm } from "./UploadForm"
import { VideoError } from "./VideoError"
import { useConfig } from "./configContext"
import {
  createVideoThumbnail,
  getVideoMetadata,
} from "./create-video-thumbnail"
import { formatBytes } from "./formatBytes"
import { formatDuration } from "./formatDuration"
import { ROOT } from "./titles"
import type { Thumbnail, VideoMetadata } from "./types"
import { useDocumentTitle } from "./useDocumentTitle"

export function Home() {
  useDocumentTitle(ROOT)
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
      const captureTimes = getCaptureTimes(videoMetadata.duration)

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
              // Fake delay
              sleep(100).then(() => {
                captureCallback(nextCaptureTime)
              })
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
      <UploadForm onUpload={uploadHandler} />
      {error && <VideoError error={error} />}
      {videoMetadata !== null && (
        <p>
          Video duration {formatDuration(videoMetadata.duration)}.{" "}
          {file && <span>File size {formatBytes(file.size)}</span>}
        </p>
      )}
      <DisplayThumbnails thumbnails={thumbnails} />
      {/* <Config /> */}
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getCaptureTimes(duration: number): number[] {
  const captureTimes: number[] = [] // first frame
  let framesCount = 9 // 3 rows of 3 thumbnails
  if (duration > 60) {
    framesCount = 21 // 7 rows of 3 thumbnails
  } else if (duration > 10) {
    framesCount = 15 // 5 rows of 3 thumbnails
  }
  const step = duration / framesCount

  for (let time = 0.1; time < duration; time += step) {
    captureTimes.push(time)
  }

  return captureTimes
}
