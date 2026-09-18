import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'

/**
 * One link component for the whole site: routes ("/app/...") go through the router
 * so the page doesn't reload, in-page anchors and external URLs stay plain <a>.
 */
export function SmartLink({ href = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  if (href.startsWith('/')) return <Link to={href} {...rest} />
  return <a href={href} {...rest} />
}
