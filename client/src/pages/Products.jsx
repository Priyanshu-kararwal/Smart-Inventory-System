import { useEffect, useState } from "react";
import request from "../services/api";

function Products() {
    const emptyForm = {
        name: "",
        category: "",
        quantity: "",
        price: ""
    };

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    const loadProducts = async () => {
        try {
            const data = await request("/products");

            setProducts(data.products || []);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage(error.message || "Failed to load products");
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
                        error.message || "Failed to load products"
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
    // FORM INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    // ==========================================
    // ADD / UPDATE PRODUCT
    // ==========================================

    const saveProduct = async (e) => {
        e.preventDefault();

        try {
            const body = {
                name: form.name.trim(),
                category: form.category.trim(),
                quantity: Number(form.quantity),
                price: Number(form.price)
            };

            if (editingId !== null) {
                await request(`/products/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(body)
                });

                setMessage("Product updated successfully");
            } else {
                await request("/products", {
                    method: "POST",
                    body: JSON.stringify(body)
                });

                setMessage("Product added successfully");
            }

            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);

            await loadProducts();
        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Failed to save product"
            );
        }
    };

    // ==========================================
    // EDIT PRODUCT
    // ==========================================

    const editProduct = (product) => {
        setEditingId(product.id);

        setForm({
            name: product.name || "",
            category: product.category || "",
            quantity: product.quantity ?? "",
            price: product.price ?? ""
        });

        setShowForm(true);
        setMessage("");
    };

    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const deleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await request(`/products/${id}`, {
                method: "DELETE"
            });

            setMessage("Product deleted successfully");

            await loadProducts();
        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Failed to delete product"
            );
        }
    };

    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    const searchProducts = async () => {
        const query = search.trim();

        if (!query) {
            await loadProducts();
            return;
        }

        try {
            const data = await request(
                `/products/search?q=${encodeURIComponent(query)}`
            );

            setProducts(data.products || []);
            setMessage("");
        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Failed to search products"
            );
        }
    };

    // ==========================================
    // RESET SEARCH
    // ==========================================

    const resetSearch = async () => {
        setSearch("");
        await loadProducts();
    };

    // ==========================================
    // OPEN ADD PRODUCT FORM
    // ==========================================

    const openAddForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setMessage("");
    };

    // ==========================================
    // CLOSE FORM
    // ==========================================

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    return (
        <>
            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product catalogue</p>
                </div>

                <button
                    className="primary-button"
                    onClick={openAddForm}
                >
                    + Add Product
                </button>
            </div>

            {/* MESSAGE */}

            {message && (
                <div className="info-message">
                    {message}
                </div>
            )}

            {/* SEARCH */}

            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchProducts();
                        }
                    }}
                />

                <button
                    type="button"
                    className="secondary-button"
                    onClick={searchProducts}
                >
                    Search
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={resetSearch}
                >
                    Reset
                </button>
            </div>

            {/* ADD / EDIT PRODUCT FORM */}

            {showForm && (
                <div className="panel form-panel">
                    <h3>
                        {editingId !== null
                            ? "Edit Product"
                            : "Add New Product"}
                    </h3>

                    <form
                        className="product-form"
                        onSubmit={saveProduct}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Product name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="quantity"
                            min="0"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingId !== null
                                ? "Update Product"
                                : "Save Product"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={closeForm}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* PRODUCTS TABLE */}

            <div className="table-container">

                {loading ? (
                    <p className="empty">
                        Loading products...
                    </p>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>

                                        <td>
                                            #{product.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {product.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {product.category ||
                                                "Uncategorized"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    Number(
                                                        product.quantity
                                                    ) <= 10
                                                        ? "stock-low"
                                                        : "stock-good"
                                                }
                                            >
                                                {product.quantity}
                                            </span>
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                product.price || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td>
                                            ₹
                                            {(
                                                Number(
                                                    product.price || 0
                                                ) *
                                                Number(
                                                    product.quantity || 0
                                                )
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td className="actions">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editProduct(
                                                        product
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteProduct(
                                                        product.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {products.length === 0 && (
                            <p className="empty">
                                No products found.
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Products;