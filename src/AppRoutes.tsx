import { Route, Routes } from "react-router"
import { Home } from "./Home"
import { Layout } from "./Layout"
import { ConfigContext } from "./configContext"
import { useConfig } from "./useConfig"

// Has to be a default export for the pre-render script to work
export default function AppRoutes() {
  //   const [config, setConfigState] = useState<Config>(initialConfig);

  // const setConfig = (newConfig: Partial<Config>): void => {
  //   setConfigState(prev => ({ ...prev, ...newConfig }));
  // };
  const [config, setConfig] = useConfig()

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </ConfigContext.Provider>
  )
}
