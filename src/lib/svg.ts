/**
 * Make an official SVG file sizeable by CSS without touching its artwork: drop the
 * XML prolog/doctype and the fixed width/height on the ROOT <svg> only. Inner
 * elements keep theirs (clip-path rects need them), and a viewBox is added from
 * the old width/height when the file has none. This is a resize, nothing more.
 */
export function resizeOnly(svg: string): string {
  const clean = svg.replace(/<\?xml[^>]*>/g, '').replace(/<!DOCTYPE[^>]*>/gi, '').replace(/<!--[\s\S]*?-->/g, '')
  return clean.replace(/<svg\b[^>]*>/i, (tag) => {
    const w = /\swidth="([\d.]+)(?:px)?"/i.exec(tag)?.[1]
    const h = /\sheight="([\d.]+)(?:px)?"/i.exec(tag)?.[1]
    let next = tag.replace(/\s(?:width|height)="[^"]*"/gi, '')
    if (!/viewBox=/i.test(next) && w && h) next = next.replace(/<svg/i, `<svg viewBox="0 0 ${w} ${h}"`)
    return next.replace(/<svg/i, '<svg preserveAspectRatio="xMidYMid meet"')
  })
}
