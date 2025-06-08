import classes from "./VideoError.module.scss"

export function VideoError({ error }: { error: Error }) {
  return (
    <article className={classes.error}>
      <header>Error!</header>
      <p>The video could not be turned into thumbnails</p>
      <pre>{error.toString()}</pre>
    </article>
  )
}
