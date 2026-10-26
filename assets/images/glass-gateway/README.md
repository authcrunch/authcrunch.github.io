# Glass gateway homepage artwork

`source.png` is the selected Glass gateway illustration: an authentication
portal sends an identity through an authorization policy to three applications,
with two allowed and one denied. It is conceptual artwork, separate from the
actual portal screenshots in the getting-started guide.

The image was created with built-in image_gen. Its source hash and exact creative
briefs are retained in `provenance.json`. Preserve the selected PNG unchanged;
export the native-size WebP from that source. The published asset lives in
`static/img/home/`. The homepage pans across the same image without stretching
its aspect ratio. It uses the full 1672px-wide export even on phones so the
close-ups retain detail, with an eager/high-priority request and descriptive
alternative text.

From the repository root, export with `cwebp` (original export: version 1.6.0):

```sh
cwebp -quiet -q 86 -m 6 assets/images/glass-gateway/source.png -o static/img/home/glass-gateway-1672.webp
```

`cwebp` is needed only when exporting artwork; the site build consumes the saved
WebP files and needs no extra image tools. Keep the provenance asset dimensions
and hashes aligned if exports change.

The guided view repeats sign-in → access policy → allowed applications, using a
uniform scale and a camera translation within the image bounds. It has manual
stage choices, pause/play, and a whole-image view. Reduced motion and reading
without JavaScript show the full image. The light artwork canvas is intentional
in both site themes; do not invert its colors. The interactive request explorer
follows the artwork and remains a separate, keyboard-usable lesson.
