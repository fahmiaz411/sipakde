"use client";
import { useGlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUser, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { setIsLogin, userData, setUserData, toastDevelopment } =
    useGlobalContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownItemClick = (action: string) => {
    switch (action) {
      case "logout":
        setIsLogin(false);
        setUserData(null);

        localStorage.removeItem("isLogin");
        localStorage.removeItem("userData");

        return router.push("/login");
    }
    setDropdownOpen(false);
  };

  return (
    <>
      <nav style={navbarStyle}>
        <div style={logoStyle} onClick={() => router.push("/admin/dashboard")}>
          <img src="/sipakde_colored.png" width={100} alt="" />
        </div>
        <div style={navItemsStyle}>
          <div style={{ margin: "0 10px" }}>{userData?.name}</div>
          <div style={userConfigStyle} onClick={toastDevelopment}>
            <div style={userIconStyle}>
              <FaBell size={20} color="#fff" />
              <MdArrowDropDown size={24} color="#fff" />
            </div>
          </div>
          <div style={userConfigStyle}>
            <div style={userIconStyle} onClick={handleDropdownToggle}>
              <FaUser size={20} color="#fff" />
              <MdArrowDropDown size={24} color="#fff" />
            </div>
            {dropdownOpen && (
              <div style={dropdownMenuStyle}>
                <div
                  style={dropdownItemStyle}
                  onClick={() => handleDropdownItemClick("settings")}
                >
                  <FaCog size={18} color="#333" />
                  <span style={dropdownTextStyle}>Settings</span>
                </div>
                <div
                  style={dropdownItemStyle}
                  onClick={() => handleDropdownItemClick("logout")}
                >
                  <FaSignOutAlt size={18} color="#333" />
                  <span style={dropdownTextStyle}>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

// Styles
const navbarStyle: React.CSSProperties = {
  top: 0,
  zIndex: 1,
  position: "fixed",
  width: "100vw",
  height: 50,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#2c3e50",
  color: "#fff",
};

const logoStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "skyblue",
};

const navItemsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontSize: 12,
};

const navItemStyle: React.CSSProperties = {
  margin: "0 10px",
  textDecoration: "none",
  color: "#fff",
};

const userConfigStyle: React.CSSProperties = {
  position: "relative",
};

const userIconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
};

const dropdownMenuStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "#fff",
  color: "#333",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  width: "150px",
  zIndex: 1000,
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};

const dropdownTextStyle: React.CSSProperties = {
  marginLeft: "10px",
};

export default Navbar;
