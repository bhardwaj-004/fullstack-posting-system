import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [topic, setTopic] = useState("");
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !data) {
      alert("Both fields required");
      return;
    }
    const res = await fetch("http://localhost:3002/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, data })
    });
    if (res.ok) navigate("/posts");
    else alert("Error creating post");
  };

  return (
    <div className="card">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <textarea
          placeholder="Data"
          value={data}
          onChange={e => setData(e.target.value)}
          rows={5}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
