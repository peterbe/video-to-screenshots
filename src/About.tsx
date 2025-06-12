import { ABOUT } from "./titles"
import { useDocumentTitle } from "./useDocumentTitle"

export function About() {
  useDocumentTitle(ABOUT)
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}
