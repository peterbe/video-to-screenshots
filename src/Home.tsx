import { useState } from "react"
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
import type { Thumbnail, VideoMetadata } from "./types"

export function Home() {
  const { config } = useConfig()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)

  function uploadHandler(file: File) {
    setThumbnails([])
    setFile(file)

    // TODO THIS IS TOO LARGE. PLEASE REFACTOR

    getVideoMetadata(file)
      .then((metadata) => {
        setVideoMetadata(metadata)

        const captureTimes = getCaptureTimes(metadata.duration)
        const queue = captureTimes.map((captureTime, index) => {
          return { captureTime, index }
        })
        const captureCallback = ({
          captureTime,
          index,
        }: { captureTime: number; index: number }) => {
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
                    videoMetadata: metadata,
                    config: captureConfig,
                    index,
                  },
                ]
              })
              setError(null)
              const next = queue.shift()
              if (next !== undefined) {
                // Fake delay
                sleep(100).then(() => {
                  captureCallback(next)
                })
              }
            })
            .catch((error) => {
              setError(error)
            })
        }

        const next = queue.shift()
        if (next !== undefined) {
          // Start the recursive capture process!
          captureCallback(next)
        }
      })
      .catch((error) => {
        setError(error)
      })
  }
  function uploadResetHandler() {
    setFile(null)
    setVideoMetadata(null)
    setThumbnails([])
  }

  return (
    <div>
      <UploadForm onUpload={uploadHandler} onReset={uploadResetHandler} />
      {error && <VideoError error={error} />}
      {videoMetadata !== null && (
        <p>
          Video duration {formatDuration(videoMetadata.duration)}.{" "}
          {file && <span>File size {formatBytes(file.size)}</span>}
        </p>
      )}
      <DisplayThumbnails thumbnails={thumbnails} />
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getCaptureTimes(durationSeconds: number): number[] {
  const captureTimes: number[] = [] // first frame
  let framesCount = 9 // 3 rows of 3 thumbnails
  if (durationSeconds > 60) {
    framesCount = 15 // 7 rows of 3 thumbnails
  } else if (durationSeconds > 10) {
    framesCount = 12 // 5 rows of 3 thumbnails
  }
  const step = durationSeconds / framesCount

  for (let time = 0.1; time + step < durationSeconds; time += step) {
    captureTimes.push(time)
  }

  return captureTimes
}
