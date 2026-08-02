const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


// ==========================================
// STATIC FILES
// ==========================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// ==========================================
// BASIC API ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Smart Inventory Management API is running",
        version: "1.0.0"
    });

});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        server: "online",
        timestamp: new Date()
    });

});


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


// ==========================================
// PRODUCT ROUTES
// ==========================================

const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);


// ==========================================
// INVENTORY ROUTES
// ==========================================

const inventoryRoutes = require("./routes/inventoryRoutes");

app.use("/api/inventory", inventoryRoutes);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("==========================================");
    console.log(" SMART INVENTORY MANAGEMENT SYSTEM");
    console.log("==========================================");
    console.log(` Server running on port: ${PORT}`);
    console.log(` API: http://localhost:${PORT}`);
    console.log("==========================================");
    console.log("");

});