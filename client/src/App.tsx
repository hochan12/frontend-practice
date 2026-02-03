import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Frontend Practice 🚀</h1>
      <p>서버에서 받은 메시지:</p>
      <strong>{message}</strong>
    </div>
  );
}

export default App;