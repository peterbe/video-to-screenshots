import { useState } from "react"
import { ShowThumbnail } from "./ShowThumbnail"
import type { Thumbnail } from "./types"
import { useOnEscape } from "./useOnEscape"

export function DisplayThumbnails({ thumbnails }: { thumbnails: Thumbnail[] }) {
  const [focusThumbnailIndex, setFocusThumbnailIndex] = useState<number | null>(
    null,
  )
  const PER_ROW = 3
  const groups = chunkArray<Thumbnail>(thumbnails, PER_ROW)

  useOnEscape(() => {
    setFocusThumbnailIndex(null)
  })

  if (focusThumbnailIndex !== null) {
    return (
      <div>
        <button type="button" onClick={() => setFocusThumbnailIndex(null)}>
          Close
        </button>
        <ShowThumbnail
          index={focusThumbnailIndex}
          thumbnail={thumbnails[focusThumbnailIndex]}
          isFocused={true}
          focusThumbnail={() => setFocusThumbnailIndex(null)}
        />
      </div>
    )
  }

  return (
    <div>
      {groups.map((thumbnails, index) => {
        const spacer =
          thumbnails.length < PER_ROW
            ? new Array(PER_ROW - thumbnails.length).fill(null)
            : []

        return (
          <div className="grid" key={index}>
            {thumbnails.map((thumbnail) => {
              const key = [
                thumbnail.name,
                thumbnail.index,
                thumbnail.config.captureTime,
                thumbnail.config.quality,
                thumbnail.config.format,
              ]
                .map((x) => `${x}`)
                .join("")

              return (
                <ShowThumbnail
                  key={key}
                  index={thumbnail.index}
                  isFocused={false}
                  thumbnail={thumbnail}
                  focusThumbnail={(number) => {
                    console.log({ CLICKED_ON: number })

                    setFocusThumbnailIndex(number)
                  }}
                />
              )
            })}
            {spacer.map((_, index) => (
              <div key={index} className="spacer" />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function chunkArray<T>(array: T[], chunkSize = 3): T[][] {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}
