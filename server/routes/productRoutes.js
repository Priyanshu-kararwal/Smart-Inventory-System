const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// PRODUCT ROUTES
// ==========================================

// Add new product
router.post(
    "/",
    authMiddleware,
    createProduct
);


// Get all products
router.get(
    "/",
    authMiddleware,
    getProducts
);


// Search products
// IMPORTANT: Keep this before /:id
router.get(
    "/search",
    authMiddleware,
    searchProducts
);


// Get single product
router.get(
    "/:id",
    authMiddleware,
    getProductById
);


// Update product
router.put(
    "/:id",
    authMiddleware,
    updateProduct
);


// Delete product
router.delete(
    "/:id",
    authMiddleware,
    deleteProduct
);


module.exports = router;