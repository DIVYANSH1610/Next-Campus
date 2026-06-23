"use client";

import { useState } from "react";

export default function PredictPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [result, setResult] = useState<any>(null);

  const handlePredict = async () => {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exam, rank: Number(rank) }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">College Predictor</h1>

      <input
        placeholder="Exam (JEE, NEET)"
        value={exam}
        onChange={(e) => setExam(e.target.value)}
        className="border p-2 m-2"
      />

      <input
        placeholder="Rank"
        value={rank}
        onChange={(e) => setRank(e.target.value)}
        className="border p-2 m-2"
      />

      <button
        onClick={handlePredict}
        className="bg-blue-500 text-white p-2"
      >
        Predict
      </button>

      {result && (
        <div>
          <h2>Results: {result.total}</h2>

          {result.colleges.map((c: any) => (
            <div key={c.id} className="border p-2 m-2">
              {c.name} - {c.city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}