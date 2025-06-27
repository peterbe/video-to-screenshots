import { useState } from "react"
import { ChangeConfig } from "./ChangeConfig"
import {
  createVideoThumbnail,
  getVideoMetadata,
  type Options,
} from "./create-video-thumbnail"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { formatBytes } from "./formatBytes"
import { formatDurationLong } from "./formatDuration"
import type { Thumbnail, VideoMetadata } from "./types"
import { UploadForm } from "./UploadForm"
import { VideoError } from "./VideoError"

export function Home() {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)

  const [loading, setLoading] = useState(false)

  function uploadHandler(file: File, config: Options) {
    setThumbnails([])
    setFile(file)

    // TODO THIS IS TOO LARGE. PLEASE REFACTOR

    getVideoMetadata(file)
      .then((metadata) => {
        setVideoMetadata(metadata)

        const queue = getCaptureQueue(metadata.duration)
        const captureCallback = ({ captureTime, index }: CaptureQueueItem) => {
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
              } else {
                setLoading(false)
              }
            })
            .catch((error) => {
              setError(error)
              setLoading(false)
            })
        }

        const next = queue.shift()
        if (next !== undefined) {
          setLoading(true)
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

      {videoMetadata !== null && thumbnails.length > 0 && (
        <div className="grid">
          <p>
            Video duration: {formatDurationLong(videoMetadata.duration)}
            <br />
            {file && <span>File size: {formatBytes(file.size)}</span>}
            <br />
            {loading && (
              <span aria-busy="true">Generating thumbnails for you...</span>
            )}
          </p>
          <ChangeConfig
            onChange={(config: Options) => {
              if (file) {
                uploadHandler(file, config)
              }
            }}
          />
        </div>
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

type CaptureQueueItem = {
  captureTime: number
  index: number
}

function getCaptureQueue(durationSeconds: number): CaptureQueueItem[] {
  const captureTimes = getCaptureTimes(durationSeconds)
  return captureTimes.map((captureTime, index) => {
    return { captureTime, index }
  })
}
