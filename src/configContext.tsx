import { type ReactNode, createContext, useEffect, useState } from "react"
import type { Options } from "./create-video-thumbnail"

interface ConfigContextValue {
  config: Options
  setConfig: (newConfig: Partial<Options>) => void
}

const defaultConfig: Options = {
  maxWidth: 900,
  maxHeight: 507,
  quality: 0.85,
  captureTime: 0.1,
  format: "image/jpeg",
}

export const ConfigContext = createContext<ConfigContextValue | undefined>(
  undefined,
)

type ConfigProviderProps = {
  children: ReactNode
  initialConfig?: Options
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  initialConfig = defaultConfig,
}) => {
  const [config, setConfig] = useState<Options>(initialConfig)

  useEffect(() => {
    const storedConfig = localStorage.getItem("videoThumbnailConfig")
    if (storedConfig) {
      // XXX make safer
      setConfig(JSON.parse(storedConfig))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("videoThumbnailConfig", JSON.stringify(config))
  }, [config])

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
