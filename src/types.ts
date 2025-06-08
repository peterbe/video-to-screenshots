import type { Options } from "./create-video-thumbnail"

export type Thumbnail = {
  dataURI: string
  name: string
  config: Options
  videoMetadata: VideoMetadata
}

export type FileUpload = {
  file: File
  name: string
}

export type VideoMetadata = {
  duration: number
  width: number
  height: number
}
