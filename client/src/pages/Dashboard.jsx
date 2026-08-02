import { useEffect, useState } from "react";
import request from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        totalInventoryValue: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
    });

    const [recent, setRecent] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchDashboard = async () => {
            try {
                const [
                    dashboardData,
                    recentData,
                    lowStockData
                ] = await Promise.all([
                    request("/inventory/dashboard"),
                    request("/inventory/recent"),
                    request("/inventory/low-stock")
                ]);

                if (cancelled) return;

                setStats(
                    dashboardData.dashboard || {
                        totalProducts: 0,
                        totalStock: 0,
                        totalInventoryValue: 0,
                        lowStockProducts: 0,
                        outOfStockProducts: 0
                    }
                );

                setRecent(
                    recentData.transactions || []
                );

                setLowStock(
                    lowStockData.lowStockProducts || []
                );

                setError("");
            } catch (err) {
                if (cancelled) return;

                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError("Failed to load dashboard data.");
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Loading inventory data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your inventory</p>
                </div>
            </div>

            {error && (
                <div className="panel">
                    <p>{error}</p>
                </div>
            )}

            <div className="stats-grid">

                {/* Total Products */}
                <div className="stat-card">
                    <span>Total Products</span>

                    <h2>
                        {stats.totalProducts}
                    </h2>

                    <p>Products in catalogue</p>
                </div>

                {/* Total Stock */}
                <div className="stat-card">
                    <span>Total Stock</span>

                    <h2>
                        {stats.totalStock}
                    </h2>

                    <p>Available units</p>
                </div>

                {/* Inventory Value */}
                <div className="stat-card">
                    <span>Inventory Value</span>

                    <h2>
                        ₹
                        {Number(
                            stats.totalInventoryValue || 0
                        ).toLocaleString("en-IN")}
                    </h2>

                    <p>Current stock value</p>
                </div>

                {/* Low Stock */}
                <div className="stat-card warning-card">
                    <span>Low Stock</span>

                    <h2>
                        {stats.lowStockProducts}
                    </h2>

                    <p>Products need attention</p>
                </div>

                {/* Out Of Stock */}
                <div className="stat-card danger-card">
                    <span>Out of Stock</span>

                    <h2>
                        {stats.outOfStockProducts}
                    </h2>

                    <p>Unavailable products</p>
                </div>

            </div>

            <div className="dashboard-grid">

                {/* Recent Transactions */}
                <div className="panel">

                    <div className="panel-header">
                        <h3>Recent Transactions</h3>
                    </div>

                    {recent.length === 0 ? (
                        <p className="empty">
                            No transactions yet.
                        </p>
                    ) : (
                        <div className="transaction-list">

                            {recent.map((item) => (
                                <div
                                    className="transaction-item"
                                    key={item.id}
                                >
                                    <div>
                                        <strong>
                                            {item.product_name}
                                        </strong>

                                        <p>
                                            {item.note ||
                                                "Stock transaction"}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            item.transaction_type === "IN"
                                                ? "badge badge-in"
                                                : "badge badge-out"
                                        }
                                    >
                                        {item.transaction_type === "IN"
                                            ? "+"
                                            : "-"}

                                        {item.quantity}
                                    </span>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* Low Stock Alert */}
                <div className="panel">

                    <div className="panel-header">
                        <h3>Low Stock Alert</h3>
                    </div>

                    {lowStock.length === 0 ? (
                        <p className="empty">
                            Stock levels look good.
                        </p>
                    ) : (
                        <div className="low-stock-list">

                            {lowStock.map((product) => (
                                <div
                                    className="low-stock-item"
                                    key={product.id}
                                >
                                    <div>
                                        <strong>
                                            {product.name}
                                        </strong>

                                        <p>
                                            {product.category}
                                        </p>
                                    </div>

                                    <span>
                                        {product.quantity} left
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

export default Dashboard;