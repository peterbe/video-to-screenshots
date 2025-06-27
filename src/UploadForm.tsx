import { useRef, useState } from "react"
import { useConfig } from "./configContext"
import type { Options } from "./create-video-thumbnail"

export function UploadForm({
  onUpload,
  onReset,
}: {
  onUpload: (file: File, config: Options) => void
  onReset: () => void
}) {
  const { config } = useConfig()
  const [hasFile, setHasFile] = useState(false)
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setHasFile(true)
      onUpload(file, config)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleReset() {
    if (fileInputRef.current) fileInputRef.current.value = ""
    onReset()
    setHasFile(false)
  }

  return (
    <div>
      <div className="grid">
        <form>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </form>
        {hasFile ? (
          <p style={{ textAlign: "right" }}>
            <button type="button" className="secondary" onClick={handleReset}>
              Reset
            </button>
          </p>
        ) : (
          <p>
            Select a video file from your computer.
            <br />
            It won't be uploaded to any server.
            <br />
            Stays in your browser.
          </p>
        )}
      </div>
    </div>
  )
}
