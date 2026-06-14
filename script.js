document.addEventListener("DOMContentLoaded", () => {
    const products = Array.isArray(window.SHIRT_PRODUCTS) ? window.SHIRT_PRODUCTS : [];
    let cart = JSON.parse(localStorage.getItem("retroCart") || "[]");
    const validProductIds = new Set(products.map((product) => product.id));
    cart = cart.filter((item) => validProductIds.has(item.id));

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
    const productModal = document.getElementById("productModal");
    const modalImage = document.getElementById("modalImage");
    const modalTagline = document.getElementById("modalTagline");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalFit = document.getElementById("modalFit");
    const modalFabric = document.getElementById("modalFabric");
    const modalTurnaround = document.getElementById("modalTurnaround");
    const modalCare = document.getElementById("modalCare");

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
            const toggle = product.backImage
                ? `<div class="image-toggle" aria-label="Choose product image">
                        <button class="active" type="button" data-view="front">Front</button>
                        <button type="button" data-view="back">Back</button>
                   </div>`
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
                        ${toggle}
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
                        <div class="product-actions">
                            <button class="btn btn-quiet btn-view-details" type="button" data-product-id="${escapeHtml(product.id)}">View Details</button>
                            <button class="btn btn-secondary btn-add-cart" type="button" data-product-id="${escapeHtml(product.id)}">Add to Cart</button>
                        </div>
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

    function openProductModal(product) {
        if (!productModal || !product) return;
        if (modalImage) {
            modalImage.src = product.image;
            modalImage.alt = product.alt || product.name;
        }
        if (modalTagline) modalTagline.textContent = product.tagline || "Custom vintage raglan";
        if (modalTitle) modalTitle.textContent = product.name;
        if (modalDescription) modalDescription.textContent = product.description || "";
        if (modalFit) modalFit.textContent = product.fit || "Vintage-inspired fit.";
        if (modalFabric) modalFabric.textContent = product.fabric || "Soft cotton-feel tee.";
        if (modalTurnaround) modalTurnaround.textContent = product.turnaround || "Made to order.";
        if (modalCare) modalCare.textContent = product.care || "Wash cold inside out.";
        productModal.classList.add("open");
        productModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("cart-open");
        productModal.querySelector(".modal-close")?.focus();
    }

    function closeProductModal() {
        productModal?.classList.remove("open");
        productModal?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-open");
    }

    function checkoutByEmail() {
        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }

        const lines = cart.map((item) => (
            `${item.quantity} x ${item.name} / Size ${item.size} / ${money(item.price * item.quantity)}`
        ));
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const body = [
            "Hey Can You Dig It? Retro,",
            "",
            "I would like to order:",
            ...lines.map((line) => `- ${line}`),
            "",
            `Estimated subtotal: ${money(total)}`,
            "",
            "Name:",
            "Shipping address:",
            "Preferred contact:",
            "",
            "Please send payment and shipping details."
        ].join("\n");

        window.location.href = `mailto:hello@canyoudigitretro.com?subject=${encodeURIComponent("Can You Dig It? Retro order")}&body=${encodeURIComponent(body)}`;
        showToast("Opening your email order.");
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
        const toggleButton = event.target.closest(".image-toggle button");
        if (toggleButton) {
            const imageBox = toggleButton.closest(".product-image");
            const showBack = toggleButton.dataset.view === "back";
            imageBox?.classList.toggle("show-back", showBack);
            imageBox?.querySelectorAll(".image-toggle button").forEach((button) => {
                button.classList.toggle("active", button === toggleButton);
            });
            return;
        }

        const detailsButton = event.target.closest(".btn-view-details");
        if (detailsButton) {
            const product = products.find((item) => item.id === detailsButton.dataset.productId);
            openProductModal(product);
            return;
        }

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

    checkoutBtn?.addEventListener("click", checkoutByEmail);

    productModal?.querySelectorAll("[data-modal-close]").forEach((button) => {
        button.addEventListener("click", closeProductModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCart();
            closeProductModal();
        }
    });

    updateCartUI();
});
