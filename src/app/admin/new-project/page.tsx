"use client";
import React, { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowLeft } from "react-icons/fa"; // Import the arrow-left icon
import Navbar from "../[slug]/(components)/navbar";
import { useGlobalContext } from "@/context/global";

const AddProject = () => {
  const router = useRouter();

  const { userData } = useGlobalContext();
  const [projectName, setProjectName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleAddProject = async () => {
    if (!projectName || !pdfFile) {
      alert("Please fill out all fields and upload a PDF file.");
      return;
    }

    const form = new FormData();

    form.append("user_id", String(userData?.id));
    form.append("name", projectName);
    form.append("pdf", pdfFile);

    const res = await fetch("/api/projects", {
      method: "POST",
      body: form,
    });

    const result = await res.json();
    if (res.ok) {
      console.log(`Upload successful: ${result.fileName}`);
    } else {
      console.error(`Upload failed: ${result.error}`);
    }

    // Redirect to the project list page
    router.push("/admin/projects");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPdfFile(event.target.files[0]);
    }
  };

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  const validateAllFields = (): boolean => {
    if (!projectName || !pdfFile) {
      return false;
    }
    return true;
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <button onClick={handleBack} style={backButtonStyle}>
        <FaArrowLeft size={20} color="#2c3e50" />
      </button>
      <h1 style={headerStyle}>Project Baru</h1>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project Name"
        style={projectName ? { ...inputStyle, ...filledStyle } : inputStyle}
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={pdfFile ? { ...inputStyle, ...filledStyle } : inputStyle}
      />
      <button
        onClick={handleAddProject}
        style={
          validateAllFields() ? { ...buttonStyle, ...filledStyle } : buttonStyle
        }
      >
        Tambah Project
      </button>
    </div>
  );
};

export default AddProject;

const filledStyle: CSSProperties = {
  backgroundColor: "green",
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
  position: "relative",
};

const inputStyle: CSSProperties = {
  marginBottom: "20px",
  padding: "10px",
  width: "100%",
  maxWidth: "600px",
  border: "1px solid #ddd",
  borderRadius: "5px",
};

const buttonStyle: CSSProperties = {
  color: "#ffffff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "background-color 0.3s ease",
  display: "inline-block",
  fontSize: "16px",
};

const backButtonStyle: CSSProperties = {
  position: "absolute",
  top: "70px",
  left: "20px",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "transparent",
};
