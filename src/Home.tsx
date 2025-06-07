import { useEffect, useState } from "react"
import { Config } from "./Config"
import { DisplayThumbnails } from "./DisplayThumbnails"
import { UploadForm } from "./UploadForm"
import { useConfig } from "./configContext"
import { createVideoThumbnail } from "./create-video-thumbnail"
import type { FileUpload, Thumbnail } from "./types"

export function Home() {
  const { config } = useConfig()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [fileUpload, setFileUpload] = useState<FileUpload | null>(null)

  function uploadHandler(fileUpload: FileUpload) {
    setFileUpload(fileUpload)
  }

  useEffect(() => {
    if (fileUpload) {
      createVideoThumbnail(fileUpload.file, config)
        .then((dataURI) => {
          setThumbnails((prev) => [
            ...prev,
            { dataURI, name: fileUpload.name, config },
          ])
          console.log("Thumbnail created:", dataURI)
        })
        .catch((error) => {
          console.error("Error creating thumbnail:", error)
        })
    }
  }, [fileUpload, config])

  return (
    <div>
      Upload a video
      <UploadForm onUpload={uploadHandler} />
      <Config />
      <DisplayThumbnails thumbnails={thumbnails} />
    </div>
  )
}
