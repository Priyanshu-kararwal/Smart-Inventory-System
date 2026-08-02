import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import History from "./pages/History";

function ProtectedLayout({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedLayout>
                            <Dashboard />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedLayout>
                            <Products />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <ProtectedLayout>
                            <Inventory />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedLayout>
                            <History />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;