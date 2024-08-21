"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../(components)/navbar";
import { useGlobalContext } from "@/context/global";

const projects = [
  {
    id: 1,
    name: "Aplikasi SIPAKDe",
  },
  { id: 2, name: "Pembangunan" },
  {
    id: 3,
    name: "Infrastruktur",
  },
];

const documentTypes = [
  { type: "rab", name: "RAB" },
  { type: "take-of-sheet", name: "Take of Sheet" },
  { type: "tpk", name: "TPK" },
  { type: "berita-acara", name: "Berita Acara" },
];

const AddDocument = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [documentName, setDocumentName] = useState<string>("");
  const [documentDesc, setDocumentDesc] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>();
  const [project, setProject] = useState<number>(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const { projects, userData } = useGlobalContext();
  console.log(project);

  const handleAddDocument = async () => {
    try {
      if (!documentName || !documentType || !project || !pdfFile) {
        alert("Please fill out all fields and upload a PDF file.");
        return;
      }

      const form = new FormData();

      form.append("name", documentName);
      form.append("description", documentDesc);
      form.append("type", documentType);
      form.append("project_id", String(project));
      form.append("sender_id", String(userData?.id));
      form.append("pdf", pdfFile);

      const res = await fetch("/api/documents", {
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
      router.push("/user/documents");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      event.currentTarget.style.backgroundColor =
        filledStyle.backgroundColor || "";
      setPdfFile(event.target.files[0]);
    }
  };

  const validateAllFields = (): boolean => {
    if (!documentName || !project || !documentType || !pdfFile) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setDocumentType(searchParams.get("type") || "");
  }, []);

  return (
    <div style={containerStyle}>
      <Navbar />
      <h1 style={headerStyle}>Upload Dokumen</h1>
      <input
        type="text"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        placeholder="Nama Dokumen"
        style={documentName ? { ...inputStyle, ...filledStyle } : inputStyle}
      />
      <textarea
        value={documentDesc}
        onChange={(e) => setDocumentDesc(e.target.value)}
        placeholder="Deskripsi"
        style={
          documentDesc
            ? { ...inputStyle, ...filledStyle, height: 200 }
            : { ...inputStyle, height: 200 }
        }
      />
      <select
        value={project}
        onChange={(e) => setProject(parseInt(e.target.value))}
        style={project ? { ...inputStyle, ...filledStyle } : inputStyle}
      >
        <option value="">Pilih Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={documentType ? { ...inputStyle, ...filledStyle } : inputStyle}
      >
        <option value="">Pilih Tipe Dokumen</option>
        {documentTypes.map((type) => (
          <option key={type.type} value={type.type}>
            {type.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={inputStyle}
      />
      <button
        onClick={handleAddDocument}
        style={
          validateAllFields() ? { ...buttonStyle, ...filledStyle } : buttonStyle
        }
      >
        Kirim
      </button>
    </div>
  );
};

export default AddDocument;

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
  color: "white",
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
