"use client";

import { useEffect, useState } from "react";

export default function SavedPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/saved/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setData(json);
    };

    fetchSaved();
  }, []);

  return (
    <div>
      <h1>Saved Colleges</h1>

      {data.map((item: any) => (
        <div key={item.id}>
          {item.college.name}
        </div>
      ))}
    </div>
  );
}