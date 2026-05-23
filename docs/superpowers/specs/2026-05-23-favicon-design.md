# Favicon Design

## Context

The site has no existing favicon links or favicon assets. It is an Astro personal portfolio for Seth Maxwell with a warm light editorial palette, text-only site branding, and Newsreader/Public Sans typography.

## Approved Direction

Use the selected "Editorial S" direction: a dark rounded-square mark with a cream serif `S`.

This direction is intentionally simple because favicon legibility matters most at 16px and 32px. The mark should feel related to the site's existing display typography without requiring the web font to load.

## Asset Set

Create favicon assets under `public/`:

- `favicon.svg`: canonical vector source for modern browsers.
- `favicon.ico`: compatibility icon for older browser and platform behavior.
- `favicon-16x16.png`: explicit browser tab raster size.
- `favicon-32x32.png`: explicit browser tab and bookmark raster size.
- `apple-touch-icon.png`: 180px iOS and pinned home-screen icon.

The SVG should use inline shapes and text so the file is self-contained. Raster outputs should be generated from the same visual source to avoid drift between platforms.

## Page Integration

Update `src/layouts/BaseLayout.astro` to include:

- SVG favicon link.
- PNG fallback links for 16px and 32px.
- Apple touch icon link.
- ICO shortcut fallback.
- `theme-color` matching the site surface color `#fdf8f7`.

## Visual Details

Use the existing site colors:

- Background for the mark: `#1c1b1b`.
- Foreground glyph: `#fdf8f7`.
- Browser theme color: `#fdf8f7`.

The favicon may use a system serif such as Georgia in the SVG source. The exported raster files capture the final glyph shape, so runtime font availability is not required for PNG and ICO formats.

## Testing

Verification should include:

- Confirm each generated asset exists.
- Confirm PNG and ICO dimensions are valid.
- Run the project build command to catch layout or Astro template errors.

No broader route or content behavior is in scope.
