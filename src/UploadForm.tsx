import type { FileUpload } from "./types"

export function UploadForm({
  onUpload,
}: { onUpload: (file: FileUpload) => void }) {
  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get("video") as File | null
    console.log({ file })

    if (file) {
      // onUpload(file)
    }
  }
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      // onUpload(file)
    }
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleFileChange}
        />
        {/* <button type="submit">Upload locally</button> */}
      </form>
      <p>Supported formats: MP4, AVI, MKV, MOV</p>
    </div>
  )
}
