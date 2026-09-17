/**
 * A drop-in replacement for <img> that serves WebP with the original JPEG/PNG
 * as the fallback.
 *
 * Every photo on the site has a `.webp` sibling generated beside it (same path,
 * swapped extension). This wraps the same <img> in a <picture> and adds one
 * WebP <source> whose srcSet is the original's with each extension swapped —
 * so a WebP-capable browser downloads the smaller file and everything else
 * gets exactly the <img> it got before.
 *
 * All other props (className, alt, width, height, style, loading, fetchPriority,
 * …) pass straight through to the <img>, so swapping `<img …/>` for
 * `<Picture …/>` needs no other change. `picture { display: contents }` in
 * base.css keeps the wrapper out of layout, so existing `img` styles still
 * apply.
 */
const toWebp = (value) => value.replace(/\.(?:jpe?g|png)(?=$|\s|,|\))/gi, '.webp');

export function Picture({ src, srcSet, sizes, ...img }) {
  const webpSrcSet = srcSet ? toWebp(srcSet) : (src ? toWebp(src) : undefined);
  return (
    <picture>
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      <img src={src} srcSet={srcSet} sizes={sizes} {...img} />
    </picture>
  );
}
