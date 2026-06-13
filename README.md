# Can You Dig It? Retro Website

Static storefront for canyoudigitretro.com, a custom vintage baseball tee brand.

## Brand Asset

The supplied brand icon is saved at `assets/brand-icon.jpg` and is used in the header, hero, footer, and browser favicon.

## Updating Shirt Products

1. Add shirt images to `shirt-images/`.
2. Open `products.js`.
3. Update each product's `image`, name, description, price, sizes, and placement options.

Image placement options:

- `imageFit: "contain"` keeps the whole shirt visible.
- `imageFit: "cover"` fills the image area and may crop.
- `imagePosition: "center"` controls crop/placement.
- `imagePadding: "20px"` adds breathing room around the shirt.

The product cards are generated automatically from `products.js`.
