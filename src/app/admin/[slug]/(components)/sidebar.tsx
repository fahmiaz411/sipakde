// components/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaPhoneAlt, FaProjectDiagram } from "react-icons/fa";
import { FaAngleRight, FaAngleDown, FaAngleLeft } from "react-icons/fa6";
import { CSSProperties, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/global";

const Sidebar = () => {
  const pathname = usePathname();
  const { openMenus, toggleMenu } = useGlobalContext();
  const { sidebarOpen, toggleSidebar } = useGlobalContext();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaHome size={20} color="white" style={{ margin: "0 10px" }} />,
      path: "/admin/dashboard",
      subItems: [
        { label: "Kelurahan", path: "/district" },
        { label: "Dokumen", path: "/documents" },
      ],
    },
    {
      label: "My Projects",
      icon: (
        <FaProjectDiagram
          size={20}
          color="white"
          style={{ margin: "0 10px" }}
        />
      ),
      path: "/admin/projects",
    },
  ];

  const sidebarStyle: CSSProperties = {
    zIndex: 1,
    overflow: "hidden",
    boxSizing: "border-box",
    width: "250px",
    padding: "20px",
    backgroundColor: "#2c3e50",
    minHeight: "100vh",
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    position: "fixed" as const,
    top: 50,
    left: sidebarOpen ? 0 : "-250px", // Slide in and out
    transition: "left 0.3s ease", // Animation
  };

  const linkStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    color: "#ecf0f1",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease, transform 0.3s ease", // Hover animation
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#34495e",
    fontWeight: "bold",
  };

  const nestedLinkStyle: CSSProperties = {
    marginLeft: 40,
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    color: "#ecf0f1",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease, transform 0.3s ease", // Hover animation
  };

  const hoverStyle: CSSProperties = {
    backgroundColor: "#34495e",
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          boxSizing: "border-box",
          left: sidebarOpen ? "240px" : "-10px",
          top: "70px",
          zIndex: 1000,
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "5px",
          transition: "left 0.3s ease", // Sync button movement with sidebar
        }}
      >
        {sidebarOpen ? (
          <FaAngleLeft size={20} color="white" />
        ) : (
          <FaAngleRight size={20} color="white" />
        )}
      </button>

      <div style={sidebarStyle}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {menuItems.map((item, index) => {
            return (
              <li key={index}>
                {item.subItems ? (
                  <>
                    <Link
                      href={item.path}
                      style={
                        pathname.includes(item.path)
                          ? activeLinkStyle
                          : linkStyle
                      }
                      onClick={() => toggleMenu(item.label)}
                      className="cursor-pointer"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3d566e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          pathname.includes(item.path) ? "#34495e" : "")
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {openMenus[item.label] ? (
                        <FaAngleDown
                          size={20}
                          color="white"
                          style={{ marginLeft: "auto" }}
                        />
                      ) : (
                        <FaAngleRight
                          size={20}
                          color="white"
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </Link>
                    <ul
                      style={{
                        height: openMenus[item.label]
                          ? 38 * item.subItems.length
                          : 0,
                        overflow: "hidden",
                        listStyleType: "none",
                        padding: 0,
                        transition: "ease-in 300ms",
                      }}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={item.path + subItem.path}
                            style={
                              pathname === item.path + subItem.path
                                ? { ...nestedLinkStyle, ...hoverStyle }
                                : nestedLinkStyle
                            }
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#3d566e")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                pathname === item.path + subItem.path
                                  ? "#34495e"
                                  : "")
                            }
                          >
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    style={pathname === item.path ? activeLinkStyle : linkStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3d566e")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        pathname === item.path ? "#34495e" : "")
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
