import { expect, test } from "bun:test"
import * as cheerio from "cheerio"

const CBASE = "https://video-to-screenshots.peterbe.com"
const cases = [
  ["dist/index.html", "Video to Screenshots", `${CBASE}/`],
  ["dist/about.html", "About: Video to Screenshots", `${CBASE}/about`],
]

test.each(cases)(
  "%s should have html and title",
  async (file, title, canonicalUrl) => {
    const html = await Bun.file(file).text()
    expect(html).not.toContain('<div id="root"></div>')
    const $ = cheerio.load(html)
    expect($("title").text()).toBe(title)
    expect($('link[rel="canonical"]').attr("href")).toBe(canonicalUrl)
  },
)
