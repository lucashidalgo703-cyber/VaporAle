# VaporAle — Tienda Online de Vapeo & Pods 💨

Sitio web moderno de comercio electrónico para tienda de vapeo desarrollado en **HTML5**, **Tailwind CSS** y **JavaScript (Vanilla)**. Diseñado específicamente para negocios del rubro con checkout directo hacia **WhatsApp**, control estricto de edad (+18) y diseño responsivo móvil/escritorio en modo oscuro.

---

## 🚀 Características Principales

- **🔞 Verificación de Edad (+18):** Modal con bloqueo de navegación y consentimiento recordado en `localStorage`.
- **🛒 Carrito de Compras Persistente:** Slide-over lateral con suma de cantidades, totales y selección de método de pago (Efectivo / Transferencia / Mercado Pago).
- **📱 Checkout Automatizado por WhatsApp:** Genera un mensaje formateado con el desglose exacto de productos, precios, datos de envío y total listo para enviar con un solo toque.
- **🔍 Catálogo Dinámico:** Filtrado instantáneo por categorías (Pods Desechables, Kits & Mods, E-Liquids, Accesorios) y buscador en tiempo real.
- **✨ Vista Rápida:** Modales de información detallada de cada producto.
- **⚡ Alto Rendimiento:** Cero dependencias pesadas, carga instantánea y optimizado para SEO y redes sociales.

---

## 📂 Estructura del Proyecto

```text
vaporale/
├── index.html        # Página principal y estructura visual
├── css/
│   └── style.css     # Efectos de neón glow, fuentes y transiciones
├── js/
│   ├── products.js   # Catálogo y configuración (número de WhatsApp, precios, productos)
│   └── app.js        # Lógica del carrito, filtros y checkout
└── vercel.json       # Configuración para despliegue instantáneo en Vercel
```

---

## ⚙️ Personalización Rápida

Para cambiar los datos de tu negocio, abre `js/products.js`:

```javascript
const STORE_CONFIG = {
    storeName: "VaporAle Store",
    whatsappNumber: "5491123456789", // Tu número de WhatsApp con código de país
    currency: "$",
    instagramUser: "@vaporale.oficial",
    minAge: 18,
    deliveryInfo: "Envíos a todo el país / Entregas en el día"
};
```

Para agregar o modificar productos, edita el arreglo `PRODUCTS` en ese mismo archivo.

---

## 🌐 Despliegue en Vercel / GitHub Pages

- **Vercel:** Importa este repositorio; la raíz se detectará automáticamente y estará online en menos de 1 minuto.
- **GitHub Pages:** Ve a `Settings` > `Pages` > Selecciona la rama `main` y la carpeta `/ (root)`.
