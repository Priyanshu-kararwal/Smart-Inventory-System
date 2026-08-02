const Inventory = require("../models/inventory");


// ==========================================
// STOCK IN
// ==========================================

const stockIn = (req, res) => {

    const { productId, quantity, note } = req.body;

    const qty = Number(quantity);

    if (!productId || !Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({
            success: false,
            message: "Valid productId and positive quantity are required"
        });
    }

    // Check whether product exists
    Inventory.getProduct(productId, (err, products) => {

        if (err) {
            console.error("STOCK IN ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const currentQuantity = Number(products[0].quantity);

        // Increase stock
        Inventory.updateStock(productId, qty, (err) => {

            if (err) {
                console.error("STOCK UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update stock"
                });
            }

            // Save transaction
            Inventory.addTransaction(
                productId,
                "IN",
                qty,
                note || null,
                (err, result) => {

                    if (err) {
                        console.error("TRANSACTION ERROR:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to save inventory transaction"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Stock added successfully",
                        transactionId: result.insertId,
                        previousQuantity: currentQuantity,
                        quantityAdded: qty,
                        newQuantity: currentQuantity + qty
                    });
                }
            );
        });
    });
};


// ==========================================
// STOCK OUT
// ==========================================

const stockOut = (req, res) => {

    const { productId, quantity, note } = req.body;

    const qty = Number(quantity);

    if (!productId || !Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({
            success: false,
            message: "Valid productId and positive quantity are required"
        });
    }

    Inventory.getProduct(productId, (err, products) => {

        if (err) {
            console.error("STOCK OUT ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const currentQuantity = Number(products[0].quantity);

        // Prevent stock from becoming negative
        if (currentQuantity < qty) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
                availableQuantity: currentQuantity,
                requestedQuantity: qty
            });
        }

        // Decrease stock
        Inventory.updateStock(productId, -qty, (err) => {

            if (err) {
                console.error("STOCK UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update stock"
                });
            }

            // Save transaction
            Inventory.addTransaction(
                productId,
                "OUT",
                qty,
                note || null,
                (err, result) => {

                    if (err) {
                        console.error("TRANSACTION ERROR:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to save inventory transaction"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Stock removed successfully",
                        transactionId: result.insertId,
                        previousQuantity: currentQuantity,
                        quantityRemoved: qty,
                        newQuantity: currentQuantity - qty
                    });
                }
            );
        });
    });
};


// ==========================================
// COMPLETE INVENTORY HISTORY
// ==========================================

const getInventoryHistory = (req, res) => {

    Inventory.getHistory((err, transactions) => {

        if (err) {
            console.error("INVENTORY HISTORY ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch inventory history"
            });
        }

        return res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    });
};


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

const getDashboard = (req, res) => {

    Inventory.getDashboardStats((err, results) => {

        if (err) {
            console.error("DASHBOARD ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard statistics"
            });
        }

        const stats = results[0];

        return res.status(200).json({
            success: true,

            dashboard: {
                totalProducts: Number(stats.totalProducts),
                totalStock: Number(stats.totalStock),
                totalInventoryValue: Number(stats.totalValue),
                lowStockProducts: Number(stats.lowStockProducts),
                outOfStockProducts: Number(stats.outOfStockProducts)
            }
        });
    });
};


// ==========================================
// LOW STOCK PRODUCTS
// ==========================================

const getLowStockProducts = (req, res) => {

    Inventory.getLowStock((err, products) => {

        if (err) {
            console.error("LOW STOCK ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch low stock products"
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            lowStockProducts: products
        });
    });
};


// ==========================================
// RECENT INVENTORY TRANSACTIONS
// ==========================================

const getRecentTransactions = (req, res) => {

    Inventory.getRecentTransactions((err, transactions) => {

        if (err) {
            console.error("RECENT TRANSACTIONS ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch recent transactions"
            });
        }

        return res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    });
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    stockIn,
    stockOut,
    getInventoryHistory,
    getDashboard,
    getLowStockProducts,
    getRecentTransactions
};