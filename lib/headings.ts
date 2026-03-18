export interface TocHeading {
  id: string
  text: string
  level: number
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function extractHeadings(html: string): TocHeading[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/g
  const headings: TocHeading[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '')
    headings.push({ id: slugify(text), text, level: parseInt(match[1]) })
  }
  return headings
}

export function addHeadingIds(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const id = slugify(text)
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
}
