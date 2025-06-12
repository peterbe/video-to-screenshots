import { useState } from "react"
import { ShowThumbnail } from "./ShowThumbnail"
import type { Thumbnail } from "./types"
import { useOnEscape } from "./useOnEscape"

export function DisplayThumbnails({ thumbnails }: { thumbnails: Thumbnail[] }) {
  const [focusThumbnail, setFocusThumbnail] = useState<Thumbnail | null>(null)
  const groups = chunkArray<Thumbnail>(thumbnails, 3)

  useOnEscape(() => {
    setFocusThumbnail(null)
  })

  if (focusThumbnail) {
    return (
      <div>
        <button type="button" onClick={() => setFocusThumbnail(null)}>
          Close
        </button>
        <ShowThumbnail
          thumbnail={focusThumbnail}
          isFocused={true}
          focusThumbnail={(thumbnail) =>
            setFocusThumbnail((p) =>
              p?.config.captureTime === thumbnail.config.captureTime
                ? null
                : thumbnail,
            )
          }
        />
      </div>
    )
  }

  return (
    <div>
      {groups.map((thumbnails, index) => {
        const spacer =
          thumbnails.length < 3
            ? new Array(3 - thumbnails.length).fill(null)
            : []

        return (
          <div className="grid" key={index}>
            {thumbnails.map((thumbnail, index) => (
              <ShowThumbnail
                key={`${thumbnail.config.captureTime}${index}`}
                isFocused={false}
                thumbnail={thumbnail}
                focusThumbnail={(thumbnail) =>
                  setFocusThumbnail((p) =>
                    p?.config.captureTime === thumbnail.config.captureTime
                      ? null
                      : thumbnail,
                  )
                }
              />
            ))}
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
