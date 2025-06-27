import { useConfig } from "./configContext"
import type { Options } from "./create-video-thumbnail"

export function ChangeConfig({
  onChange,
}: {
  onChange: (config: Options) => void
}) {
  const { config, setConfig } = useConfig()
  function changeFormatHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    const format = event.target.value as Options["format"]
    setConfig({ format })
    onChange({ ...config, format })
  }
  return (
    <div>
      <label>
        Format:
        <select
          name="format"
          defaultValue={config.format}
          onChange={changeFormatHandler}
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </label>
    </div>
  )
}
