import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import type { Options } from "./create-video-thumbnail"

// Define the config type

// Define the context value type
interface ConfigContextValue {
  config: Options
  setConfig: (newConfig: Partial<Options>) => void
}

// Default config
const defaultConfig: Options = {
  maxWidth: 900,
  maxHeight: 507,
  quality: 0.85,
  captureTime: 0.1,
  format: "image/jpeg",
}

// Create the context
export const ConfigContext = createContext<ConfigContextValue | undefined>(
  undefined,
)

// Props type for the provider
interface ConfigProviderProps {
  children: ReactNode
  initialConfig?: Options
}

// Context provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  initialConfig = defaultConfig,
}) => {
  // const [config, setConfigState] = useState<Options>(initialConfig)

  // const setConfig = (newConfig: Partial<Options>): void => {
  //   setConfigState((prev) => ({ ...prev, ...newConfig }))
  // }
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

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
