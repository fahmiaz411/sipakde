"use client";
import { useGlobalContext } from "@/context/global";
import { BaseResponse } from "@/lib/interface";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Dashboard {
  projects: number;
  documents: number;
  documents_pending: number;
}

const Dashboard = () => {
  const router = useRouter();
  const { userData, innerWidth } = useGlobalContext();
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);

  // Example data
  const stats = [
    {
      label: "Project",
      value: dashboardData?.projects,
      color: "#4db6ac",
      path: "/user/projects",
    },
    {
      label: "Total Dokumen",
      value: dashboardData?.documents,
      color: "#ffca28",
      path: "/user/documents",
    },
    {
      label: "Dokumen Pending",
      value: dashboardData?.documents_pending,
      color: "#e57373",
      path: "/user/documents?filter=pending",
    },
  ];

  const handleOnClick = (route: string) => {
    router.push(route);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard/user?id=${userData?.id}`);
        if (res.status >= 400) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        const json: BaseResponse<Dashboard> = await res.json();
        const dashboard = json.data;
        setDashboardData(dashboard);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={dashboardContainerStyle}>
      <h1
        style={
          innerWidth > 768
            ? headerStyle
            : { ...headerStyle, textAlign: "center" }
        }
      >
        Halaman Dashboard
      </h1>
      <div style={statsGridStyle}>
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleOnClick(stat.path)}
            style={{
              ...statCardStyle,
              height: 200,
              backgroundColor: stat.color,
              ...statCardHoverStyle,
            }}
          >
            <div style={statValueStyle}>{stat.value}</div>
            <div style={statLabelStyle}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

const dashboardContainerStyle: React.CSSProperties = {
  marginTop: 50,
  padding: "5vw",
  // backgroundColor: "#e3f2fd", // Light blue background
  minHeight: "100vh",
  width: "100vw",
  fontFamily: "sans-serif",
};

const headerStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "30px",
  color: "#333",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "50px",
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

const statValueStyle: React.CSSProperties = {
  color: "#fff",
  fontSize: "52px",
  fontWeight: "700",
  marginBottom: "10px",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "22px",
  color: "#fff",
};

// Hover effect for stat cards
const statCardHoverStyle: React.CSSProperties = {
  transform: "scale(1.05)",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
};
