# FORMA — Tienda online

Sitio estático en español con catálogo, categorías, búsqueda, ordenamiento, favoritos, fichas de producto y carrito local. Diseño adaptable a celulares y escritorio.

## Archivos

- `dist/index.html`: estructura y secciones de la tienda.
- `dist/style.css`: diseño y tamaños adaptables.
- `dist/app.js`: productos ilustrativos e interacciones.
- `vercel.json`: configuración de hosting estático en Vercel.

## Publicar en Vercel desde GitHub

1. Subir esta carpeta completa a un repositorio de GitHub.
2. En Vercel, importar el repositorio como un proyecto nuevo.
3. Usar la raíz del repositorio como Root Directory. La configuración incluida selecciona Other, omite instalación y compilación y publica `dist`.
4. Desplegar y abrir la URL de producción que devuelve Vercel.

La integración del repositorio con Vercel permite publicar las actualizaciones que se envíen a la rama de producción.

## Personalizar

Modificar el listado `products` al comienzo de `dist/app.js` para cambiar los artículos y sus precios. Las ilustraciones de ejemplo se generan mediante SVG. Los textos del sitio están en `dist/index.html`. Los colores están definidos en `:root` dentro de `dist/style.css`.

## Estado de la tienda

Esta es una demostración. La marca, los productos, las descripciones y los precios son ejemplos. No se reciben pedidos ni pagos reales. Los favoritos y la bolsa se guardan en el navegador mediante localStorage. No hay base de datos, cuentas de clientes, control de stock ni administración comercial.

Las tipografías se solicitan a Google Fonts; si no están disponibles se usan fuentes del sistema. No se necesitan variables de entorno para publicar esta versión.

La configuración de este paquete es independiente del hosting original de Sites.
