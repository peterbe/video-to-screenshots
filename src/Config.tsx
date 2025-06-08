import { useState } from "react"
import { useConfig } from "./configContext"

export function Config() {
  const { config, setConfig } = useConfig()

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const maxWidth = formData.get("maxWidth")
    const maxHeight = formData.get("maxHeight")
    const quality = formData.get("quality")

    const captureTime = formData.get("captureTime")
    const format = formData.get("format")

    const newValidationErrors: { [key: string]: string } = {}

    if (!quality) {
      newValidationErrors.quality = "Quality is required."
    } else {
      const qualityValue = Number.parseFloat(quality as string)
      if (Number.isNaN(qualityValue) || qualityValue < 0 || qualityValue > 1) {
        newValidationErrors.quality =
          "Quality must be a number between 0 and 1."
      }
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors)
      return
    }

    if (maxWidth && maxHeight && quality && captureTime && format) {
      const newConfig = {
        maxWidth: Number.parseInt(maxWidth as string, 10),
        maxHeight: Number.parseInt(maxHeight as string, 10),
        quality: Number.parseFloat(quality as string),
        captureTime: Number.parseFloat(captureTime as string),
        format: format as "image/jpeg" | "image/png" | "image/webp",
      }

      setConfig(newConfig)
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <fieldset className="grid">
        <label>
          Max Width:
          <input type="number" name="maxWidth" defaultValue={config.maxWidth} />
        </label>
        <label>
          Max Height:
          <input
            type="number"
            name="maxHeight"
            defaultValue={config.maxHeight}
          />
        </label>
      </fieldset>

      <fieldset className="grid">
        <label>
          Quality:
          <input
            type="number"
            name="quality"
            step="0.01"
            defaultValue={config.quality}
            aria-invalid={validationErrors.quality ? "true" : undefined}
            aria-describedby={
              validationErrors.quality ? "invalid-quality" : undefined
            }
          />
          {validationErrors.quality && (
            <small id="invalid-quality">{validationErrors.quality}</small>
          )}
        </label>
        <label>
          Capture Time (seconds):
          <input
            type="number"
            name="captureTime"
            step="0.01"
            defaultValue={config.captureTime}
            aria-invalid={validationErrors.captureTime ? "true" : undefined}
          />
        </label>

        <label>
          Format:
          <select name="format" defaultValue={config.format}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </label>
      </fieldset>
      <button type="submit">Save</button>
    </form>
  )
}
