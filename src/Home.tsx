import { useState } from "react"
import { useSessionStorage } from "usehooks-ts"
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
  const [uploadCount, countUploads] = useSessionStorage("upload-count", 0)
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [loading, setLoading] = useState(false)

  function uploadHandler(file: File, config: Options) {
    setThumbnails([])
    setFile(file)
    setLoading(true)

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
          // Start the recursive capture process!
          captureCallback(next)
        }
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })

    countUploads((prev) => prev + 1)
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

      <SafariWarning />

      {loading && (
        <span aria-busy="true">Generating thumbnails for you...</span>
      )}

      {videoMetadata !== null && thumbnails.length > 0 && (
        <div className="grid">
          <p>
            Video duration: {formatDurationLong(videoMetadata.duration)}
            <br />
            {file && <span>File size: {formatBytes(file.size)}</span>}
            <br />
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

      <MadeBy uploadCount={uploadCount} />
    </div>
  )
}

function MadeBy({ uploadCount }: { uploadCount: number }) {
  if (!uploadCount) return null
  const imageUrlBase = "https://www.peterbe.com/api/v1/logo.png"
  const sp = new URLSearchParams({
    ref: "video-to-screenshot",
    uploadCount: String(uploadCount),
  })
  const imageUrl = `${imageUrlBase}?${sp.toString()}`
  return (
    <article
      style={{
        display: "inline-block",
        textAlign: "center",
        fontSize: "70%",
      }}
    >
      <a href="https://www.peterbe.com?ref=video-to-screenshot">
        <img src={imageUrl} width="70" alt="Made by peterbe" />
      </a>
      <p style={{ marginBottom: 5, marginTop: 5 }}>
        Made by{" "}
        <a href="https://www.peterbe.com?ref=video-to-screenshot">peterbe</a>
      </p>
    </article>
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

function SafariWarning() {
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    !/crios/i.test(navigator.userAgent)
  if (!isSafari) return null
  return (
    <div
      style={{
        border: "2px solid red",
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <p>
        Video to Screenshots currently doesn't work in Safari. Sorry about that.
      </p>
      <p>
        If you have an idea please post it in{" "}
        <a href="https://github.com/peterbe/video-to-screenshots/issues/13">
          this GitHub issue
        </a>
        .
      </p>
    </div>
  )
}
