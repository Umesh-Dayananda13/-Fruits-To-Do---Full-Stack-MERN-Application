import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [fruits, setFruits] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {   
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/login`
        );
        setFruits(response.data.fruits);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load fruits");
      }
    };

    fetchData();
  }, []);

  const onInputChange = (e) => {
    setInput(e.target.value);
    setError(null); // Clear error when typing
  };

  const addFruit = () => {
    if (!input.trim()) {
      setError("Please enter a fruit name");
      return;
    }
    
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/add`, {
      fruit: input,
    })
    .then((response) => {
      setFruits(response.data.fruits);
      setInput("");
    })
    .catch((error) => {
      console.error("Error adding fruit:", error);
      setError("Failed to add fruit");
    });
  };

  const deleteFruit = (id) => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delete/${id}`)
      .then((response) => {
        setFruits(response.data.fruits);
      })
      .catch((error) => {
        console.error("Error deleting fruit:", error);
        setError("Failed to delete fruit");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to the Fruits To Do 🍎🍌</h1>
      <div style={styles.inputContainer}>
        <input
          placeholder="Add your fruits"
          value={input}
          onChange={onInputChange}
          style={styles.input}
          onKeyPress={(e) => e.key === "Enter" && addFruit()}
        />
        <button onClick={addFruit} style={styles.addButton}>
          ADD
        </button>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}

      <ul style={styles.list}>
        {fruits.map((fruit) => (
          <li key={fruit._id} style={styles.listItem}>
            <span style={styles.fruitText}>{fruit.name}</span>
            <div style={styles.actions}>
              <span style={styles.emoji}>{getFruitEmoji(fruit.name)}</span>
              <button 
                onClick={() => deleteFruit(fruit._id)}
                style={styles.deleteButton}
                aria-label="Delete fruit"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ... getFruitEmoji function remains the same ...

const styles = {
  // ... previous styles remain the same ...,
  listItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "1rem 2rem",
    margin: "0.8rem 0",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateX(10px)",
      backgroundColor: "rgba(255,255,255,0.4)",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#ff4444",
    transition: "transform 0.2s",
    ":hover": {
      transform: "scale(1.2)",
      color: "#ff0000"
    }
  },
  error: {
    color: "#ff0000",
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: "bold",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  }
};

export default App;