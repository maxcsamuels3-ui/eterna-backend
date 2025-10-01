import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setOutput(data.output ?? "No output");
    } catch {
      setOutput("Error calling /api/generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Eterna</h1>
      <form onSubmit={handleGenerate} style={{ width: "100%", maxWidth: 640, display: "grid", gap: 12 }}>
        <textarea
          rows={5}
          placeholder="Type something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", border: "1px solid #ccc", borderRadius: 8, padding: 12 }}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          style={{ padding: "10px 16px", borderRadius: 12, background: "#000", color: "#fff", opacity: loading || !prompt.trim() ? 0.6 : 1 }}
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </form>

      <div style={{ width: "100%", maxWidth: 640 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Output</h2>
        <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #eee", borderRadius: 8, padding: 12, minHeight: 80 }}>
          {output}
        </pre>
      </div>
    </main>
  );
}
