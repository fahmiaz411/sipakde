"use client";
import { useGlobalContext } from "@/context/global";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import styles from "./page.module.css";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { AuthLogin } from "@/middleware/auth";

interface Response<T> {
  code: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "admin" | "user";
  password: string;
}

export default function Page() {
  const { innerWidth } = useGlobalContext();

  return (
    <AuthLogin>
      <main
        style={{
          backgroundColor: "#ddd",
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoginCard w={innerWidth}>
          <Logo />
          <Form />
        </LoginCard>
        {innerWidth > 768 && <Banner />}
      </main>
    </AuthLogin>
  );
}

function LoginCard({ w, children }: { w: number; children?: React.ReactNode }) {
  return (
    <div // container
      style={{
        backgroundColor: "white",
        flex: 1,
        height: "100%",
        boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.2)",
        display: "flex",
      }}
    >
      <div // login form
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div // logo
      className={styles.logo}
    />
  );
}

interface LoginMessage {
  color?: string;
  message?: string;
}

function Form() {
  const router = useRouter(); // useRouter hook from next/router

  const { setIsLogin, setUserData } = useGlobalContext();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginMesage, setLoginMesage] = useState<LoginMessage>({});

  const handleLogin = async () => {
    try {
      setLoginMesage({
        color: "green",
        message: "Sedang memverifikasi ...",
      });
      if (!usernameOrEmail || !password) {
        setLoginMesage({
          message: "Username or password cannot be empty.",
          color: "red",
        });
        return;
      }

      const res = await fetch(`/api/users?username_email=${usernameOrEmail}`);
      if (res.status >= 400) {
        setLoginMesage({
          message: "Username or password is incorrect.",
          color: "red",
        });
        return;
      }

      const json: Response<User> = await res.json();
      const user = json.data;

      // validate password
      const valid = await checkPassword(password, user.password);
      if (!valid) {
        setLoginMesage({
          message: "Username or password is incorrect.",
          color: "red",
        });
        return;
      }

      setLoginMesage({
        color: "green",
        message: "Berhasil masuk, sedang mengalihkan ...",
      });

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("userData", JSON.stringify(user));

      setIsLogin(true);
      setUserData(user);

      // route
      redirectRole(user.role);
    } catch (error) {
      console.error(error);
      setLoginMesage({
        message: "Terjadi kesalahan",
        color: "red",
      });
    }
  };

  const redirectRole = (role?: string) => {
    switch (role) {
      case "admin":
        return router.push("/admin/dashboard");
      case "user":
        return router.push("/user/dashboard");
      default:
        alert("Terjadi kesalahan");
        return router.push("/logout");
    }
  };

  useEffect(() => {
    if (loginMesage.color && loginMesage.color !== "green") {
      const t = setTimeout(() => {
        setLoginMesage({
          color: "",
          message: "",
        });
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [loginMesage]);

  return (
    <form
      action={handleLogin}
      style={{
        //   backgroundColor: "red",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {loginMesage.message && (
        <h2
          style={{
            color: loginMesage.color,
            fontWeight: "bold",
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          {loginMesage.message}
        </h2>
      )}
      <input // username or email
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        value={usernameOrEmail}
        style={{
          textAlign: "center",
          margin: "10px 0",
          width: "80%",
          height: 30,
          padding: 5,
        }}
        type="text"
        placeholder="Masukkan username atau email"
      />
      <input // password
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        style={{
          textAlign: "center",
          margin: "10px 0",
          width: "80%",
          height: 30,
          padding: 5,
        }}
        type="password"
        placeholder="Masukkan password"
      />
      <button // login button
        style={{
          margin: "10px 0",
          padding: "10px 50px",
          backgroundColor: "green",
          border: 0,
          color: "white",
          borderRadius: 5,
        }}
        type="submit"
      >
        Login Akun
      </button>
    </form>
  );
}

function Banner() {
  return (
    <div // banner
      style={{
        flex: 2,
        height: "100%",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}

const checkPassword = async (password: string, hashedPassword: string) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};
