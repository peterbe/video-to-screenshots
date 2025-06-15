import { useRef, useState } from "react"

export function UploadForm({
  onUpload,
  onReset,
}: { onUpload: (file: File) => void; onReset: () => void }) {
  const [hasFile, setHasFile] = useState(false)
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setHasFile(true)
      onUpload(file)
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
      <form>
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </form>
      {/* <p>Supported formats: MP4, AVI, MKV, MOV</p> */}
      {hasFile ? (
        <button type="button" className="secondary" onClick={handleReset}>
          Reset
        </button>
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
  )
}
