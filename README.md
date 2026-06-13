# Can You Dig It? Retro Website

This is a static website for canyoudigitretro.com.

## Brand Assets

The supplied brand icon is saved at `assets/brand-logo.jpg` and is used in the header, hero, footer, and browser favicon.

## Updating Shirt Products

1. Add your shirt images to `shirt-images/`.
2. Open `products.js`.
3. Update each product's `image` filename, name, description, price, sizes, and placement options.

Image placement options:

- `imageFit: "contain"` keeps the whole shirt visible.
- `imageFit: "cover"` fills the image area and may crop.
- `imagePosition: "center"` controls the crop/placement.
- `imagePadding: "20px"` adds breathing room around the shirt.

The product cards are generated automatically from `products.js`.
