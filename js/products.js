// Configuración general de la tienda
const STORE_CONFIG = {
    storeName: "VaporAle Store",
    whatsappNumber: "5491123456789", // Formato internacional sin '+' ni espacios
    currency: "$",
    instagramUser: "@vaporale.oficial",
    minAge: 18,
    deliveryInfo: "Envíos a todo el país / Entregas en el día"
};

// Categorías disponibles
const CATEGORIES = [
    { id: "all", name: "Todos los productos", icon: "fa-th-large" },
    { id: "desechables", name: "Desechables (Pods)", icon: "fa-fire" },
    { id: "kits", name: "Kits y Mods", icon: "fa-bolt" },
    { id: "liquidos", name: "E-Liquids & Sales", icon: "fa-tint" },
    { id: "accesorios", name: "Resistencias & Accesorios", icon: "fa-cog" }
];

// Catálogo de productos inicial
const PRODUCTS = [
    {
        id: "vape-01",
        name: "Elf Bar BC5000 - Watermelon Ice",
        category: "desechables",
        brand: "Elf Bar",
        price: 18500,
        badge: "Más Vendido",
        specs: "5000 Puffs • 5% Nicotina",
        description: "Delicioso sabor a sandía fresca con un toque helado mentolado. Batería recargable tipo C de 650mAh.",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-02",
        name: "Lost Mary OS5000 - Blue Razz Ice",
        category: "desechables",
        brand: "Lost Mary",
        price: 19900,
        badge: "Top Sabor",
        specs: "5000 Puffs • 5% Nicotina",
        description: "Frambuesa azul ácida y dulce con un golpe frío intenso. Indicador LED de batería por color.",
        image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-03",
        name: "Vaporesso XROS 3 Pod Kit",
        category: "kits",
        brand: "Vaporesso",
        price: 42000,
        badge: "Recomendado",
        specs: "Batería 1000mAh • Flujo regulable",
        description: "Kit recargable de alta precisión con tecnología antifugas SSS y modo Pulse constante para máximo sabor.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-04",
        name: "Voopoo Drag S Pro Mod Pod",
        category: "kits",
        brand: "Voopoo",
        price: 78000,
        badge: "Potencia Pro",
        specs: "80W • Batería 3000mAh",
        description: "Acabado en cuero y metal premium. Chip Gene.Fan 3.0 con control de aire 360° para caladas DTL y MTL.",
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-05",
        name: "Nasty Juice Bad Blood 60ml",
        category: "liquidos",
        brand: "Nasty Juice",
        price: 15500,
        badge: "Premium",
        specs: "60ml • 70/30 VG/PG • 3mg",
        description: "Grosella negra madura con notas dulces y una suave terminación fresca de menta.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-06",
        name: "BLVK Unicorn Lychee Nic Salt 30ml",
        category: "liquidos",
        brand: "BLVK",
        price: 16800,
        badge: "Sal de Nicotina",
        specs: "30ml • 35mg Salt Nic",
        description: "Exótico sabor a lichi dulce combinado con un toque refrescante de hielo para pods recargables.",
        image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-07",
        name: "Resistencias Vaporesso XROS (Pack x4)",
        category: "accesorios",
        brand: "Vaporesso",
        price: 16000,
        badge: "Repuesto Original",
        specs: "Pack 4 pods • Malla 0.6 Ohm / 0.8 Ohm",
        description: "Cartuchos de repuesto con tecnología COREX Heating Tech para un sabor puro y mayor durabilidad.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        inStock: true
    },
    {
        id: "vape-08",
        name: "Cargador Rápido USB Tipo C con Cable Reforzado",
        category: "accesorios",
        brand: "Genérico",
        price: 6500,
        badge: null,
        specs: "Carga Segura 5V/1A",
        description: "Ideal para cargar pods y mods sin dañar la vida útil de las baterías de litio.",
        image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80",
        inStock: true
    }
];
