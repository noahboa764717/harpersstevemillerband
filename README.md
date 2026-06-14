# Can You Dig It? Retro Website

This is a static website for canyoudigitretro.com.

The main visual system lives in `styles.css`. New storefront features and responsive polish live in `enhancements.css`, which loads after the base stylesheet.

## Brand Assets

The supplied brand icon is saved at `assets/brand-logo.jpg` and is used in the header, hero, footer, browser favicon, and link previews.

## Updating Shirt Products

1. Add your shirt images to `shirt-images/`.
2. Open `products.js`.
3. Update each product's `image` and `backImage` filenames, name, description, price, sizes, and placement options.

Image placement options:

- `imageFit: "contain"` keeps the whole shirt visible.
- `imageFit: "cover"` fills the image area and may crop.
- `imagePosition: "center"` controls the crop/placement.
- `imagePadding: "20px"` adds breathing room around the shirt.

The product cards are generated automatically from `products.js`. Product detail popups also read from that file, so update `fit`, `fabric`, `turnaround`, and `care` when you add a new shirt.

When a product has a `backImage`, the listing swaps from the front photo to the back photo on hover. On smaller screens, shoppers can use the Front/Back buttons.

## Checkout

The cart creates a prefilled email order to `hello@canyoudigitretro.com`. If you later add Shopify, Stripe, PayPal, or another store platform, replace the checkout handler in `script.js`.
