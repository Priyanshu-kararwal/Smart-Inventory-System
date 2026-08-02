import { useEffect, useState } from "react";
import request from "../services/api";

function Inventory() {
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        productId: "",
        quantity: "",
        note: ""
    });

    const [type, setType] = useState("IN");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    const loadProducts = async () => {
        try {
            const data = await request("/products");

            setProducts(data.products || []);
        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Failed to load products"
            );
        }
    };

    // ==========================================
    // INITIAL PRODUCT LOAD
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                const data = await request("/products");

                if (!cancelled) {
                    setProducts(data.products || []);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(error);

                    setMessage(
                        error.message ||
                            "Failed to load products"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    // ==========================================
    // STOCK IN / STOCK OUT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productId = Number(form.productId);
        const quantity = Number(form.quantity);

        if (!productId) {
            setMessage("Please select a product.");
            return;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            setMessage(
                "Quantity must be a positive whole number."
            );
            return;
        }

        // Extra frontend check for Stock OUT
        if (type === "OUT") {
            const selectedProduct = products.find(
                (product) =>
                    Number(product.id) === productId
            );

            if (
                selectedProduct &&
                quantity >
                    Number(selectedProduct.quantity)
            ) {
                setMessage(
                    `Insufficient stock. Only ${selectedProduct.quantity} units available.`
                );

                return;
            }
        }

        try {
            setSubmitting(true);
            setMessage("");

            const endpoint =
                type === "IN"
                    ? "/inventory/in"
                    : "/inventory/out";

            const data = await request(endpoint, {
                method: "POST",
                body: JSON.stringify({
                    productId,
                    quantity,
                    note: form.note.trim()
                })
            });

            setMessage(
                `${data.message}. New quantity: ${data.newQuantity}`
            );

            // Reset form
            setForm({
                productId: "",
                quantity: "",
                note: ""
            });

            // Refresh stock
            await loadProducts();
        } catch (error) {
            console.error(error);

            setMessage(
                error.message ||
                    "Stock transaction failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // CHANGE STOCK TYPE
    // ==========================================

    const changeType = (newType) => {
        setType(newType);
        setMessage("");

        setForm((previousForm) => ({
            ...previousForm,
            quantity: "",
            note: ""
        }));
    };

    return (
        <>
            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                    <h1>Stock Management</h1>

                    <p>
                        Record stock coming in or going out
                    </p>
                </div>
            </div>

            {/* MESSAGE */}

            {message && (
                <div className="info-message">
                    {message}
                </div>
            )}

            <div className="inventory-layout">

                {/* STOCK MANAGEMENT FORM */}

                <div className="panel">

                    <div className="stock-toggle">

                        <button
                            type="button"
                            className={
                                type === "IN"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeType("IN")
                            }
                        >
                            Stock IN
                        </button>

                        <button
                            type="button"
                            className={
                                type === "OUT"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                changeType("OUT")
                            }
                        >
                            Stock OUT
                        </button>

                    </div>

                    <form
                        className="stock-form"
                        onSubmit={handleSubmit}
                    >

                        {/* PRODUCT */}

                        <label htmlFor="productId">
                            Product
                        </label>

                        <select
                            id="productId"
                            name="productId"
                            value={form.productId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select product
                            </option>

                            {products.map((product) => (
                                <option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name} -{" "}
                                    {product.quantity} in stock
                                </option>
                            ))}

                        </select>

                        {/* QUANTITY */}

                        <label htmlFor="quantity">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />

                        {/* NOTE */}

                        <label htmlFor="note">
                            Note
                        </label>

                        <textarea
                            id="note"
                            name="note"
                            placeholder={
                                type === "IN"
                                    ? "Example: New shipment received"
                                    : "Example: Product sold"
                            }
                            value={form.note}
                            onChange={handleChange}
                        />

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Processing..."
                                : type === "IN"
                                  ? "Add Stock"
                                  : "Remove Stock"}
                        </button>

                    </form>
                </div>

                {/* CURRENT STOCK */}

                <div className="panel">

                    <h3>Current Stock</h3>

                    {loading ? (
                        <p className="empty">
                            Loading stock...
                        </p>
                    ) : products.length === 0 ? (
                        <p className="empty">
                            No products available.
                        </p>
                    ) : (
                        <div className="stock-list">

                            {products.map((product) => (
                                <div
                                    className="stock-list-item"
                                    key={product.id}
                                >
                                    <div>
                                        <strong>
                                            {product.name}
                                        </strong>

                                        <p>
                                            {product.category ||
                                                "Uncategorized"}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            Number(
                                                product.quantity
                                            ) <= 10
                                                ? "stock-low"
                                                : "stock-good"
                                        }
                                    >
                                        {product.quantity} units
                                    </span>

                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Inventory;