"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ManageProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const router = useRouter();

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const addProduct = async () => {
    const imageUrl = await uploadImage();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        image: imageUrl,
        price: parseFloat(price),
        category,
        bestSeller,
        newArrival,
      }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
      setBestSeller(false);
      setNewArrival(false);
      router.refresh();
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl">Manage Products</h1>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Category</option>

          {["Spices", "Herbs", "Essential Oils", "Gift Sets"].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ),
          )}
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-2 border p-2"
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2"
        />
        <label>
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={() => setBestSeller(!bestSeller)}
          />
          Best Seller
        </label>
        <label>
          <input
            type="checkbox"
            checked={newArrival}
            onChange={() => setNewArrival(!newArrival)}
          />
          New Arrival
        </label>
        <button
          onClick={addProduct}
          className="col-span-2 bg-green-600 px-4 py-2 text-white"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ManageProducts;
