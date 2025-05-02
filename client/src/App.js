import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [fruits, setFruits] = useState([]);
  const [input, setInput] = useState("");
  // Add to your main component
useEffect(() => {
  const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${Math.random() * 10 + 5}px;
          height: ${Math.random() * 10 + 5}px;
          animation-duration: ${Math.random() * 3 + 2}s;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 5000);
  };

  const particleInterval = setInterval(createParticle, 500);
  return () => clearInterval(particleInterval);
}, []);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/login`);
        setFruits(response.data.fruits);
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };

    fetchFruits();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addFruit = async () => {
    if (!input.trim()) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add`, { fruit: input });
      setFruits(response.data.fruits);
      setInput("");
    } catch (error) {
      console.error("Error adding fruit:", error);
    }
  };

  const deleteFruit = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delete/${id}`);
      setFruits(response.data.fruits);
    } catch (error) {
      console.error("Error deleting fruit:", error);
    }
  };

  const getFruitEmoji = (fruit) => {
    if (!fruit || typeof fruit !== "string") return "🍍";
    const emojis = {
      Apple,apple: "🍎",
      Banana,banana: "🍌",
      Orange,orange: "🍊",
      Grape,grape: "🍇",
      Strawberry,strawberry: "🍓",
      Watermelon,watermelon: "🍉",
      Mango,mango: "🥭",
    };
    return emojis[fruit.toLowerCase()] || "🍍";
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to the Fruits To Do 🍎🍌</h1>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Add your fruits"
          value={input}
          onChange={handleInputChange}
          className="input"
        />
        <button onClick={addFruit} className="addButton">
          ADD
        </button>
      </div>
      <ul className="list">
        {fruits.map((fruit, index) => (
          <li key={fruit._id || index} className="listItem">
            <span className="fruitText">{fruit.name}</span>
            <span className="emoji">{getFruitEmoji(fruit.name)}</span>
            <button onClick={() => deleteFruit(fruit._id)} className="deleteButton">
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
