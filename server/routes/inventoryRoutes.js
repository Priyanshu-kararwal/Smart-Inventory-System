const express = require("express");
const router = express.Router();

const {
    stockIn,
    stockOut,
    getInventoryHistory,
    getDashboard,
    getLowStockProducts,
    getRecentTransactions
} = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// STOCK IN
// POST /api/inventory/in
// ==========================================

router.post(
    "/in",
    authMiddleware,
    stockIn
);


// ==========================================
// STOCK OUT
// POST /api/inventory/out
// ==========================================

router.post(
    "/out",
    authMiddleware,
    stockOut
);


// ==========================================
// COMPLETE INVENTORY HISTORY
// GET /api/inventory/history
// ==========================================

router.get(
    "/history",
    authMiddleware,
    getInventoryHistory
);


// ==========================================
// DASHBOARD STATISTICS
// GET /api/inventory/dashboard
// ==========================================

router.get(
    "/dashboard",
    authMiddleware,
    getDashboard
);


// ==========================================
// LOW STOCK PRODUCTS
// GET /api/inventory/low-stock
// ==========================================

router.get(
    "/low-stock",
    authMiddleware,
    getLowStockProducts
);


// ==========================================
// RECENT TRANSACTIONS
// GET /api/inventory/recent
// ==========================================

router.get(
    "/recent",
    authMiddleware,
    getRecentTransactions
);


module.exports = router;