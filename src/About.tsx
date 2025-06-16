import { Link } from "react-router"

export function About() {
  return (
    <div>
      <p>
        This is a free offline browser web where you can convert a video into
        picture screenshots at different times of the video.
      </p>
      <p>
        Your video is <strong>never uploaded</strong> to any server.
      </p>
      <p>
        The owner of this project is{" "}
        <a href="https://www.peterbe.com">Peter Bengtsson</a>.
      </p>
      <p>
        The code is all open source and available on{" "}
        <a href="https://github.com/peterbe/video-to-screenshots">
          github.com/peterbe/video-to-screenshots
        </a>
        .
      </p>
      <p>
        Please send your feedback to{" "}
        <a href="https://github.com/peterbe/video-to-screenshots/issues/new">
          the GitHub repo
        </a>
        .
      </p>
      <hr style={{ marginTop: 150, marginBottom: 50 }} />
      <p style={{ textAlign: "center" }}>
        <Link to="/">Back to Home page</Link>
      </p>
    </div>
  )
}
