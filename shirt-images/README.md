# Shirt Image Folder

Put your shirt product images in this folder, then update `products.js` so each product uses the right filename.

Recommended product image setup:

- Use PNG, JPG, WebP, or SVG files.
- Transparent-background PNG or WebP files work best.
- Keep each product photo square or vertical when possible.
- Edit `imageFit`, `imagePosition`, and `imagePadding` in `products.js` if a specific shirt needs different placement.

Example:

```js
image: "shirt-images/my-new-shirt.png",
imageFit: "contain",
imagePosition: "center",
imagePadding: "20px"
```
