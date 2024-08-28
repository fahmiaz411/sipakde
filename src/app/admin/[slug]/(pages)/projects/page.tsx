"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa"; // Import the plus icon
import { useGlobalContext } from "@/context/global";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

const ProjectList = () => {
  const router = useRouter();
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const { projects } = useGlobalContext();

  const lists = [
    { name: "Aplikasi", date: "Hari ini" },
    { name: "Perbaikan Jalan", date: "Hari ini" },
    { name: "Pembangunan Infrastruktur", date: "Hari ini" },
  ];

  useEffect(() => {}, []);

  const handleAddProjectClick = () => {
    router.push("/admin/new-project"); // Navigate to the new page
  };

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
      <div
        style={addButtonStyle}
        onClick={handleAddProjectClick}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <FaPlus size={20} color="#2c3e50" />
      </div>
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
  fontSize: "12px",
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

const addButtonStyle: CSSProperties = {
  alignSelf: "end",
  color: "#ffffff",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "opacity 0.3s ease",
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
