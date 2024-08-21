"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { FaFilePdf, FaPlus } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter for navigation
import { BaseResponse } from "@/lib/interface";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useGlobalContext } from "@/context/global";

interface PdfFile {
  status: "pending" | "onview" | "approved" | "rejected";
  name: string;
  type: "rab" | "take-of-sheet" | "tpk" | "berita-acara";
  project: string;
  date: string;
  from: string;
  url: string;
}

const mappingStatusText = {
  pending: "Menunggu Persetujuan",
  onview: "Sedang Ditinjau",
  approved: "Disetujui",
  rejected: "Ditolak",
};

interface Document {
  id: number;
  status: "pending" | "onview" | "approved" | "rejected";
  user_id: number;
  name: string;
  description: string;
  type: "rab" | "take-of-sheet" | "tpk" | "berita-acara";
  project_id: number;
  project_name: string;
  date: string;
  sender_id: number;
  sender: string;
  pdf: string;
}

const DocumentsList = () => {
  const router = useRouter(); // Initialize router
  const searchParams = useSearchParams();
  const { userData } = useGlobalContext();

  // State to track hover
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [lists, setLists] = useState<Document[]>([]);

  const handleRowClick = (pdf: Document) => {
    const query = new URLSearchParams({
      id: String(pdf.id),
      status: pdf.status,
      title: pdf.name,
      project_id: String(pdf.project_id),
      project: pdf.project_name,
      date: pdf.date,
      author: pdf.sender,
      link: pdf.pdf,
      description: pdf.description || "",
    }).toString();

    router.push(`/user/viewpdf?${query}`);
  };

  const handleAddProjectClick = () => {
    let url = "/user/new-documents";
    const type = searchParams.get("type");
    if (type) {
      url += `?type=${type}`;
    }
    router.push(url); // Navigate to the new page
  };

  useEffect(() => {
    const filter = searchParams.get("filter");
    const type = searchParams.get("type");

    const fetchData = async () => {
      try {
        const query = new URLSearchParams();

        if (filter) {
          query.append("filter", filter);
        }

        if (type) {
          query.append("type", type);
        }

        query.append("user", String(userData?.id));

        const res = await fetch(`/api/documents?${query.toString()}`);
        if (res.status >= 400) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        const json: BaseResponse<Document[]> = await res.json();
        const documents = json.data;
        setLists(documents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Dokumen</h1>
      <div
        style={addButtonStyle}
        onClick={handleAddProjectClick}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <FaPlus size={20} color="#2c3e50" />
      </div>
      <table style={tableStyle}>
        <tbody>
          {lists.length ? (
            lists.map((pdf, index) => (
              <tr
                key={index}
                onMouseEnter={() => setHoveredRowIndex(index)}
                onMouseLeave={() => setHoveredRowIndex(null)}
                onClick={() => handleRowClick(pdf)} // Add onClick handler
              >
                <td
                  style={
                    hoveredRowIndex === index ? tdStyleHovered : tdStyleBase
                  }
                >
                  <div
                    style={{
                      ...tdItemStyle,
                      ...tdStatus,
                      backgroundColor: statusColor(pdf.status),
                    }}
                  >
                    {mappingStatusText[pdf.status]}
                  </div>
                  <div // details
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "10px 0px",
                    }}
                  >
                    <div>
                      <div style={{ ...tdItemStyle, ...tdName }}>
                        {pdf.project_name + " - " + pdf.name}
                      </div>
                      <div style={{ ...tdItemStyle, ...tdDate }}>
                        {formatDate(pdf.date)}
                      </div>
                      <div style={{ ...tdItemStyle, ...tdFrom }}>
                        {pdf.sender}
                      </div>
                    </div>
                    <FaFilePdf color="red" size={50} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyleBase}>Belum ada dokumen</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
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

export default DocumentsList;

function statusColor(status: string): string {
  switch (status) {
    case "pending":
      return "#e74c3c";
    case "onview":
      return "#009bda";
    case "approved":
      return "#2ecc71";
    case "rejected":
      return "#e67e22";
    default:
      return "#3498db";
  }
}

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
  transition: "background-color 0.3s ease", // Smooth transition
  cursor: "pointer", // Make the cursor a pointer to indicate clickable
};

const tdStyleHovered: CSSProperties = {
  ...tdStyleBase,
  backgroundColor: "#f0f0f0", // Light gray for hover
};

const tdItemStyle: CSSProperties = {
  margin: "5px 0px",
};

const tdStatus: CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
  textAlign: "center",
  padding: "5px",
  color: "white",
  marginBottom: "20px",
  borderRadius: 5,
};

const tdName: CSSProperties = {
  fontSize: "16px",
};

const tdDate: CSSProperties = {
  fontSize: "12px",
};

const tdFrom: CSSProperties = {
  fontSize: "12px",
  fontStyle: "italic",
};

const buttonStyle: CSSProperties = {
  backgroundColor: "#3498db",
  color: "#ffffff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "background-color 0.3s ease",
  display: "inline-block",
  margin: "5px 0px",
  fontSize: "14px",
};
