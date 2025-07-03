const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = "dern-market-super-secret-2024"

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))

// In-memory database
const users = []
let products = []
const orders = []
let categories = []
let nextUserId = 1
let nextProductId = 1
let nextOrderId = 1

// Initialize with comprehensive data
function initializeData() {
  console.log("🔄 Ma'lumotlar bazasini yaratish...")

  // Categories
  categories = [
    { id: 1, name: "Telefonlar", icon: "fas fa-mobile-alt", count: 0 },
    { id: 2, name: "Noutbuklar", icon: "fas fa-laptop", count: 0 },
    { id: 3, name: "Planshetlar", icon: "fas fa-tablet-alt", count: 0 },
    { id: 4, name: "Aksessuarlar", icon: "fas fa-headphones", count: 0 },
    { id: 5, name: "Televizorlar", icon: "fas fa-tv", count: 0 },
    { id: 6, name: "Gaming", icon: "fas fa-gamepad", count: 0 },
    { id: 7, name: "Kameralar", icon: "fas fa-camera", count: 0 },
    { id: 8, name: "Maishiy texnika", icon: "fas fa-blender", count: 0 },
  ]

  // Comprehensive products database
  products = [
    // TELEFONLAR
    {
      id: nextProductId++,
      name: "iPhone 15 Pro Max 256GB",
      price: 16500000,
      originalPrice: 17000000,
      description: "A17 Pro chip, Titanium dizayn, ProRAW kamera, 6.7 inch Super Retina XDR display",
      image: "/placeholder.svg?height=400&width=400",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      stock: 25,
      category: "Telefonlar",
      brand: "Apple",
      rating: 4.9,
      reviews: 156,
      discount: 3,
      isNew: true,
      isFeatured: true,
      specifications: {
        "Ekran o'lchami": "6.7 inch",
        "Ekran turi": "Super Retina XDR OLED",
        Processor: "A17 Pro",
        "Xotira hajmi": "256GB",
        "Asosiy kamera": "48MP + 12MP + 12MP",
        "Old kamera": "12MP TrueDepth",
        Batareya: "4441 mAh",
        "Operatsion tizim": "iOS 17",
        "5G qo'llab-quvvatlash": "Ha",
        "Wireless Charging": "Ha",
        "Face ID": "Ha",
        "Suv bardoshligi": "IP68",
      },
      features: ["5G", "Face ID", "Wireless Charging", "Water Resistant", "ProRAW", "Cinematic Mode"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Samsung Galaxy S24 Ultra 512GB",
      price: 15200000,
      originalPrice: 15800000,
      description: "Snapdragon 8 Gen 3, S Pen bilan, 200MP kamera, 6.8 inch Dynamic AMOLED",
      image: "/placeholder.svg?height=400&width=400",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      stock: 18,
      category: "Telefonlar",
      brand: "Samsung",
      rating: 4.8,
      reviews: 203,
      discount: 4,
      isNew: true,
      isFeatured: true,
      specifications: {
        "Ekran o'lchami": "6.8 inch",
        "Ekran turi": "Dynamic AMOLED 2X",
        Processor: "Snapdragon 8 Gen 3",
        "Xotira hajmi": "512GB",
        "Asosiy kamera": "200MP + 50MP + 12MP + 10MP",
        "Old kamera": "12MP",
        Batareya: "5000 mAh",
        "Operatsion tizim": "Android 14",
        "5G qo'llab-quvvatlash": "Ha",
        "S Pen": "Ha",
        "Wireless Charging": "Ha",
        "Suv bardoshligi": "IP68",
      },
      features: ["5G", "S Pen", "Wireless Charging", "Water Resistant", "Night Mode", "8K Video"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Xiaomi 14 Pro 256GB",
      price: 8900000,
      originalPrice: 9500000,
      description: "Snapdragon 8 Gen 3, Leica kamera, 120W zaryadlash, LTPO OLED",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
      stock: 42,
      category: "Telefonlar",
      brand: "Xiaomi",
      rating: 4.7,
      reviews: 89,
      discount: 6,
      isNew: false,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "6.73 inch",
        "Ekran turi": "LTPO OLED",
        Processor: "Snapdragon 8 Gen 3",
        "Xotira hajmi": "256GB",
        "Asosiy kamera": "50MP + 50MP + 50MP",
        "Old kamera": "32MP",
        Batareya: "4880 mAh",
        "Operatsion tizim": "MIUI 15",
        "Tez zaryadlash": "120W",
        "Wireless Charging": "50W",
        "5G qo'llab-quvvatlash": "Ha",
      },
      features: ["5G", "Fast Charging", "Wireless Charging", "Leica Camera", "120Hz Display"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "OPPO Find X7 Pro 256GB",
      price: 7800000,
      originalPrice: 8200000,
      description: "Dimensity 9300, Hasselblad kamera, 6.82 inch LTPO AMOLED",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 31,
      category: "Telefonlar",
      brand: "OPPO",
      rating: 4.6,
      reviews: 67,
      discount: 5,
      isNew: false,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "6.82 inch",
        "Ekran turi": "LTPO AMOLED",
        Processor: "Dimensity 9300",
        "Xotira hajmi": "256GB",
        "Asosiy kamera": "50MP + 50MP + 50MP",
        "Old kamera": "32MP",
        Batareya: "5400 mAh",
        "Operatsion tizim": "ColorOS 14",
        "Tez zaryadlash": "100W",
        "5G qo'llab-quvvatlash": "Ha",
      },
      features: ["5G", "Fast Charging", "Hasselblad Camera", "120Hz Display"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Realme GT 5 Pro 256GB",
      price: 6200000,
      originalPrice: 6800000,
      description: "Snapdragon 8 Gen 3, 50MP periscope kamera, 100W SuperVOOC",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 35,
      category: "Telefonlar",
      brand: "Realme",
      rating: 4.5,
      reviews: 124,
      discount: 9,
      isNew: true,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "6.7 inch",
        "Ekran turi": "AMOLED",
        Processor: "Snapdragon 8 Gen 3",
        "Xotira hajmi": "256GB",
        "Asosiy kamera": "50MP + 8MP + 2MP",
        "Old kamera": "16MP",
        Batareya: "5400 mAh",
        "Operatsion tizim": "Realme UI 5.0",
        "Tez zaryadlash": "100W",
        "5G qo'llab-quvvatlash": "Ha",
      },
      features: ["5G", "100W SuperVOOC", "Gaming Mode", "120Hz Display"],
      createdAt: new Date(),
    },

    // NOUTBUKLAR
    {
      id: nextProductId++,
      name: "MacBook Pro 16-inch M3 Max",
      price: 42000000,
      originalPrice: 44000000,
      description: "M3 Max chip, 36GB RAM, 1TB SSD, Liquid Retina XDR display",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
      stock: 8,
      category: "Noutbuklar",
      brand: "Apple",
      rating: 4.9,
      reviews: 124,
      discount: 5,
      isNew: true,
      isFeatured: true,
      specifications: {
        Processor: "Apple M3 Max",
        "RAM hajmi": "36GB",
        "Xotira hajmi": "1TB SSD",
        "Ekran o'lchami": "16.2 inch",
        "Ekran turi": "Liquid Retina XDR",
        "Grafik karta": "M3 Max GPU",
        "Operatsion tizim": "macOS Sonoma",
        "Batareya muddati": "22 soat",
        "Og'irligi": "2.16 kg",
        Portlar: "3x Thunderbolt 4, HDMI, SD card",
      },
      features: ["M3 Max Chip", "Liquid Retina XDR", "Touch ID", "Thunderbolt 4", "22h Battery"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Dell XPS 15 9530",
      price: 28500000,
      originalPrice: 30000000,
      description: "Intel Core i7-13700H, 32GB RAM, RTX 4070, 4K OLED display",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 12,
      category: "Noutbuklar",
      brand: "Dell",
      rating: 4.7,
      reviews: 98,
      discount: 5,
      isNew: false,
      isFeatured: true,
      specifications: {
        Processor: "Intel Core i7-13700H",
        "RAM hajmi": "32GB DDR5",
        "Xotira hajmi": "1TB SSD",
        "Ekran o'lchami": "15.6 inch",
        "Ekran turi": "4K OLED",
        "Grafik karta": "RTX 4070",
        "Operatsion tizim": "Windows 11",
        "Batareya muddati": "8 soat",
        "Og'irligi": "2.0 kg",
        Portlar: "2x Thunderbolt 4, USB-A, HDMI",
      },
      features: ["4K OLED", "RTX 4070", "Thunderbolt 4", "Wi-Fi 6E", "Premium Build"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "ASUS ROG Strix G16",
      price: 22000000,
      originalPrice: 23500000,
      description: "Intel Core i7-13650HX, 16GB RAM, RTX 4060, Gaming laptop",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 15,
      category: "Noutbuklar",
      brand: "ASUS",
      rating: 4.6,
      reviews: 156,
      discount: 6,
      isNew: false,
      isFeatured: false,
      specifications: {
        Processor: "Intel Core i7-13650HX",
        "RAM hajmi": "16GB DDR5",
        "Xotira hajmi": "512GB SSD",
        "Ekran o'lchami": "16 inch",
        "Ekran turi": "FHD 165Hz",
        "Grafik karta": "RTX 4060",
        "Operatsion tizim": "Windows 11",
        "Batareya muddati": "6 soat",
        "Og'irligi": "2.5 kg",
        Portlar: "USB-C, USB-A, HDMI, Ethernet",
      },
      features: ["Gaming", "RGB Keyboard", "165Hz Display", "Cooling System", "ROG Software"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Lenovo ThinkPad X1 Carbon",
      price: 18900000,
      originalPrice: 20000000,
      description: "Intel Core i7-1365U, 16GB RAM, 512GB SSD, Business laptop",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 20,
      category: "Noutbuklar",
      brand: "Lenovo",
      rating: 4.8,
      reviews: 87,
      discount: 6,
      isNew: false,
      isFeatured: false,
      specifications: {
        Processor: "Intel Core i7-1365U",
        "RAM hajmi": "16GB LPDDR5",
        "Xotira hajmi": "512GB SSD",
        "Ekran o'lchami": "14 inch",
        "Ekran turi": "WUXGA IPS",
        "Grafik karta": "Intel Iris Xe",
        "Operatsion tizim": "Windows 11 Pro",
        "Batareya muddati": "15 soat",
        "Og'irligi": "1.12 kg",
        Portlar: "2x Thunderbolt 4, USB-A, HDMI",
      },
      features: ["Business Grade", "Lightweight", "Long Battery", "ThinkPad Keyboard", "Security"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "HP Pavilion Gaming 15",
      price: 12500000,
      originalPrice: 13200000,
      description: "AMD Ryzen 7 5800H, 16GB RAM, GTX 1650, Gaming laptop",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 28,
      category: "Noutbuklar",
      brand: "HP",
      rating: 4.4,
      reviews: 145,
      discount: 5,
      isNew: false,
      isFeatured: false,
      specifications: {
        Processor: "AMD Ryzen 7 5800H",
        "RAM hajmi": "16GB DDR4",
        "Xotira hajmi": "512GB SSD",
        "Ekran o'lchami": "15.6 inch",
        "Ekran turi": "FHD IPS",
        "Grafik karta": "GTX 1650",
        "Operatsion tizim": "Windows 11",
        "Batareya muddati": "7 soat",
        "Og'irligi": "2.3 kg",
        Portlar: "USB-C, USB-A, HDMI, Ethernet",
      },
      features: ["Gaming", "AMD Ryzen", "Affordable", "Good Performance", "Dual Storage"],
      createdAt: new Date(),
    },

    // PLANSHETLAR
    {
      id: nextProductId++,
      name: "iPad Pro 12.9-inch M2 256GB",
      price: 14500000,
      originalPrice: 15200000,
      description: "M2 chip, 256GB, Liquid Retina XDR, Apple Pencil support",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 22,
      category: "Planshetlar",
      brand: "Apple",
      rating: 4.8,
      reviews: 134,
      discount: 5,
      isNew: true,
      isFeatured: true,
      specifications: {
        Processor: "Apple M2",
        "Xotira hajmi": "256GB",
        "Ekran o'lchami": "12.9 inch",
        "Ekran turi": "Liquid Retina XDR",
        "Asosiy kamera": "12MP",
        "Old kamera": "12MP TrueDepth",
        "Operatsion tizim": "iPadOS 17",
        "Batareya muddati": "10 soat",
        "Og'irligi": "682g",
        Portlar: "USB-C Thunderbolt",
      },
      features: ["M2 Chip", "Apple Pencil Support", "Face ID", "5G", "ProRes Video", "Stage Manager"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Samsung Galaxy Tab S9 Ultra",
      price: 12800000,
      originalPrice: 13500000,
      description: "Snapdragon 8 Gen 2, 14.6 inch AMOLED, S Pen included",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 16,
      category: "Planshetlar",
      brand: "Samsung",
      rating: 4.7,
      reviews: 92,
      discount: 5,
      isNew: false,
      isFeatured: false,
      specifications: {
        Processor: "Snapdragon 8 Gen 2",
        "Xotira hajmi": "256GB",
        "Ekran o'lchami": "14.6 inch",
        "Ekran turi": "Dynamic AMOLED 2X",
        "Asosiy kamera": "13MP + 8MP",
        "Old kamera": "12MP",
        "Operatsion tizim": "Android 13",
        "Batareya muddati": "12 soat",
        "Og'irligi": "732g",
        Portlar: "USB-C",
      },
      features: ["S Pen Included", "Large Display", "DeX Mode", "5G", "Premium Design"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Xiaomi Pad 6 Pro 256GB",
      price: 4200000,
      originalPrice: 4600000,
      description: "Snapdragon 8+ Gen 1, 11 inch 2.8K display, 120Hz refresh rate",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 34,
      category: "Planshetlar",
      brand: "Xiaomi",
      rating: 4.5,
      reviews: 78,
      discount: 9,
      isNew: true,
      isFeatured: false,
      specifications: {
        Processor: "Snapdragon 8+ Gen 1",
        "Xotira hajmi": "256GB",
        "Ekran o'lchami": "11 inch",
        "Ekran turi": "2.8K LCD",
        "Asosiy kamera": "13MP",
        "Old kamera": "8MP",
        "Operatsion tizim": "MIUI Pad 14",
        "Batareya muddati": "10 soat",
        "Og'irligi": "490g",
        Portlar: "USB-C",
      },
      features: ["2.8K Display", "120Hz", "Dolby Vision", "Quad Speakers", "Fast Charging"],
      createdAt: new Date(),
    },

    // AKSESSUARLAR
    {
      id: nextProductId++,
      name: "AirPods Pro 2nd Gen",
      price: 3200000,
      originalPrice: 3500000,
      description: "Active Noise Cancellation, Spatial Audio, USB-C charging",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 45,
      category: "Aksessuarlar",
      brand: "Apple",
      rating: 4.8,
      reviews: 267,
      discount: 9,
      isNew: true,
      isFeatured: true,
      specifications: {
        Turi: "True Wireless",
        "Noise Cancellation": "Active",
        "Batareya muddati": "6 soat + 24 soat case",
        Ulanish: "Bluetooth 5.3",
        "Suv bardoshligi": "IPX4",
        "Zaryadlash porti": "USB-C",
        "Spatial Audio": "Ha",
        "Adaptive Transparency": "Ha",
      },
      features: ["Active Noise Cancellation", "Spatial Audio", "USB-C", "Find My", "Adaptive EQ"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Sony WH-1000XM5",
      price: 4500000,
      originalPrice: 4800000,
      description: "Premium Noise Canceling Headphones, 30-hour battery",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 28,
      category: "Aksessuarlar",
      brand: "Sony",
      rating: 4.9,
      reviews: 189,
      discount: 6,
      isNew: false,
      isFeatured: true,
      specifications: {
        Turi: "Over-ear",
        "Noise Cancellation": "Industry Leading",
        "Batareya muddati": "30 soat",
        Ulanish: "Bluetooth 5.2",
        "Og'irligi": "250g",
        "Tez zaryadlash": "3 min = 3 soat",
        Multipoint: "Ha",
        "Hi-Res Audio": "Ha",
      },
      features: ["30h Battery", "Quick Charge", "Multipoint Connection", "Touch Controls", "LDAC"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Apple Watch Series 9 45mm",
      price: 5800000,
      originalPrice: 6200000,
      description: "S9 SiP, Always-On Retina, Health tracking, GPS + Cellular",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 33,
      category: "Aksessuarlar",
      brand: "Apple",
      rating: 4.7,
      reviews: 156,
      discount: 6,
      isNew: true,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "45mm",
        "Ekran turi": "Always-On Retina",
        Processor: "S9 SiP",
        "Batareya muddati": "18 soat",
        "Suv bardoshligi": "50m",
        "GPS + Cellular": "Ha",
        "Health Sensors": "ECG, Blood Oxygen, Heart Rate",
        "Operatsion tizim": "watchOS 10",
      },
      features: ["Always-On Display", "Health Tracking", "GPS + Cellular", "ECG", "Blood Oxygen"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Samsung Galaxy Buds2 Pro",
      price: 2800000,
      originalPrice: 3100000,
      description: "Active Noise Cancellation, 360 Audio, IPX7 water resistant",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 52,
      category: "Aksessuarlar",
      brand: "Samsung",
      rating: 4.6,
      reviews: 234,
      discount: 10,
      isNew: false,
      isFeatured: false,
      specifications: {
        Turi: "True Wireless",
        "Noise Cancellation": "Active",
        "Batareya muddati": "5 soat + 18 soat case",
        Ulanish: "Bluetooth 5.3",
        "Suv bardoshligi": "IPX7",
        "360 Audio": "Ha",
        "Voice Detect": "Ha",
        "Ambient Sound": "Ha",
      },
      features: ["Active Noise Cancellation", "360 Audio", "IPX7", "Voice Detect", "SmartThings Find"],
      createdAt: new Date(),
    },

    // TELEVIZORLAR
    {
      id: nextProductId++,
      name: "Samsung Neo QLED 65QN95C",
      price: 32000000,
      originalPrice: 35000000,
      description: "65 inch 4K Neo QLED TV, Quantum HDR, Smart TV features",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 7,
      category: "Televizorlar",
      brand: "Samsung",
      rating: 4.8,
      reviews: 78,
      discount: 9,
      isNew: false,
      isFeatured: true,
      specifications: {
        "Ekran o'lchami": "65 inch",
        "Ekran turi": "Neo QLED",
        Ruxsatnoma: "4K UHD (3840x2160)",
        HDR: "Quantum HDR",
        "Smart TV": "Tizen OS",
        "Yangilanish tezligi": "120Hz",
        "Gaming Mode": "Ha",
        "Voice Control": "Bixby, Alexa",
        Portlar: "4x HDMI, 2x USB, Ethernet",
      },
      features: ["Neo QLED", "Quantum HDR", "Smart TV", "120Hz", "Gaming Hub", "Solar Remote"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "LG OLED55C3PSA",
      price: 28500000,
      originalPrice: 30000000,
      description: "55 inch 4K OLED, α9 Gen6 AI Processor, webOS smart platform",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 11,
      category: "Televizorlar",
      brand: "LG",
      rating: 4.9,
      reviews: 94,
      discount: 5,
      isNew: false,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "55 inch",
        "Ekran turi": "OLED",
        Ruxsatnoma: "4K UHD (3840x2160)",
        HDR: "Dolby Vision IQ",
        "Smart TV": "webOS 23",
        "Yangilanish tezligi": "120Hz",
        Processor: "α9 Gen6 AI",
        "Gaming Features": "VRR, ALLM, HGiG",
        Portlar: "4x HDMI, 3x USB, Ethernet",
      },
      features: ["OLED", "Dolby Vision", "webOS", "120Hz", "Gaming Optimizer", "Magic Remote"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Sony Bravia XR 55X90L",
      price: 24500000,
      originalPrice: 26000000,
      description: "55 inch 4K LED, XR Cognitive Processor, Google TV",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 13,
      category: "Televizorlar",
      brand: "Sony",
      rating: 4.7,
      reviews: 67,
      discount: 6,
      isNew: true,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "55 inch",
        "Ekran turi": "Full Array LED",
        Ruxsatnoma: "4K UHD (3840x2160)",
        HDR: "Dolby Vision",
        "Smart TV": "Google TV",
        "Yangilanish tezligi": "120Hz",
        Processor: "XR Cognitive Processor",
        "Gaming Features": "VRR, ALLM",
        Portlar: "4x HDMI, 2x USB, Ethernet",
      },
      features: ["XR Processor", "Dolby Vision", "Google TV", "120Hz", "Perfect for PS5", "Acoustic Multi-Audio"],
      createdAt: new Date(),
    },

    // GAMING
    {
      id: nextProductId++,
      name: "PlayStation 5 Slim",
      price: 7800000,
      originalPrice: 8200000,
      description: "PS5 Slim Console, 1TB SSD, DualSense controller, 4K gaming",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 19,
      category: "Gaming",
      brand: "Sony",
      rating: 4.9,
      reviews: 234,
      discount: 5,
      isNew: true,
      isFeatured: true,
      specifications: {
        "Xotira hajmi": "1TB SSD",
        Ruxsatnoma: "4K UHD",
        "Ray Tracing": "Hardware",
        Controller: "DualSense",
        "Backward Compatibility": "PS4",
        "Yangilanish tezligi": "120fps",
        "3D Audio": "Tempest 3D AudioTech",
        Portlar: "USB-A, USB-C, HDMI, Ethernet",
      },
      features: ["4K Gaming", "Ray Tracing", "SSD Storage", "DualSense Controller", "3D Audio", "PS4 Compatible"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Xbox Series X",
      price: 7500000,
      originalPrice: 7800000,
      description: "Xbox Series X Console, 1TB SSD, 4K gaming, Game Pass",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 15,
      category: "Gaming",
      brand: "Microsoft",
      rating: 4.8,
      reviews: 189,
      discount: 4,
      isNew: true,
      isFeatured: true,
      specifications: {
        "Xotira hajmi": "1TB SSD",
        Ruxsatnoma: "4K UHD",
        "Yangilanish tezligi": "120fps",
        "Ray Tracing": "Hardware",
        Controller: "Xbox Wireless Controller",
        "Backward Compatibility": "Xbox One, Xbox 360, Original Xbox",
        "Quick Resume": "Ha",
        Portlar: "USB-A, HDMI, Ethernet",
      },
      features: ["4K Gaming", "Ray Tracing", "Quick Resume", "Game Pass", "Backward Compatible", "Smart Delivery"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Nintendo Switch OLED",
      price: 4200000,
      originalPrice: 4500000,
      description: "Nintendo Switch OLED Model, 7-inch OLED screen, Enhanced audio",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 25,
      category: "Gaming",
      brand: "Nintendo",
      rating: 4.7,
      reviews: 156,
      discount: 7,
      isNew: false,
      isFeatured: false,
      specifications: {
        "Ekran o'lchami": "7 inch OLED",
        Ruxsatnoma: "1280x720",
        "Xotira hajmi": "64GB",
        "Batareya muddati": "4.5-9 soat",
        "Gaming Modes": "TV, Tabletop, Handheld",
        "Joy-Con Controllers": "Ha",
        "Dock Station": "Ha",
        Portlar: "USB-C, microSD",
      },
      features: ["OLED Screen", "Portable Gaming", "TV Mode", "Joy-Con", "Nintendo Games", "Enhanced Audio"],
      createdAt: new Date(),
    },

    // KAMERALAR
    {
      id: nextProductId++,
      name: "Canon EOS R5",
      price: 45000000,
      originalPrice: 47000000,
      description: "45MP Full-Frame Mirrorless Camera, 8K video, In-body stabilization",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 6,
      category: "Kameralar",
      brand: "Canon",
      rating: 4.9,
      reviews: 89,
      discount: 4,
      isNew: false,
      isFeatured: true,
      specifications: {
        "Sensor turi": "45MP Full-Frame CMOS",
        "Video qobiliyati": "8K 30fps, 4K 120fps",
        "Image Stabilization": "In-body 8-stop",
        Autofocus: "1053-point Dual Pixel CMOS AF II",
        "ISO Range": "100-51200",
        "Burst Rate": "20fps",
        Viewfinder: "5.76M-dot OLED EVF",
        "LCD Screen": "3.2-inch Vari-angle Touchscreen",
      },
      features: ["8K Video", "45MP Sensor", "In-body Stabilization", "Dual Pixel AF", "Weather Sealed"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Sony Alpha A7 IV",
      price: 38000000,
      originalPrice: 40000000,
      description: "33MP Full-Frame Mirrorless, 4K 60p video, Real-time tracking",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 9,
      category: "Kameralar",
      brand: "Sony",
      rating: 4.8,
      reviews: 124,
      discount: 5,
      isNew: false,
      isFeatured: false,
      specifications: {
        "Sensor turi": "33MP Full-Frame Exmor R CMOS",
        "Video qobiliyati": "4K 60fps",
        "Image Stabilization": "5-axis in-body",
        Autofocus: "759-point phase detection",
        "ISO Range": "100-51200",
        "Burst Rate": "10fps",
        Viewfinder: "3.68M-dot OLED EVF",
        "LCD Screen": "3.0-inch Vari-angle Touchscreen",
      },
      features: ["4K 60p Video", "33MP Sensor", "Real-time Tracking", "5-axis Stabilization", "Dual Card Slots"],
      createdAt: new Date(),
    },

    // MAISHIY TEXNIKA
    {
      id: nextProductId++,
      name: "Dyson V15 Detect",
      price: 8500000,
      originalPrice: 9000000,
      description: "Cordless Vacuum Cleaner, Laser dust detection, 60 minutes runtime",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 18,
      category: "Maishiy texnika",
      brand: "Dyson",
      rating: 4.8,
      reviews: 145,
      discount: 6,
      isNew: true,
      isFeatured: false,
      specifications: {
        Turi: "Cordless Vacuum",
        "Batareya muddati": "60 daqiqa",
        "Dust Detection": "Laser",
        Filtration: "HEPA",
        "Bin Capacity": "0.77L",
        "Og'irligi": "3.0 kg",
        "Noise Level": "75 dB",
        Attachments: "8 tools included",
      },
      features: ["Laser Detection", "60min Runtime", "HEPA Filter", "Lightweight", "8 Tools", "LCD Display"],
      createdAt: new Date(),
    },
    {
      id: nextProductId++,
      name: "Xiaomi Robot Vacuum S10+",
      price: 4500000,
      originalPrice: 5000000,
      description: "Robot Vacuum with Auto-Empty Station, LiDAR navigation, Mopping",
      image: "/placeholder.svg?height=400&width=400",
      images: ["/placeholder.svg?height=400&width=400"],
      stock: 22,
      category: "Maishiy texnika",
      brand: "Xiaomi",
      rating: 4.6,
      reviews: 198,
      discount: 10,
      isNew: true,
      isFeatured: false,
      specifications: {
        Turi: "Robot Vacuum",
        Navigation: "LiDAR",
        "Suction Power": "4000Pa",
        "Battery Life": "180 daqiqa",
        "Dust Bin": "0.4L",
        "Water Tank": "0.2L",
        "Auto-Empty Station": "Ha",
        "App Control": "Mi Home",
      },
      features: ["Auto-Empty Station", "LiDAR Navigation", "Mopping", "4000Pa Suction", "App Control", "Voice Control"],
      createdAt: new Date(),
    },
  ]

  // Update category counts
  updateCategoryCounts()

  // Create admin user
  const adminUser = {
    id: nextUserId++,
    name: "Admin",
    email: "admin@dern-market.uz",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
    createdAt: new Date(),
  }
  users.push(adminUser)

  console.log("✅ Ma'lumotlar bazasi yaratildi:")
  console.log(`📦 Mahsulotlar: ${products.length}`)
  console.log(`🏷️ Kategoriyalar: ${categories.length}`)
  console.log(`👥 Foydalanuvchilar: ${users.length}`)
}

function updateCategoryCounts() {
  categories.forEach((category) => {
    category.count = products.filter((p) => p.category === category.name).length
  })
}

// Initialize data
initializeData()

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token talab qilinadi" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Yaroqsiz token" })
    }
    req.user = user
    next()
  })
}

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Admin huquqi talab qilinadi" })
  }
  next()
}

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    products: products.length,
    users: users.length,
    orders: orders.length,
  })
})

// User registration
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    }

    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return res.status(400).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      id: nextUserId++,
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
    }

    users.push(newUser)

    const token = jwt.sign({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// User login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email va parolni kiriting" })
    }

    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(400).json({ error: "Email yoki parol noto'g'ri" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Email yoki parol noto'g'ri" })
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Kirish muvaffaqiyatli",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get categories
app.get("/api/categories", (req, res) => {
  try {
    updateCategoryCounts()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: "Kategoriyalarni yuklashda xatolik" })
  }
})

// Get brands
app.get("/api/brands", (req, res) => {
  try {
    const brands = [...new Set(products.map((p) => p.brand))].sort()
    res.json(brands)
  } catch (error) {
    res.status(500).json({ error: "Brendlarni yuklashda xatolik" })
  }
})

// Get products with filtering
app.get("/api/products", (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, featured, isNew } = req.query

    let filteredProducts = [...products]

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.brand.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm),
      )
    }

    // Category filter
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }

    // Brand filter
    if (brand && brand !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.brand === brand)
    }

    // Price range filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= Number.parseInt(minPrice))
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= Number.parseInt(maxPrice))
    }

    // Featured filter
    if (featured === "true") {
      filteredProducts = filteredProducts.filter((p) => p.isFeatured)
    }

    // New products filter
    if (isNew === "true") {
      filteredProducts = filteredProducts.filter((p) => p.isNew)
    }

    // Sort products
    if (sort === "price-asc") {
      filteredProducts.sort((a, b) => a.price - b.price)
    } else if (sort === "price-desc") {
      filteredProducts.sort((a, b) => b.price - a.price)
    } else if (sort === "name") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating)
    } else if (sort === "newest") {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Pagination
    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    res.json({
      products: paginatedProducts,
      totalProducts: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limitNum),
      currentPage: pageNum,
      hasNextPage: endIndex < filteredProducts.length,
      hasPrevPage: pageNum > 1,
    })
  } catch (error) {
    console.error("Products error:", error)
    res.status(500).json({ error: "Mahsulotlarni yuklashda xatolik" })
  }
})

// Get single product
app.get("/api/products/:id", (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return res.status(404).json({ error: "Mahsulot topilmadi" })
    }

    // Get related products
    const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

    res.json({
      ...product,
      relatedProducts,
    })
  } catch (error) {
    res.status(500).json({ error: "Mahsulotni yuklashda xatolik" })
  }
})

// Create order
app.post("/api/orders", authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ error: "Buyurtma bo'sh bo'lishi mumkin emas" })
    }

    if (!shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring" })
    }

    // Validate items and check stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return res.status(400).json({ error: `Mahsulot topilmadi: ${item.name}` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `${product.name} uchun yetarli miqdor yo'q. Omborda: ${product.stock}`,
        })
      }
    }

    // Update stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      product.stock -= item.quantity
    }

    // Create order
    const newOrder = {
      id: nextOrderId++,
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    orders.push(newOrder)

    res.json({
      message: "Buyurtma muvaffaqiyatli yaratildi",
      order: newOrder,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    res.status(500).json({ error: "Buyurtma yaratishda xatolik" })
  }
})

// Get user orders
app.get("/api/orders", authenticateToken, (req, res) => {
  try {
    const userOrders = orders
      .filter((o) => o.userId === req.user.id)
      .map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.productId),
        })),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(userOrders)
  } catch (error) {
    res.status(500).json({ error: "Buyurtmalarni yuklashda xatolik" })
  }
})

// Admin routes
app.get("/api/admin/orders", authenticateToken, requireAdmin, (req, res) => {
  try {
    const ordersWithUserInfo = orders
      .map((order) => {
        const user = users.find((u) => u.id === order.userId)
        return {
          ...order,
          userName: user?.name || "Noma'lum",
          userEmail: user?.email || "Noma'lum",
          items: order.items.map((item) => ({
            ...item,
            product: products.find((p) => p.id === item.productId),
          })),
        }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(ordersWithUserInfo)
  } catch (error) {
    res.status(500).json({ error: "Buyurtmalarni yuklashda xatolik" })
  }
})

app.put("/api/admin/orders/:id", authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body
    const orderId = Number.parseInt(req.params.id)
    const order = orders.find((o) => o.id === orderId)

    if (!order) {
      return res.status(404).json({ error: "Buyurtma topilmadi" })
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Noto'g'ri holat" })
    }

    order.status = status
    order.updatedAt = new Date()

    res.json({ message: "Buyurtma holati yangilandi", order })
  } catch (error) {
    res.status(500).json({ error: "Buyurtma holatini yangilashda xatolik" })
  }
})

app.post("/api/admin/products", authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, price, originalPrice, description, image, stock, category, brand, specifications, features } =
      req.body

    if (!name || !price || !description || !category || !brand || stock === undefined) {
      return res.status(400).json({ error: "Barcha majburiy maydonlarni to'ldiring" })
    }

    const newProduct = {
      id: nextProductId++,
      name,
      price: Number.parseFloat(price),
      originalPrice: originalPrice ? Number.parseFloat(originalPrice) : Number.parseFloat(price),
      description,
      image: image || "/placeholder.svg?height=400&width=400",
      images: [image || "/placeholder.svg?height=400&width=400"],
      stock: Number.parseInt(stock),
      category,
      brand,
      rating: 0,
      reviews: 0,
      discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      isNew: true,
      isFeatured: false,
      specifications: specifications || {},
      features: features || [],
      createdAt: new Date(),
    }

    products.push(newProduct)
    updateCategoryCounts()

    res.json({ message: "Mahsulot qo'shildi", product: newProduct })
  } catch (error) {
    res.status(500).json({ error: "Mahsulot qo'shishda xatolik" })
  }
})

app.put("/api/admin/products/:id", authenticateToken, requireAdmin, (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return res.status(404).json({ error: "Mahsulot topilmadi" })
    }

    const {
      name,
      price,
      originalPrice,
      description,
      image,
      stock,
      category,
      brand,
      specifications,
      features,
      isFeatured,
    } = req.body

    if (name) product.name = name
    if (price) product.price = Number.parseFloat(price)
    if (originalPrice) product.originalPrice = Number.parseFloat(originalPrice)
    if (description) product.description = description
    if (image) product.image = image
    if (stock !== undefined) product.stock = Number.parseInt(stock)
    if (category) product.category = category
    if (brand) product.brand = brand
    if (specifications) product.specifications = specifications
    if (features) product.features = features
    if (isFeatured !== undefined) product.isFeatured = isFeatured

    product.discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    product.updatedAt = new Date()

    updateCategoryCounts()

    res.json({ message: "Mahsulot yangilandi", product })
  } catch (error) {
    res.status(500).json({ error: "Mahsulotni yangilashda xatolik" })
  }
})

app.delete("/api/admin/products/:id", authenticateToken, requireAdmin, (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id)
    const index = products.findIndex((p) => p.id === productId)

    if (index === -1) {
      return res.status(404).json({ error: "Mahsulot topilmadi" })
    }

    products.splice(index, 1)
    updateCategoryCounts()

    res.json({ message: "Mahsulot o'chirildi" })
  } catch (error) {
    res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" })
  }
})

app.get("/api/admin/stats", authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalUsers = users.filter((u) => !u.isAdmin).length
    const totalProducts = products.length

    // Top selling products
    const productSales = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productSales[item.productId]) {
          productSales[item.productId] += item.quantity
        } else {
          productSales[item.productId] = item.quantity
        }
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === Number.parseInt(productId))
        return {
          product: product?.name || "Noma'lum",
          quantity,
          revenue: product ? product.price * quantity : 0,
        }
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    const stats = {
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      topProducts,
      lowStockProducts: products.filter((p) => p.stock < 10).length,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: "Statistikalarni yuklashda xatolik" })
  }
})

app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
  try {
    const userList = users
      .filter((u) => !u.isAdmin)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        ordersCount: orders.filter((o) => o.userId === u.id).length,
        totalSpent: orders.filter((o) => o.userId === u.id).reduce((sum, order) => sum + order.totalAmount, 0),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(userList)
  } catch (error) {
    res.status(500).json({ error: "Foydalanuvchilarni yuklashda xatolik" })
  }
})

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({ error: "Server xatosi yuz berdi" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Sahifa topilmadi" })
})

// Start server
app.listen(PORT, () => {
  console.log("🚀 Dern-Market server ishga tushdi!")
  console.log(`🌐 Server: http://localhost:${PORT}`)
  console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`)
  console.log(`🔐 Admin login: admin@dern-market.uz / admin123`)
  console.log(`📦 Mahsulotlar: ${products.length}`)
  console.log(`🏷️ Kategoriyalar: ${categories.length}`)
  console.log(`👥 Foydalanuvchilar: ${users.length}`)
  console.log("✅ Server tayyor!")
})
