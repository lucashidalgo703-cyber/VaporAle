// Helper functions para obtener datos activos (localStorage o products.js por defecto)
function getActiveConfig() {
    try {
        const stored = localStorage.getItem("vaporale_config");
        return stored ? JSON.parse(stored) : STORE_CONFIG;
    } catch(e) {
        return STORE_CONFIG;
    }
}

function getActiveCategories() {
    try {
        const stored = localStorage.getItem("vaporale_categories");
        return stored ? JSON.parse(stored) : CATEGORIES;
    } catch(e) {
        return CATEGORIES;
    }
}

function getActiveProducts() {
    try {
        const stored = localStorage.getItem("vaporale_products");
        return stored ? JSON.parse(stored) : PRODUCTS;
    } catch(e) {
        return PRODUCTS;
    }
}

// Estado de la aplicación
let activeCategory = "all";
let searchQuery = "";
let cart = [];

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
    checkAgeVerification();
    loadCartFromStorage();
    renderCategories();
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// 1. Verificación de Edad (+18)
function checkAgeVerification() {
    const isVerified = localStorage.getItem("vape_age_verified");
    const modal = document.getElementById("age-verification-modal");
    if (!isVerified && modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function verifyAge(isAdult) {
    const modal = document.getElementById("age-verification-modal");
    const config = getActiveConfig();
    if (isAdult) {
        localStorage.setItem("vape_age_verified", "true");
        if (modal) modal.classList.add("hidden");
        document.body.style.overflow = "auto";
    } else {
        alert("Lo sentimos. Este sitio es exclusivo para mayores de " + (config.minAge || 18) + " años.");
        window.location.href = "https://www.google.com";
    }
}

// 2. Renderizado de Categorías con paleta Cyan Eléctrico
function renderCategories() {
    const container = document.getElementById("categories-container");
    if (!container) return;

    const categories = getActiveCategories();

    container.innerHTML = categories.map(cat => `
        <button 
            onclick="setCategory('${cat.id}')"
            class="category-btn px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeCategory === cat.id 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105" 
                    : "bg-slate-900/80 text-gray-300 hover:text-white hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-500/50"
            }"
            id="cat-btn-${cat.id}">
            <i class="fas ${cat.icon || 'fa-tag'} text-xs ${activeCategory === cat.id ? 'text-white' : 'text-cyan-400'}"></i>
            <span>${cat.name}</span>
        </button>
    `).join("");
}

function setCategory(categoryId) {
    activeCategory = categoryId;
    renderCategories();
    renderProducts();
}

// 3. Renderizado del Catálogo de Productos
function renderProducts() {
    const grid = document.getElementById("products-grid");
    const countLabel = document.getElementById("results-count");
    if (!grid) return;

    const products = getActiveProducts();
    const config = getActiveConfig();

    const filtered = products.filter(prod => {
        const matchesCategory = activeCategory === "all" || prod.category === activeCategory;
        const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (prod.specs && prod.specs.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if (countLabel) {
        countLabel.textContent = `${filtered.length} productos disponibles`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-gray-500">
                <i class="fas fa-smoking text-5xl mb-4 text-cyan-500/40 animate-pulse block"></i>
                <h3 class="text-xl font-bold text-gray-300">No encontramos ningún producto</h3>
                <p class="text-sm mt-1">Prueba con otra palabra clave o cambia de categoría.</p>
                <button onclick="clearFilters()" class="mt-4 px-5 py-2.5 glow-btn text-white rounded-xl text-xs font-bold">
                    Ver todos los productos
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(prod => `
        <div class="glow-card rounded-2xl overflow-hidden flex flex-col justify-between group">
            <div class="relative overflow-hidden cursor-pointer bg-slate-950" onclick="openProductModal('${prod.id}')">
                <img 
                    src="${prod.image || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}" 
                    alt="${prod.name}" 
                    class="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'">
                
                ${prod.badge ? `
                    <span class="absolute top-3 left-3 badge-cyan text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        ${prod.badge}
                    </span>
                ` : ""}

                ${prod.brand ? `
                    <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-cyan-300 text-xs px-2.5 py-1 rounded-lg border border-cyan-500/20 font-semibold">
                        ${prod.brand}
                    </span>
                ` : ""}
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer" onclick="openProductModal('${prod.id}')">
                        ${prod.name}
                    </h3>
                    ${prod.specs ? `
                        <p class="text-xs text-cyan-400/90 font-medium mt-1 flex items-center gap-1.5">
                            <i class="fas fa-check-circle text-[10px] text-cyan-400"></i> ${prod.specs}
                        </p>
                    ` : ""}
                    <p class="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        ${prod.description || ""}
                    </p>
                </div>

                <div class="mt-5 pt-4 border-t border-cyan-500/10 flex items-center justify-between">
                    <div>
                        <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Precio</span>
                        <div class="text-xl font-black text-white">
                            ${config.currency}${Number(prod.price).toLocaleString()}
                        </div>
                    </div>
                    <button 
                        onclick="addToCart('${prod.id}')"
                        class="glow-btn text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 transition-all">
                        <i class="fas fa-cart-plus"></i>
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function clearFilters() {
    activeCategory = "all";
    searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    renderCategories();
    renderProducts();
}

// 4. Gestión del Carrito
function addToCart(productId) {
    const products = getActiveProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            specs: product.specs || "",
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`¡"${product.name}" agregado al carrito!`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

function clearCart() {
    if (confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }
}

function saveCartToStorage() {
    localStorage.setItem("vape_cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem("vape_cart");
        if (stored) cart = JSON.parse(stored);
    } catch (e) {
        cart = [];
    }
}

function updateCartUI() {
    const badge = document.getElementById("cart-badge");
    const drawerItems = document.getElementById("cart-items-container");
    const totalAmount = document.getElementById("cart-total-amount");
    const emptyState = document.getElementById("cart-empty-state");
    const footerActions = document.getElementById("cart-footer");
    const config = getActiveConfig();

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (badge) {
        badge.textContent = totalCount;
        badge.style.display = totalCount > 0 ? "flex" : "none";
    }

    if (!drawerItems) return;

    if (cart.length === 0) {
        drawerItems.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        if (footerActions) footerActions.classList.add("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (footerActions) footerActions.classList.remove("hidden");

    drawerItems.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 bg-slate-900/60 border border-cyan-500/15 p-3 rounded-2xl">
            <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-cyan-500/20" onerror="this.src='https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'">
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate">${item.name}</h4>
                <p class="text-xs text-cyan-400">${item.specs}</p>
                <span class="text-xs font-semibold text-gray-300">
                    ${config.currency}${item.price.toLocaleString()} c/u
                </span>
            </div>
            <div class="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-cyan-500/20">
                <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-cyan-400">
                    <i class="fas fa-minus text-[10px]"></i>
                </button>
                <span class="text-xs font-bold text-white w-4 text-center">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-cyan-400">
                    <i class="fas fa-plus text-[10px]"></i>
                </button>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-gray-500 hover:text-red-400 p-1.5 transition-colors">
                <i class="fas fa-trash-alt text-xs"></i>
            </button>
        </div>
    `).join("");

    if (totalAmount) {
        totalAmount.textContent = `${config.currency}${totalPrice.toLocaleString()}`;
    }
}

// 5. Drawer del Carrito (Abrir / Cerrar)
function toggleCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer || !overlay) return;

    const isOpen = !drawer.classList.contains("translate-x-full");
    if (isOpen) {
        drawer.classList.add("translate-x-full");
        overlay.classList.add("hidden");
        document.body.style.overflow = "auto";
    } else {
        drawer.classList.remove("translate-x-full");
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

// 6. Checkout a WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const config = getActiveConfig();
    const customerName = document.getElementById("checkout-name")?.value.trim() || "Cliente";
    const customerAddress = document.getElementById("checkout-address")?.value.trim() || "A coordinar";
    const paymentMethod = document.getElementById("checkout-payment")?.value || "Efectivo / Transferencia";
    const notes = document.getElementById("checkout-notes")?.value.trim() || "Sin notas adicionales";

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let message = `*🛒 NUEVO PEDIDO - ${(config.storeName || 'VAPORALE').toUpperCase()}*\n`;
    message += `--------------------------------------\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📍 *Dirección/Envío:* ${customerAddress}\n`;
    message += `💳 *Método de pago:* ${paymentMethod}\n`;
    if (notes && notes !== "Sin notas adicionales") {
        message += `📝 *Notas:* ${notes}\n`;
    }
    message += `--------------------------------------\n`;
    message += `*📦 DETALLE DEL PEDIDO:*\n\n`;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        message += `• *${item.quantity}x* ${item.name}\n`;
        message += `   _(${config.currency}${item.price.toLocaleString()} c/u) = ${config.currency}${subtotal.toLocaleString()}_\n`;
    });

    message += `\n--------------------------------------\n`;
    message += `💰 *TOTAL A PAGAR: ${config.currency}${total.toLocaleString()}*\n`;
    message += `--------------------------------------\n`;
    message += `_Hola! Quiero confirmar este pedido y coordinar la entrega con VaporAle. Muchas gracias._`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
}

// 7. Modal de Vista Rápida de Producto
function openProductModal(productId) {
    const products = getActiveProducts();
    const config = getActiveConfig();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("product-detail-modal");
    const container = document.getElementById("product-modal-content");
    if (!modal || !container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div class="rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/20">
                <img src="${product.image || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}" alt="${product.name}" class="w-full h-80 object-cover" onerror="this.src='https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'">
            </div>
            <div>
                <span class="text-xs uppercase tracking-wider font-bold text-cyan-400">${product.brand || 'VaporAle'} • ${product.category}</span>
                <h2 class="text-2xl font-black text-white mt-1">${product.name}</h2>
                ${product.specs ? `
                    <div class="inline-block bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs px-3 py-1 rounded-full font-semibold mt-2">
                        ${product.specs}
                    </div>
                ` : ""}
                <p class="text-sm text-gray-300 mt-4 leading-relaxed">${product.description || ""}</p>
                <div class="mt-6">
                    <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Precio</span>
                    <div class="text-3xl font-black text-white">
                        ${config.currency}${Number(product.price).toLocaleString()}
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button 
                        onclick="addToCart('${product.id}'); closeProductModal();"
                        class="flex-1 glow-btn text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                        <i class="fas fa-cart-plus"></i> Agregar al carrito
                    </button>
                    <button 
                        onclick="closeProductModal()"
                        class="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-bold text-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

// 8. Notificación Toast
function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-enter bg-slate-900 border border-cyan-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto text-sm";
    toast.innerHTML = `
        <i class="fas fa-check-circle text-cyan-400 text-base"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// 9. Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const drawer = document.getElementById("cart-drawer");
            if (drawer && !drawer.classList.contains("translate-x-full")) {
                toggleCart();
            }
            closeProductModal();
        }
    });
}
