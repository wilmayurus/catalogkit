---
name: Lexend variable font with Pillow
description: How to use Google's Lexend font (dyslexia-friendly) in both CSS and PIL-based image/PDF generation without static per-weight TTF files.
---

Google's `google/fonts` repo distributes Lexend only as a single variable font (`ofl/lexend/Lexend[wght].ttf`), not as static per-weight files (Regular/Bold/etc). Static-weight downloads from the usual raw.githubusercontent.com static path 404.

**Why this matters:** code that assumes static weight files (e.g. PIL's `ImageFont.truetype(path_to_bold_ttf, size)` pattern used for other fonts like DejaVu Sans) won't have per-weight files to point to.

**How to apply:** Pillow (>= 6.4.0, confirmed working on 12.2) can load the variable font once and select a weight at runtime via `font.set_variation_by_axes([weight])` (weight as int, e.g. 400/600/700/800) after `ImageFont.truetype(path, size)`. This avoids needing `fonttools` to instantiate static weight TTFs. Cache loaded font objects by `(weight, size)` since each size still needs its own `ImageFont` object. For web/CSS, just load the same variable font from Google Fonts CSS2 API (`family=Lexend:wght@400;500;600;700;800`) — browsers handle variable fonts natively.
