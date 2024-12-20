import React, { useState } from "react";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    branch: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCard = () => {
    setCards([...cards, formData]);
    setFormData({ name: "", number: "", branch: "" });
    setShowPopup(false);
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setShowPopup(true)} style={{ marginBottom: "20px" }}>
          Add Card
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              width: "200px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <h4>{card.name}</h4>
            <p>Card Number: {card.number}</p>
            <p>Branch: {card.branch}</p>
          </div>
        ))}
      </div>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "5px",
          }}
        >
          <h3>Add New Card</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCard();
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label>
                Card Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Card Number:
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Branch:
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>
            <button type="submit" style={{ marginRight: "10px" }}>
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={{ backgroundColor: "#f44336", color: "#fff" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Cards;
