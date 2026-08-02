const db = require("../config/db");

const Inventory = {

    // ==========================================
    // ADD STOCK TRANSACTION
    // ==========================================

    addTransaction: (productId, type, quantity, note, callback) => {

        const sql = `
            INSERT INTO inventory_transactions
            (product_id, transaction_type, quantity, note)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [productId, type, quantity, note],
            callback
        );
    },


    // ==========================================
    // UPDATE PRODUCT STOCK
    // ==========================================

    updateStock: (productId, quantityChange, callback) => {

        const sql = `
            UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [quantityChange, productId],
            callback
        );
    },


    // ==========================================
    // GET CURRENT PRODUCT
    // ==========================================

    getProduct: (productId, callback) => {

        const sql = `
            SELECT *
            FROM products
            WHERE id = ?
        `;

        db.query(
            sql,
            [productId],
            callback
        );
    },


    // ==========================================
    // GET COMPLETE INVENTORY HISTORY
    // ==========================================

    getHistory: (callback) => {

        const sql = `
            SELECT
                inventory_transactions.id,
                inventory_transactions.product_id,
                products.name AS product_name,
                inventory_transactions.transaction_type,
                inventory_transactions.quantity,
                inventory_transactions.note,
                inventory_transactions.created_at

            FROM inventory_transactions

            JOIN products
            ON inventory_transactions.product_id = products.id

            ORDER BY inventory_transactions.id DESC
        `;

        db.query(sql, callback);
    },


    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    getDashboardStats: (callback) => {

        const sql = `
            SELECT

                COUNT(*) AS totalProducts,

                COALESCE(
                    SUM(quantity),
                    0
                ) AS totalStock,

                COALESCE(
                    SUM(quantity * price),
                    0
                ) AS totalValue,

                COALESCE(
                    SUM(
                        CASE
                            WHEN quantity > 0
                            AND quantity <= 10
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS lowStockProducts,

                COALESCE(
                    SUM(
                        CASE
                            WHEN quantity = 0
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS outOfStockProducts

            FROM products
        `;

        db.query(sql, callback);
    },


    // ==========================================
    // GET LOW STOCK PRODUCTS
    // ==========================================

    getLowStock: (callback) => {

        const sql = `
            SELECT
                id,
                name,
                category,
                quantity,
                price

            FROM products

            WHERE quantity <= 10

            ORDER BY quantity ASC
        `;

        db.query(sql, callback);
    },


    // ==========================================
    // GET RECENT INVENTORY TRANSACTIONS
    // ==========================================

    getRecentTransactions: (callback) => {

        const sql = `
            SELECT
                inventory_transactions.id,
                inventory_transactions.product_id,
                products.name AS product_name,
                inventory_transactions.transaction_type,
                inventory_transactions.quantity,
                inventory_transactions.note,
                inventory_transactions.created_at

            FROM inventory_transactions

            JOIN products
            ON inventory_transactions.product_id = products.id

            ORDER BY inventory_transactions.id DESC

            LIMIT 5
        `;

        db.query(sql, callback);
    }

};

module.exports = Inventory;