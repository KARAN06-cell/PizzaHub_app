import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        🍕 PizzaHub
      </Link>

      <div className="nav-links">
        <Link to="/">Menu</Link>

        {user && user.role === "customer" && (
          <>
            <Link to="/cart">Cart ({totalCount})</Link>
            <Link to="/my-orders">My Orders</Link>
          </>
        )}

        {user && user.role === "owner" && (
          <>
            <Link to="/owner/inventory">Inventory</Link>
            <Link to="/owner/orders">Orders</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <span className="nav-user">
            {user.name} ({user.role})
            <button className="link-btn" onClick={handleLogout}>
              Logout
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}
