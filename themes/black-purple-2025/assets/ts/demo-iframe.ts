/**
 * Size demo iframes to their content. Works because demos are same-origin;
 * the ResizeObserver keeps up with reflows (viewport, font load, animation).
 */
function fitToContent(iframe: HTMLIFrameElement): void {
  if (!iframe.contentDocument?.body) {
    return;
  }

  // Own const so the null-check above narrows inside the hoisted function.
  const body = iframe.contentDocument.body;

  function apply(): void {
    // Measure the children, not the document: body is stretched by the iframe,
    // so its own height always echoes the frame's and can never shrink. Body
    // is a centred flex row, so take the union of the child rects.
    const rects = [...body.children].map((c) => c.getBoundingClientRect());

    if (!rects.length) {
      return;
    }

    const height =
      Math.max(...rects.map((r) => r.bottom)) -
      Math.min(...rects.map((r) => r.top));

    if (height > 0) {
      iframe.style.height = `${Math.ceil(height)}px`;
    }
  }

  apply();

  const observer = new ResizeObserver(apply);

  for (const child of body.children) {
    observer.observe(child);
  }
}

for (const iframe of document.querySelectorAll<HTMLIFrameElement>(
  'iframe[data-fit-to-content]',
)) {
  // Always listen: a lazy iframe starts on about:blank, which already reports
  // readyState "complete", so an initial run alone would measure nothing.
  iframe.addEventListener('load', () => fitToContent(iframe));
  fitToContent(iframe);
}
