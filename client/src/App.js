import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [fruits, setFruits] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {   
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/login`
        );
        setFruits(response.data.fruits);
        console.log(response.data.fruits);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const addFruit = () => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/add`, {
      fruit: input,
    })
    .then((response) => {
      setFruits(response.data.fruits);
      setInput("");
    })
    .catch((error) => {
      console.error("Error adding fruit:", error);
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
        />
        <button onClick={addFruit} style={styles.addButton}>
          ADD
        </button>
      </div>
      <ul style={styles.list}>
        {fruits.map((fruit, index) => (
          <li key={fruit._id || index} style={styles.listItem(index)}>
            <span style={styles.fruitText}>{fruit.name}</span>
            <span style={styles.emoji}>{getFruitEmoji(fruit.name)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
const getFruitEmoji = (fruit) => {
  if (!fruit || typeof fruit !== "string") return "🍍";
  const emojis = {
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    grape: "🍇",
    strawberry: "🍓",
    watermelon: "🍉",
    mango: "🥭",
  };
  return emojis[fruit.toLowerCase()] || "🍍";
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #ffafbd, #ffc3a0)",
    fontFamily: "'Comic Neue', cursive",
  },
  title: {
    fontSize: "2.5rem",
    color: "#fff",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    marginBottom: "2rem",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.8rem 1.5rem",
    borderRadius: "25px",
    border: "3px solid #fff",
    width: "300px",
    fontSize: "1.1rem",
    outline: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    ":focus": {
      transform: "scale(1.02)",
      boxShadow: "0 6px 8px rgba(0,0,0,0.2)",
    },
  },
  addButton: {
    padding: "0.8rem 2rem",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#ff6b6b",
    color: "white",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    ":hover": {
      transform: "scale(1.05)",
      backgroundColor: "#ff5252",
      boxShadow: "0 6px 8px rgba(0,0,0,0.2)",
    },
  },
  list: {
    listStyle: "none",
    padding: "0",
    maxWidth: "500px",
    margin: "0 auto",
  },
  listItem: (index) => ({
    backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.3)",
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
  }),
  fruitText: {
    color: "#fff",
    fontSize: "1.2rem",
    textTransform: "capitalize",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  },
  emoji: {
    fontSize: "1.5rem",
  },
};

export default App;