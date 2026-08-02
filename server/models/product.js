const db = require("../config/db");

const Product = {

    // ==========================================
    // CREATE PRODUCT
    // ==========================================

    create: (name, category, quantity, price, callback) => {

        const sql = `
            INSERT INTO products
            (name, category, quantity, price)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, category, quantity, price],
            callback
        );
    },


    // ==========================================
    // GET ALL PRODUCTS
    // ==========================================

    getAll: (callback) => {

        const sql = `
            SELECT *
            FROM products
            ORDER BY id DESC
        `;

        db.query(sql, callback);
    },


    // ==========================================
    // GET PRODUCT BY ID
    // ==========================================

    getById: (id, callback) => {

        const sql = `
            SELECT *
            FROM products
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },


    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    update: (id, name, category, quantity, price, callback) => {

        const sql = `
            UPDATE products
            SET
                name = ?,
                category = ?,
                quantity = ?,
                price = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [name, category, quantity, price, id],
            callback
        );
    },


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    delete: (id, callback) => {

        const sql = `
            DELETE FROM products
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },


    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    search: (keyword, callback) => {

        const sql = `
            SELECT *
            FROM products
            WHERE name LIKE ?
            OR category LIKE ?
            ORDER BY id DESC
        `;

        const searchValue = `%${keyword}%`;

        db.query(
            sql,
            [searchValue, searchValue],
            callback
        );
    }

};

module.exports = Product;