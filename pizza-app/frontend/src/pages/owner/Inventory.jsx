import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  description: "",
  category: "Veg",
  image: "",
  stock: 0,
  isAvailable: true,
  sizes: [
    { label: "Small", price: 149 },
    { label: "Medium", price: 249 },
    { label: "Large", price: 349 },
  ],
};

export default function Inventory() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/pizzas");
      setPizzas(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPizzas();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSizeChange = (idx, field, value) => {
    const sizes = [...form.sizes];
    sizes[idx] = { ...sizes[idx], [field]: field === "price" ? Number(value) : value };
    setForm({ ...form, sizes });
  };

  const handleEdit = (pizza) => {
    setForm({
      name: pizza.name,
      description: pizza.description,
      category: pizza.category,
      image: pizza.image,
      stock: pizza.stock,
      isAvailable: pizza.isAvailable,
      sizes: pizza.sizes,
    });
    setEditingId(pizza._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this pizza from inventory?")) return;
    try {
      await api.delete(`/pizzas/${id}`);
      loadPizzas();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete pizza");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/pizzas/${editingId}`, payload);
      } else {
        await api.post("/pizzas", payload);
      }
      resetForm();
      loadPizzas();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save pizza");
    }
  };

  const handleQuickStock = async (pizza, delta) => {
    const newStock = Math.max(0, pizza.stock + delta);
    try {
      await api.put(`/pizzas/${pizza._id}`, { stock: newStock });
      loadPizzas();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const toggleAvailability = async (pizza) => {
    try {
      await api.put(`/pizzas/${pizza._id}`, { isAvailable: !pizza.isAvailable });
      loadPizzas();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability");
    }
  };

  if (loading) return <div className="page-loading">Loading inventory...</div>;

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title">Owner Inventory</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Pizza
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <form className="inventory-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Pizza" : "New Pizza"}</h3>

          <label>Name</label>
          <input name="name" value={form.name} onChange={handleFormChange} required />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={2}
          />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleFormChange}>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Vegan">Vegan</option>
          </select>

          <label>Image URL</label>
          <input name="image" value={form.image} onChange={handleFormChange} />

          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock"
            min={0}
            value={form.stock}
            onChange={handleFormChange}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleFormChange}
            />
            Available for order
          </label>

          <label>Sizes & Pricing</label>
          {form.sizes.map((s, idx) => (
            <div key={idx} className="size-row">
              <input
                value={s.label}
                onChange={(e) => handleSizeChange(idx, "label", e.target.value)}
                placeholder="Size label"
              />
              <input
                type="number"
                value={s.price}
                onChange={(e) => handleSizeChange(idx, "price", e.target.value)}
                placeholder="Price"
              />
            </div>
          ))}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Save Changes" : "Add to Inventory"}
            </button>
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="inventory-table">
        <div className="inventory-header-row">
          <span>Pizza</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="inventory-row">
            <span className="inv-name">
              <img src={pizza.image} alt={pizza.name} className="inv-thumb" />
              {pizza.name}
            </span>
            <span>{pizza.category}</span>
            <span className="stock-controls">
              <button onClick={() => handleQuickStock(pizza, -1)}>-</button>
              {pizza.stock}
              <button onClick={() => handleQuickStock(pizza, 1)}>+</button>
            </span>
            <span>
              <button
                className={`toggle-pill ${pizza.isAvailable ? "on" : "off"}`}
                onClick={() => toggleAvailability(pizza)}
              >
                {pizza.isAvailable ? "Available" : "Hidden"}
              </button>
            </span>
            <span className="row-actions">
              <button className="link-btn" onClick={() => handleEdit(pizza)}>
                Edit
              </button>
              <button className="link-btn danger" onClick={() => handleDelete(pizza._id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
