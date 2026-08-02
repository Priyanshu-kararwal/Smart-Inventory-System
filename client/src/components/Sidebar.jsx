import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">S</div>

                <div>
                    <h2>StockFlow</h2>
                    <span>Inventory System</span>
                </div>
            </div>

            <nav>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/inventory">Stock Management</NavLink>
                <NavLink to="/history">Transactions</NavLink>
            </nav>

            <button className="logout-button" onClick={logout}>
                Logout
            </button>
        </aside>
    );
}

export default Sidebar;