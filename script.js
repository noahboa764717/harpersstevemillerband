document.addEventListener("DOMContentLoaded", () => {
    const products = Array.isArray(window.SHIRT_PRODUCTS) ? window.SHIRT_PRODUCTS : [];
    let cart = JSON.parse(localStorage.getItem("retroCart") || "[]");

    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const productsGrid = document.getElementById("productsGrid");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cartTotal");
    const cartLink = document.querySelector(".cart-link");
    const cartClose = document.querySelector(".cart-close");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const toast = document.getElementById("toast");

    function money(value) {
        return `$${Number(value).toFixed(2)}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderProducts() {
        if (!productsGrid) return;

        if (!products.length) {
            productsGrid.innerHTML = '<p class="cart-empty">Add products in products.js to show your shirts here.</p>';
            return;
        }

        productsGrid.innerHTML = products.map((product) => {
            const sizes = product.sizes || ["S", "M", "L", "XL"];
            const backImage = product.backImage
                ? `<img class="product-image-back" src="${escapeHtml(product.backImage)}" alt="${escapeHtml(product.backAlt || `${product.name} back`)}" loading="lazy">`
                : "";
            const style = [
                product.background ? `--product-bg: ${product.background}` : "",
                product.imageFit ? `--image-fit: ${product.imageFit}` : "",
                product.imagePosition ? `--image-position: ${product.imagePosition}` : "",
                product.imagePadding ? `--image-padding: ${product.imagePadding}` : ""
            ].filter(Boolean).join("; ");

            return `
                <article class="product-card">
                    <div class="product-image" style="${style}">
                        <img class="product-image-front" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt || product.name)}" loading="lazy">
                        ${backImage}
                    </div>
                    <div class="product-info">
                        <h3>${escapeHtml(product.name)}</h3>
                        <p class="band-ref">${escapeHtml(product.tagline || "Custom vintage raglan")}</p>
                        <p class="desc">${escapeHtml(product.description || "")}</p>
                        <div class="product-meta">
                            <span class="price">${money(product.price)}</span>
                            <select class="size-select" aria-label="Choose size for ${escapeHtml(product.name)}">
                                ${sizes.map((size) => `<option value="${escapeHtml(size)}">${escapeHtml(size)}</option>`).join("")}
                            </select>
                        </div>
                        <button class="btn btn-secondary btn-add-cart" type="button" data-product-id="${escapeHtml(product.id)}">Add to Cart</button>
                    </div>
                </article>
            `;
        }).join("");
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;

        if (!cartItems || !cartTotal) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty. Go dig up some tees.</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <h4>${escapeHtml(item.name)}</h4>
                        <p>Size: ${escapeHtml(item.size)} / Qty: ${item.quantity}</p>
                        <p class="cart-line-price">${money(item.price * item.quantity)}</p>
                    </div>
                    <button class="cart-item-remove" type="button" data-index="${index}" aria-label="Remove ${escapeHtml(item.name)}">X</button>
                </div>
            `).join("");

            document.querySelectorAll(".cart-item-remove").forEach((button) => {
                button.addEventListener("click", (event) => {
                    removeFromCart(Number(event.currentTarget.dataset.index));
                });
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = money(total);
        localStorage.setItem("retroCart", JSON.stringify(cart));
    }

    function addToCart(product, size) {
        const existingIndex = cart.findIndex((item) => item.id === product.id && item.size === size);

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                size,
                quantity: 1
            });
        }

        updateCartUI();
        showToast(`Added ${product.name} in ${size}.`);
        openCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function openCart() {
        cartSidebar?.classList.add("open");
        cartOverlay?.classList.add("open");
        cartSidebar?.setAttribute("aria-hidden", "false");
        document.body.classList.add("cart-open");
    }

    function closeCart() {
        cartSidebar?.classList.remove("open");
        cartOverlay?.classList.remove("open");
        cartSidebar?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-open");
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 2800);
    }

    renderProducts();

    navToggle?.addEventListener("click", () => {
        const isOpen = navMenu?.classList.toggle("open") || false;
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            navToggle?.setAttribute("aria-expanded", "false");
        });
    });

    productsGrid?.addEventListener("click", (event) => {
        const button = event.target.closest(".btn-add-cart");
        if (!button) return;

        const product = products.find((item) => item.id === button.dataset.productId);
        const sizeSelect = button.closest(".product-card")?.querySelector(".size-select");
        if (product) addToCart(product, sizeSelect?.value || "M");
    });

    cartLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openCart();
    });

    cartClose?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);

    checkoutBtn?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }
        showToast("Checkout is ready to connect when your store platform is set.");
    });

    updateCartUI();
});
