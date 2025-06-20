import { memo } from "react"
import { formatBytes } from "./formatBytes"
import { formatDuration } from "./formatDuration"
import classes from "./ShowThumbnail.module.scss"
import type { Thumbnail } from "./types"

function getBlob(dataUri: string, mimeType?: string): Blob {
  // Parse the data URI
  const [header, data] = dataUri.split(",")

  if (!header || !data) {
    throw new Error("Invalid data URI format")
  }

  // Extract MIME type from header or use provided override
  const headerMatch = header.match(/data:([^;]+)/)
  const extractedMimeType = headerMatch
    ? headerMatch[1]
    : "application/octet-stream"
  const finalMimeType = mimeType || extractedMimeType

  // Check if data is base64 encoded
  const isBase64 = header.includes("base64")

  // Convert data to blob
  let blob: Blob

  if (isBase64) {
    const binaryString = atob(data)
    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    blob = new Blob([bytes], { type: finalMimeType })
  } else {
    // Handle URL-encoded data
    const decodedData = decodeURIComponent(data)
    blob = new Blob([decodedData], { type: finalMimeType })
  }
  return blob
}
function downloadDataUri(
  blob: Blob,
  filename: string,
  mimeType?: string,
): void {
  const [stem] = fileNameSplit(filename)
  const suffix =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg"
  const imageFilename = `${stem}.${suffix}`

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = imageFilename
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function fileNameSplit(filename: string): [string, string] {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return [filename, ""]
  }
  const stem = filename.slice(0, lastDotIndex)
  const ext = filename.slice(lastDotIndex + 1)
  return [stem, ext]
}

export const ShowThumbnail = memo(_ShowThumbnail, (prevProps, nextProps) => {
  // Only re-render if the thumbnail or focus state changes
  return (
    prevProps.thumbnail === nextProps.thumbnail &&
    prevProps.index === nextProps.index &&
    prevProps.isFocused === nextProps.isFocused
  )
})

function _ShowThumbnail({
  thumbnail,
  focusThumbnail,
  index,
  isFocused = false,
}: {
  thumbnail: Thumbnail
  focusThumbnail: (t: number) => void
  index: number
  isFocused?: boolean
}) {
  //   const { dataURI, name, config, videoMetadata } = thumbnail
  const { dataURI, name, config } = thumbnail
  const blob = getBlob(dataURI, config.format)
  return (
    <article>
      <header>
        <strong>
          #{thumbnail.index + 1} at {formatDuration(config.captureTime)}
        </strong>
      </header>
      <img
        src={dataURI}
        alt={`At ${formatDuration(config.captureTime)}`}
        className={isFocused ? classes.imageFocused : classes.imageNotFocused}
        onClick={() => focusThumbnail(index)}
        onKeyDown={() => focusThumbnail(index)}
      />

      <footer>
        <button
          type="button"
          onClick={() => downloadDataUri(blob, name, config.format)}
          data-tooltip={formatBytes(blob.size)}
        >
          Download
        </button>
      </footer>
    </article>
  )
}
