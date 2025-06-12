import { expect, test } from "bun:test"

const cases = [
  ["dist/index.html", "Video to Screenshots"],
  ["dist/about.html", "About"],
]

test.each(cases)("%s should have html and title", async (file, title) => {
  const html = await Bun.file(file).text()
  expect(html).not.toContain('<div id="root"></div>')
  const match = html.match(/<title>(.*)<\/title>/)
  expect(match).not.toBeNull()
  if (match) {
    expect(match[1]).toContain(title)
  }
})
