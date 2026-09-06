/**
 * Size demo iframes to their content. Works because demos are same-origin;
 * the ResizeObserver keeps up with reflows (viewport, font load, animation).
 */
function fitToContent(iframe: HTMLIFrameElement): void {
  if (!iframe.contentDocument?.body) {
    return;
  }

  // Own const so the null-check above narrows inside the hoisted function.
  const root = iframe.contentDocument.documentElement;

  function apply(): void {
    // documentElement, not body: body is flex and reports the line height.
    const height = root.scrollHeight;

    if (height > 0) {
      iframe.style.height = `${height}px`;
    }
  }

  apply();

  const observer = new ResizeObserver(apply);
  observer.observe(root);
}

for (const iframe of document.querySelectorAll<HTMLIFrameElement>(
  'iframe[data-fit-to-content]',
)) {
  if (iframe.contentDocument?.readyState === 'complete') {
    fitToContent(iframe);
  } else {
    iframe.addEventListener('load', () => fitToContent(iframe));
  }
}
