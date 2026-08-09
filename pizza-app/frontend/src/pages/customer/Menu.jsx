import { useEffect, useState } from "react";
import api from "../../api/axios";
import PizzaCard from "../../components/PizzaCard";

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const { data } = await api.get("/pizzas");
        setPizzas(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const categories = ["All", "Veg", "Non-Veg", "Vegan"];
  const filtered =
    category === "All" ? pizzas : pizzas.filter((p) => p.category === category);

  if (loading) return <div className="page-loading">Loading menu...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Our Pizzas</h1>

      <div className="category-tabs">
        {categories.map((c) => (
          <button
            key={c}
            className={`tab-btn ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p>No pizzas in this category right now.</p>
      ) : (
        <div className="pizza-grid">
          {filtered.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
}
