export function UploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get("video") as File | null

    if (file) {
      onUpload(file)
    }
  }
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
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
      </form>
      {/* <p>Supported formats: MP4, AVI, MKV, MOV</p> */}
      <p>
        Select a video file from your computer.
        <br />
        It won't be uploaded to any server.
        <br />
        Stays in your browser.
      </p>
    </div>
  )
}
