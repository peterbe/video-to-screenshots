import { Link, useLocation } from "react-router"
import { ABOUT, ROOT } from "./titles"
import { useDocumentTitle } from "./useDocumentTitle"

export function Head() {
  const { pathname } = useLocation()
  const title = pathname === "/about" ? ABOUT : ROOT
  useDocumentTitle(title)

  return (
    <header>
      <nav>
        <ul>
          <li>
            <h1>{title}</h1>
          </li>
        </ul>
        <ul>
          <li>
            {pathname !== "/" ? (
              <Link to="/">Back to Home page</Link>
            ) : (
              <Link to="/about">About</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
