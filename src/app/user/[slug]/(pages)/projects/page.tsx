"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BaseResponse } from "@/lib/interface";
import { useGlobalContext } from "@/context/global";

interface Project {
  id: number;
  user_id: number;
  name: string;
  date: string;
  pdf: string;
}

const ProjectList = () => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const { projects } = useGlobalContext();

  useEffect(() => {}, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formatted = formatDistanceToNow(date, {
      includeSeconds: true,
      locale: localeId,
      addSuffix: true,
    });

    return formatted[0].toUpperCase() + formatted.substring(1);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Project</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tdStyleBase}>No</th>
            <th style={tdStyleBase}>Nama Project</th>
            <th style={tdStyleBase}>Tanggal Dibuat</th>
            <th style={tdStyleBase}>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((list, index) => (
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
                {formatDate(list.date)}
              </td>
              <td
                style={hoveredRowIndex === index ? tdStyleHovered : tdStyleBase}
              >
                <a
                  href={list.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={viewButtonStyle}
                >
                  Lihat PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;

const containerStyle: CSSProperties = {
  // marginTop: "50px",
  padding: "5vw",
  paddingTop: "20vw",
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
  position: "relative", // Make header relative to position the button
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
  fontSize: "12px",
};

const tdStyleHovered: CSSProperties = {
  ...tdStyleBase,
  backgroundColor: "#f0f0f0",
};

const viewButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "5px 10px",
  backgroundColor: "#3498db",
  color: "white",
  textDecoration: "none",
  borderRadius: "4px",
  textAlign: "center",
};
