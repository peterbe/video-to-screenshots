import type { Thumbnail } from "./types"

export function DisplayThumbnails({ thumbnails }: { thumbnails: Thumbnail[] }) {
  return (
    <div className="grid">
      {thumbnails.map(({ dataURI, name, config }, index) => (
        <article key={index}>
          <img src={dataURI} alt={`Thumbnail ${index + 1}`} />
          <footer>
            <p>
              {config.maxWidth}x{config.maxHeight}
              &nbsp;
              <small>{name}</small>
            </p>
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
      ))}
    </div>
  )
}
