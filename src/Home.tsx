import { useEffect, useState } from "react"
import { Config } from "./Config"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { UploadForm } from "./UploadForm"
import { VideoError } from "./VideoError"
import { useConfig } from "./configContext"
import { createVideoThumbnail } from "./create-video-thumbnail"
import type { Thumbnail } from "./types"

export function Home() {
  const { config } = useConfig()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)

  function uploadHandler(file: File) {
    setFile(file)
  }

  useEffect(() => {
    if (file) {
      createVideoThumbnail(file, config)
        .then((dataURI) => {
          setThumbnails((prev) => [
            { dataURI, name: file.name, config },
            ...prev.filter((t) => t.name !== file.name),
          ])
          setError(null)
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [file, config])

  return (
    <div>
      Upload a video
      <UploadForm onUpload={uploadHandler} />
      {error && <VideoError error={error} />}
      <Config />
      <DisplayThumbnails thumbnails={thumbnails} />
    </div>
  )
}
