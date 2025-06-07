import { Route, Routes } from "react-router"
import { Home } from "./Home"
import { Layout } from "./Layout"
import { ConfigProvider, defaultConfig } from "./configContext"

// Has to be a default export for the pre-render script to work
export default function AppRoutes() {
  return (
    <ConfigProvider initialConfig={defaultConfig}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}
