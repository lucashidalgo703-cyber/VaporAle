// Admin Panel Controller - VaporAle
let adminProducts = [];
let adminCategories = [];
let adminConfig = {};
let currentEditingProductId = null;
let currentEditingCategoryId = null;

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});

// 1. Autenticación simple con PIN
function checkAuth() {
    const isAuth = sessionStorage.getItem("vaporale_admin_auth");
    const loginModal = document.getElementById("admin-login-screen");
    const mainDashboard = document.getElementById("admin-dashboard");

    if (isAuth === "true") {
        if (loginModal) loginModal.classList.add("hidden");
        if (mainDashboard) mainDashboard.classList.remove("hidden");
        initDashboard();
    } else {
        if (loginModal) loginModal.classList.remove("hidden");
        if (mainDashboard) mainDashboard.classList.add("hidden");
    }
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const pinInput = document.getElementById("admin-pin-input");
    const errorMsg = document.getElementById("login-error-msg");
    const enteredPin = pinInput ? pinInput.value.trim() : "";

    // Cargar config guardada o fallback
    const config = getActiveConfig();
    const validPin = config.adminPin || "1234";

    if (enteredPin === validPin) {
        sessionStorage.setItem("vaporale_admin_auth", "true");
        if (errorMsg) errorMsg.classList.add("hidden");
        checkAuth();
    } else {
        if (errorMsg) {
            errorMsg.classList.remove("hidden");
            errorMsg.textContent = "PIN incorrecto. Intenta nuevamente.";
        }
    }
}

function handleLogout() {
    sessionStorage.removeItem("vaporale_admin_auth");
    window.location.reload();
}

// 2. Inicialización de Datos del Dashboard
function initDashboard() {
    loadData();
    renderProductsTable();
    renderCategoriesList();
    populateCategoryDropdowns();
    populateConfigForm();
    updateMetrics();
    setupAdminEvents();
}

function loadData() {
    adminConfig = getActiveConfig();
    adminCategories = getActiveCategories();
    adminProducts = getActiveProducts();
}

function getActiveConfig() {
    try {
        const stored = localStorage.getItem("vaporale_config");
        return stored ? JSON.parse(stored) : STORE_CONFIG;
    } catch (e) {
        return STORE_CONFIG;
    }
}

function getActiveCategories() {
    try {
        const stored = localStorage.getItem("vaporale_categories");
        return stored ? JSON.parse(stored) : CATEGORIES;
    } catch (e) {
        return CATEGORIES;
    }
}

function getActiveProducts() {
    try {
        const stored = localStorage.getItem("vaporale_products");
        return stored ? JSON.parse(stored) : PRODUCTS;
    } catch (e) {
        return PRODUCTS;
    }
}

function saveProducts() {
    localStorage.setItem("vaporale_products", JSON.stringify(adminProducts));
    updateMetrics();
}

function saveCategories() {
    localStorage.setItem("vaporale_categories", JSON.stringify(adminCategories));
    populateCategoryDropdowns();
    updateMetrics();
}

function saveConfig() {
    localStorage.setItem("vaporale_config", JSON.stringify(adminConfig));
    updateMetrics();
}

// 3. Métricas
function updateMetrics() {
    const totalProdEl = document.getElementById("metric-total-products");
    const totalCatEl = document.getElementById("metric-total-categories");
    const totalNoStockEl = document.getElementById("metric-out-stock");
    const currentWaEl = document.getElementById("metric-whatsapp");

    if (totalProdEl) totalProdEl.textContent = adminProducts.length;
    if (totalCatEl) totalCatEl.textContent = adminCategories.length;
    if (totalNoStockEl) {
        const outOfStock = adminProducts.filter(p => p.inStock === false).length;
        totalNoStockEl.textContent = outOfStock;
    }
    if (currentWaEl) currentWaEl.textContent = `+${adminConfig.whatsappNumber || 'No configurado'}`;
}

// 4. Renderizado de Productos en Tabla / Lista
function renderProductsTable(filterText = "", filterCategory = "all") {
    const tbody = document.getElementById("products-table-body");
    if (!tbody) return;

    let filtered = adminProducts.filter(p => {
        const matchText = p.name.toLowerCase().includes(filterText.toLowerCase()) ||
                          (p.brand && p.brand.toLowerCase().includes(filterText.toLowerCase())) ||
                          (p.specs && p.specs.toLowerCase().includes(filterText.toLowerCase()));
        const matchCat = filterCategory === "all" || p.category === filterCategory;
        return matchText && matchCat;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500 text-sm">
                    <i class="fas fa-box-open text-4xl mb-3 text-gray-600 block"></i>
                    No se encontraron productos con los filtros aplicados.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(prod => `
        <tr class="border-b border-gray-800/80 hover:bg-gray-800/30 transition-colors">
            <!-- Producto / Imagen -->
            <td class="px-6 py-4 flex items-center gap-3">
                <img 
                    src="${prod.image || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'}" 
                    alt="${prod.name}" 
                    class="w-12 h-12 object-cover rounded-xl bg-gray-800"
                    onerror="this.src='https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'">
                <div>
                    <h4 class="font-bold text-white text-sm line-clamp-1">${prod.name}</h4>
                    <span class="text-xs text-cyan-400 font-medium">${prod.brand || 'VaporAle'}</span>
                </div>
            </td>

            <!-- Categoría -->
            <td class="px-6 py-4">
                <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                    ${getCategoryName(prod.category)}
                </span>
            </td>

            <!-- Especificaciones -->
            <td class="px-6 py-4 text-xs text-gray-400">
                ${prod.specs || '-'}
            </td>

            <!-- Precio -->
            <td class="px-6 py-4 font-black text-white text-sm">
                ${adminConfig.currency || '$'}${Number(prod.price).toLocaleString()}
            </td>

            <!-- Stock -->
            <td class="px-6 py-4">
                <button 
                    onclick="toggleProductStock('${prod.id}')"
                    class="px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                        prod.inStock !== false 
                            ? "bg-green-950/80 text-green-400 border border-green-800" 
                            : "bg-red-950/80 text-red-400 border border-red-800"
                    }">
                    <span class="w-1.5 h-1.5 rounded-full ${prod.inStock !== false ? "bg-green-400" : "bg-red-400"}"></span>
                    ${prod.inStock !== false ? "En Stock" : "Agotado"}
                </button>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 text-right space-x-2">
                <button 
                    onclick="openEditProductModal('${prod.id}')"
                    class="text-gray-400 hover:text-cyan-400 p-2 transition" 
                    title="Editar producto">
                    <i class="fas fa-edit"></i>
                </button>
                <button 
                    onclick="deleteProduct('${prod.id}')"
                    class="text-gray-400 hover:text-red-400 p-2 transition" 
                    title="Eliminar producto">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function getCategoryName(catId) {
    const found = adminCategories.find(c => c.id === catId);
    return found ? found.name : catId;
}

function toggleProductStock(id) {
    const p = adminProducts.find(item => item.id === id);
    if (!p) return;
    p.inStock = p.inStock === false ? true : false;
    saveProducts();
    renderProductsTable();
    showAdminToast(`Stock actualizado para "${p.name}"`);
}

function deleteProduct(id) {
    const p = adminProducts.find(item => item.id === id);
    if (!p) return;

    if (confirm(`¿Estás seguro de que deseas eliminar "${p.name}" del catálogo?`)) {
        adminProducts = adminProducts.filter(item => item.id !== id);
        saveProducts();
        renderProductsTable();
        showAdminToast("Producto eliminado exitosamente");
    }
}

// 5. Modal de Producto (Crear / Editar)
function openCreateProductModal() {
    currentEditingProductId = null;
    document.getElementById("product-modal-title").textContent = "Nuevo Producto";
    document.getElementById("prod-form-id").value = "vape-" + Date.now().toString().slice(-4);
    document.getElementById("prod-form-name").value = "";
    document.getElementById("prod-form-category").value = adminCategories[0]?.id || "desechables";
    document.getElementById("prod-form-brand").value = "";
    document.getElementById("prod-form-price").value = "";
    document.getElementById("prod-form-badge").value = "";
    document.getElementById("prod-form-specs").value = "";
    document.getElementById("prod-form-image").value = "";
    document.getElementById("prod-form-description").value = "";
    document.getElementById("prod-form-instock").checked = true;

    updateImagePreview();
    document.getElementById("product-modal").classList.remove("hidden");
}

function openEditProductModal(id) {
    const p = adminProducts.find(item => item.id === id);
    if (!p) return;

    currentEditingProductId = id;
    document.getElementById("product-modal-title").textContent = "Editar Producto";
    document.getElementById("prod-form-id").value = p.id;
    document.getElementById("prod-form-name").value = p.name || "";
    document.getElementById("prod-form-category").value = p.category || "";
    document.getElementById("prod-form-brand").value = p.brand || "";
    document.getElementById("prod-form-price").value = p.price || 0;
    document.getElementById("prod-form-badge").value = p.badge || "";
    document.getElementById("prod-form-specs").value = p.specs || "";
    document.getElementById("prod-form-image").value = p.image || "";
    document.getElementById("prod-form-description").value = p.description || "";
    document.getElementById("prod-form-instock").checked = p.inStock !== false;

    updateImagePreview();
    document.getElementById("product-modal").classList.remove("hidden");
}

function closeProductModal() {
    document.getElementById("product-modal").classList.add("hidden");
}

function saveProductFromForm(e) {
    if (e) e.preventDefault();

    const id = document.getElementById("prod-form-id").value.trim();
    const name = document.getElementById("prod-form-name").value.trim();
    const category = document.getElementById("prod-form-category").value;
    const brand = document.getElementById("prod-form-brand").value.trim() || "VaporAle";
    const price = parseFloat(document.getElementById("prod-form-price").value) || 0;
    const badge = document.getElementById("prod-form-badge").value.trim() || null;
    const specs = document.getElementById("prod-form-specs").value.trim() || "";
    const image = document.getElementById("prod-form-image").value.trim() || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80";
    const description = document.getElementById("prod-form-description").value.trim() || "";
    const inStock = document.getElementById("prod-form-instock").checked;

    if (!name || price <= 0) {
        alert("Por favor completa el nombre y un precio válido.");
        return;
    }

    const productData = {
        id: id || "vape-" + Date.now().toString().slice(-4),
        name,
        category,
        brand,
        price,
        badge,
        specs,
        description,
        image,
        inStock
    };

    if (currentEditingProductId) {
        const index = adminProducts.findIndex(p => p.id === currentEditingProductId);
        if (index !== -1) {
            adminProducts[index] = productData;
        }
    } else {
        adminProducts.unshift(productData);
    }

    saveProducts();
    renderProductsTable();
    closeProductModal();
    showAdminToast(currentEditingProductId ? "Producto actualizado" : "Nuevo producto creado");
}

function updateImagePreview() {
    const input = document.getElementById("prod-form-image");
    const preview = document.getElementById("prod-image-preview");
    if (!input || !preview) return;

    const val = input.value.trim();
    preview.src = val || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80";
}

// 6. Categorías y Filtros
function renderCategoriesList() {
    const container = document.getElementById("categories-list");
    if (!container) return;

    container.innerHTML = adminCategories.map(cat => `
        <div class="flex items-center justify-between p-4 bg-slate-900 border border-cyan-500/20 rounded-xl">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <i class="fas ${cat.icon || 'fa-tag'}"></i>
                </div>
                <div>
                    <h4 class="font-bold text-white text-sm">${cat.name}</h4>
                    <span class="text-xs text-gray-500 font-mono">id: "${cat.id}"</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button 
                    onclick="openEditCategoryModal('${cat.id}')"
                    class="text-gray-400 hover:text-cyan-400 p-2 text-sm transition"
                    title="Editar categoría">
                    <i class="fas fa-edit"></i>
                </button>
                ${cat.id !== "all" ? `
                    <button 
                        onclick="deleteCategory('${cat.id}')"
                        class="text-gray-400 hover:text-red-400 p-2 text-sm transition"
                        title="Eliminar categoría">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : ""}
            </div>
        </div>
    `).join("");
}

function populateCategoryDropdowns() {
    const prodCatSelect = document.getElementById("prod-form-category");
    const filterCatSelect = document.getElementById("filter-by-category");

    if (prodCatSelect) {
        prodCatSelect.innerHTML = adminCategories
            .filter(c => c.id !== "all")
            .map(c => `<option value="${c.id}">${c.name}</option>`)
            .join("");
    }

    if (filterCatSelect) {
        filterCatSelect.innerHTML = `
            <option value="all">Todas las categorías</option>
            ${adminCategories.filter(c => c.id !== "all").map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
        `;
    }
}

function openCreateCategoryModal() {
    currentEditingCategoryId = null;
    document.getElementById("category-modal-title").textContent = "Nueva Categoría";
    document.getElementById("cat-form-id").value = "";
    document.getElementById("cat-form-id").disabled = false;
    document.getElementById("cat-form-name").value = "";
    document.getElementById("cat-form-icon").value = "fa-tag";
    document.getElementById("category-modal").classList.remove("hidden");
}

function openEditCategoryModal(id) {
    const cat = adminCategories.find(c => c.id === id);
    if (!cat) return;

    currentEditingCategoryId = id;
    document.getElementById("category-modal-title").textContent = "Editar Categoría";
    document.getElementById("cat-form-id").value = cat.id;
    document.getElementById("cat-form-id").disabled = cat.id === "all";
    document.getElementById("cat-form-name").value = cat.name;
    document.getElementById("cat-form-icon").value = cat.icon || "fa-tag";
    document.getElementById("category-modal").classList.remove("hidden");
}

function closeCategoryModal() {
    document.getElementById("category-modal").classList.add("hidden");
}

function saveCategoryFromForm(e) {
    if (e) e.preventDefault();

    const idInput = document.getElementById("cat-form-id");
    const id = idInput.value.trim().toLowerCase().replace(/\s+/g, '-');
    const name = document.getElementById("cat-form-name").value.trim();
    const icon = document.getElementById("cat-form-icon").value.trim() || "fa-tag";

    if (!id || !name) {
        alert("Por favor completa el ID y el nombre de la categoría.");
        return;
    }

    if (currentEditingCategoryId) {
        const index = adminCategories.findIndex(c => c.id === currentEditingCategoryId);
        if (index !== -1) {
            adminCategories[index].name = name;
            adminCategories[index].icon = icon;
        }
    } else {
        if (adminCategories.some(c => c.id === id)) {
            alert("Ya existe una categoría con ese ID.");
            return;
        }
        adminCategories.push({ id, name, icon });
    }

    saveCategories();
    renderCategoriesList();
    closeCategoryModal();
    showAdminToast(currentEditingCategoryId ? "Categoría actualizada" : "Categoría creada");
}

function deleteCategory(id) {
    if (id === "all") {
        alert("No se puede eliminar la categoría principal 'Todos'.");
        return;
    }

    if (confirm(`¿Eliminar la categoría "${id}"? Los productos asignados a esta categoría permanecerán en la tienda.`)) {
        adminCategories = adminCategories.filter(c => c.id !== id);
        saveCategories();
        renderCategoriesList();
        renderProductsTable();
        showAdminToast("Categoría eliminada");
    }
}

// 7. Configuración de Tienda
function populateConfigForm() {
    document.getElementById("cfg-store-name").value = adminConfig.storeName || "VaporAle Store";
    document.getElementById("cfg-whatsapp").value = adminConfig.whatsappNumber || "";
    document.getElementById("cfg-currency").value = adminConfig.currency || "$";
    document.getElementById("cfg-instagram").value = adminConfig.instagramUser || "";
    document.getElementById("cfg-delivery").value = adminConfig.deliveryInfo || "";
    document.getElementById("cfg-min-age").value = adminConfig.minAge || 18;
    document.getElementById("cfg-admin-pin").value = adminConfig.adminPin || "1234";
}

function saveConfigFromForm(e) {
    if (e) e.preventDefault();

    adminConfig.storeName = document.getElementById("cfg-store-name").value.trim();
    adminConfig.whatsappNumber = document.getElementById("cfg-whatsapp").value.trim().replace(/[^0-9]/g, '');
    adminConfig.currency = document.getElementById("cfg-currency").value.trim();
    adminConfig.instagramUser = document.getElementById("cfg-instagram").value.trim();
    adminConfig.deliveryInfo = document.getElementById("cfg-delivery").value.trim();
    adminConfig.minAge = parseInt(document.getElementById("cfg-min-age").value, 10) || 18;
    adminConfig.adminPin = document.getElementById("cfg-admin-pin").value.trim() || "1234";

    saveConfig();
    showAdminToast("Configuración general guardada exitosamente");
}

// 8. Exportar Archivo products.js Listo para GitHub
function exportProductsJs() {
    const jsContent = `// Archivo generado automáticamente por el Panel de Administración de VaporAle
// Fecha de exportación: ${new Date().toLocaleString()}

const STORE_CONFIG = ${JSON.stringify(adminConfig, null, 4)};

const CATEGORIES = ${JSON.stringify(adminCategories, null, 4)};

const PRODUCTS = ${JSON.stringify(adminProducts, null, 4)};
`;

    const blob = new Blob([jsContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAdminToast("¡Archivo products.js generado y descargado!");
}

// 9. Restaurar Valores por Defecto
function resetToFactoryDefaults() {
    if (confirm("⚠️ ¿Estás seguro de que deseas restablecer los productos y categorías originales? Se borrarán las personalizaciones locales de este navegador.")) {
        localStorage.removeItem("vaporale_products");
        localStorage.removeItem("vaporale_categories");
        localStorage.removeItem("vaporale_config");
        loadData();
        renderProductsTable();
        renderCategoriesList();
        populateCategoryDropdowns();
        populateConfigForm();
        updateMetrics();
        showAdminToast("Datos restaurados a los valores originales");
    }
}

// 10. Control de Pestañas
function switchTab(tabId) {
    const tabs = ["products", "categories", "settings", "export"];
    tabs.forEach(t => {
        const pane = document.getElementById(`tab-pane-${t}`);
        const btn = document.getElementById(`tab-btn-${t}`);
        if (pane) {
            if (t === tabId) {
                pane.classList.remove("hidden");
            } else {
                pane.classList.add("hidden");
            }
        }
        if (btn) {
            if (t === tabId) {
                btn.className = "tab-btn active px-4 py-2.5 font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2";
            } else {
                btn.className = "tab-btn px-4 py-2.5 font-semibold text-sm text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center gap-2";
            }
        }
    });
}

// 11. Toast de Notificación Admin
function showAdminToast(msg) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/60 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm";
    toast.innerHTML = `<i class="fas fa-check-circle text-cyan-400"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

// 12. Listeners de Búsqueda y Filtro
function setupAdminEvents() {
    const searchInput = document.getElementById("search-admin-products");
    const categorySelect = document.getElementById("filter-by-category");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const cat = categorySelect ? categorySelect.value : "all";
            renderProductsTable(e.target.value, cat);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            const search = searchInput ? searchInput.value : "";
            renderProductsTable(search, e.target.value);
        });
    }
}
