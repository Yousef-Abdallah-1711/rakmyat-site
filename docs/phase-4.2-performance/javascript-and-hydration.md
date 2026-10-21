# JavaScript and hydration

`LegacySliderRuntime` now mounts only on Home, where the client carousel markup exists. `MediaLightbox` mounts only on project detail pages, where project gallery links are rendered. This scopes runtime effects and event listeners to the routes that use them while keeping carousel and gallery behavior intact.

The modules remain statically imported; this work does not claim a smaller JavaScript chunk. Lighthouse estimated about 153 KiB of unused JavaScript on Home, including third-party or legacy runtime assets. Exact bundle ownership and a safe code-splitting pass remain future work. The 32-report comparison shows no median mobile TBT reduction (168 to 175 ms), so JavaScript is not presented as a measured performance win.
