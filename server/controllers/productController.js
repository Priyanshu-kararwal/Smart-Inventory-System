const Product = require("../models/product");


// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = (req, res) => {

    const { name, category, quantity, price } = req.body;

    if (
        !name ||
        !category ||
        quantity === undefined ||
        price === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, category, quantity and price are required"
        });
    }

    if (Number(quantity) < 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity cannot be negative"
        });
    }

    if (Number(price) < 0) {
        return res.status(400).json({
            success: false,
            message: "Price cannot be negative"
        });
    }

    Product.create(
        name.trim(),
        category.trim(),
        Number(quantity),
        Number(price),

        (err, result) => {

            if (err) {

                console.error("PRODUCT CREATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add product"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = (req, res) => {

    Product.getAll((err, products) => {

        if (err) {

            console.error("PRODUCT FETCH ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products"
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    });
};


// ==========================================
// GET PRODUCT BY ID
// ==========================================

const getProductById = (req, res) => {

    const { id } = req.params;

    Product.getById(id, (err, products) => {

        if (err) {

            console.error("PRODUCT FETCH ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch product"
            });
        }

        if (products.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product: products[0]
        });
    });
};


// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = (req, res) => {

    const { id } = req.params;

    const {
        name,
        category,
        quantity,
        price
    } = req.body;

    if (
        !name ||
        !category ||
        quantity === undefined ||
        price === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, category, quantity and price are required"
        });
    }

    if (Number(quantity) < 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity cannot be negative"
        });
    }

    if (Number(price) < 0) {
        return res.status(400).json({
            success: false,
            message: "Price cannot be negative"
        });
    }

    Product.update(
        id,
        name.trim(),
        category.trim(),
        Number(quantity),
        Number(price),

        (err, result) => {

            if (err) {

                console.error("PRODUCT UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update product"
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully"
            });
        }
    );
};


// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = (req, res) => {

    const { id } = req.params;

    Product.delete(id, (err, result) => {

        if (err) {

            console.error("PRODUCT DELETE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete product"
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    });
};


// ==========================================
// SEARCH PRODUCTS
// ==========================================

const searchProducts = (req, res) => {

    const keyword = req.query.q;

    if (!keyword || !keyword.trim()) {

        return res.status(400).json({
            success: false,
            message: "Search keyword is required"
        });
    }

    Product.search(keyword.trim(), (err, products) => {

        if (err) {

            console.error("PRODUCT SEARCH ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to search products"
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    });
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts
};