import { useConfig } from "./configContext"

export function ChangeConfig() {
  const { config, setConfig } = useConfig()
  console.log({ config, setConfig })

  return <div>change config</div>
}
