import type { Options } from "./create-video-thumbnail"

export type Thumbnail = {
  dataURI: string
  name: string
  config: Options
}

export type FileUpload = {
  file: File
  name: string
}
