"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BaseResponse } from "@/lib/interface";

interface District {
  id: number;
  name: string;
  documents: number;
}

const DistrictList = () => {
  const router = useRouter();

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const lists = [
    { name: "Kel. Puspanegara", documents: 1 },
    { name: "Kel. Puspasari", documents: 1 },
    { name: "Kel. Ciriung", documents: 1 },
  ];

  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/districts`);
        if (res.status >= 400) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        const json: BaseResponse<District[]> = await res.json();
        const districts = json.data;
        setDistricts(districts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Desa</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tdStyleBase}>No</th>
            <th style={tdStyleBase}>Nama Desa</th>
            <th style={tdStyleBase}>Total Dokumen</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((list, index) => (
            <tr
              key={index}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              <td
                style={hoveredRowIndex === index ? tdStyleHovered : tdStyleBase}
              >
                {index + 1}
              </td>
              <td
                style={hoveredRowIndex === index ? tdStyleHovered : tdStyleBase}
              >
                {list.name}
              </td>
              <td
                style={hoveredRowIndex === index ? tdStyleHovered : tdStyleBase}
              >
                {list.documents}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistrictList;

const containerStyle: CSSProperties = {
  marginTop: "50px",
  padding: "5vw",
  backgroundColor: "#f4f6f9",
  minHeight: "100vh",
  width: "100vw",
  fontFamily: "sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle: CSSProperties = {
  fontSize: "32px",
  marginBottom: "30px",
  color: "#34495e",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const tdStyleBase: CSSProperties = {
  verticalAlign: "top",
  backgroundColor: "#ffffff",
  color: "#2c3e50",
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
};

const tdStyleHovered: CSSProperties = {
  ...tdStyleBase,
  backgroundColor: "#f0f0f0",
};
