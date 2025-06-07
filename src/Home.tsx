import { useEffect, useState } from "react"
import { Config } from "./Config"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { UploadForm } from "./UploadForm"
import { createVideoThumbnail } from "./create-video-thumbnail"
import type { Thumbnail } from "./types"
import { useConfig } from "./useConfig"

export function Home() {
  const { config } = useConfig()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)

  function uploadHandler(file: File) {
    setVideoFile(file)
  }

  useEffect(() => {
    console.log({ USE_EFFECT_CONFIG: config })

    if (videoFile) {
      createVideoThumbnail(videoFile, config)
        .then((dataURI) => {
          setThumbnails((prev) => [...prev, { dataURI, config }])
          console.log("Thumbnail created:", dataURI)
        })
        .catch((error) => {
          console.error("Error creating thumbnail:", error)
        })
    }
  }, [videoFile, config])

  return (
    <div>
      Upload a video
      <UploadForm onUpload={uploadHandler} />
      <Config />
      <DisplayThumbnails thumbnails={thumbnails} />
    </div>
  )
}
