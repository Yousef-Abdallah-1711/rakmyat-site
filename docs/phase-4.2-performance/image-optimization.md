# Image optimization

## Changes

Converted 21 large decorative or section images to lossless WebP. The source PNG files remain intact. Updated the existing image references and CSS backgrounds to use the WebP copies. The selected files total 3,749,735 bytes as PNG and 2,452,290 bytes as WebP, a 1,297,445-byte (34.6%) reduction before transfer compression. This includes the 1,252,468-byte `mob1.png` (now 968,438-byte WebP) and the Service Details `inner5_back` background (54,599 to 25,016 bytes).

Retained pixel dimensions, alpha, and visible pixel values. Conversion checks found no visible pixel differences in the tested transparent PNGs; transparent RGB values can differ where alpha is zero. Original PNGs remain available as fallback/source assets, but current references use WebP.

The first card on the Portfolio grid now requests its project cover eagerly with high fetch priority. Other cards remain lazy, as do Home and related project cards. This follows the trace finding that the first visible Schooly cover was the Arabic Portfolio LCP element despite being marked lazy.

## Limits

This is a fixed lossless asset selection, not a responsive art-direction pipeline. Project screenshots and existing Next Image optimization remain unchanged. Field bandwidth and browser cache behavior were not available for measurement.
