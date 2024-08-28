// context/global.tsx
"use client";
import { BaseResponse } from "@/lib/interface";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface GlobalContextProps {
  contextLoading: boolean;

  projects: Project[];
  setProjects: (key: Project[]) => void;

  isLogin: boolean;
  setIsLogin: (key: boolean) => void;

  userData: UserData | null;
  setUserData: (key: UserData | null) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;

  openMenus: { [key: string]: boolean };
  toggleMenu: (menuKey: string) => void;

  innerWidth: number;
  setInnerWidth: (width: number) => void;
  // Add other global state variables and functions here

  toastDevelopment: () => void;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "admin" | "user";
  password: string;
}

interface Project {
  id: number;
  user_id: number;
  name: string;
  date: string;
  pdf: string;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [contextLoading, setContextLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);

  const [innerWidth, setInnerWidth] = useState<number>(0);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const toastDevelopment = () => {
    alert("Fitur ini masih dalam tahap pengembangan");
  };

  useEffect(() => {
    // check login
    const storageIsLogin = localStorage.getItem("isLogin");
    setIsLogin(Boolean(storageIsLogin));
    const storageUserData = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );
    setUserData(storageUserData);

    // set window
    setInnerWidth(window.innerWidth);
    const handleResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // set context loading
    setContextLoading(false);

    fetchProjects(setProjects);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        projects,
        setProjects,
        contextLoading,
        isLogin,
        setIsLogin,
        userData,
        setUserData,
        sidebarOpen,
        toggleSidebar,
        openMenus,
        toggleMenu,
        innerWidth,
        setInnerWidth,
        toastDevelopment,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const fetchProjects = async (setProject: (key: Project[]) => void) => {
  try {
    const res = await fetch(`/api/projects`);
    if (res.status >= 400) {
      console.error("Error fetching user data:", res.status);
      return;
    }

    const json: BaseResponse<Project[]> = await res.json();
    const projects = json.data;
    setProject(projects);
  } catch (error) {
    console.error(error);
  }
};
