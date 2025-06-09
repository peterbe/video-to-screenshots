import { formatBytes } from "./formatBytes"
import { formatDuration } from "./formatDuration"
import type { Thumbnail } from "./types"

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

function fileNameSplit(filename: string): [string, string] {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return [filename, ""]
  }
  const stem = filename.slice(0, lastDotIndex)
  const ext = filename.slice(lastDotIndex + 1)
  return [stem, ext]
}

export function DisplayThumbnails({ thumbnails }: { thumbnails: Thumbnail[] }) {
  return (
    <div>
      {thumbnails.map(({ dataURI, name, config, videoMetadata }, index) => {
        const blob = getBlob(dataURI, config.format)
        return (
          <article key={index}>
            <header>
              <strong>At {formatDuration(config.captureTime)}</strong>
            </header>
            <img src={dataURI} alt={`Thumbnail ${index + 1}`} />
            <footer>
              <div className="grid">
                <p>
                  {videoMetadata.width}x{videoMetadata.height}
                  &nbsp;
                  <small>{name}</small>
                </p>
                <button
                  type="button"
                  onClick={() => downloadDataUri(blob, name, config.format)}
                >
                  Download ({formatBytes(blob.size)})
                </button>
              </div>
              <p>Config:</p>
              <ul>
                <li>Max Width: {config.maxWidth}</li>
                <li>Max Height: {config.maxHeight}</li>
                <li>Quality: {config.quality}</li>
                <li>Capture Time: {config.captureTime}</li>
                <li>Format: {config.format}</li>
              </ul>
            </footer>
          </article>
        )
      })}
    </div>
  )
}
