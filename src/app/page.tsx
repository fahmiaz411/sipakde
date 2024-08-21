"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const checkLogin = (): [boolean, string] => {
    return [false, "user"];
  };

  useEffect(() => {
    const [isLoggedIn, role] = checkLogin();
    if (!isLoggedIn) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          console.log("users: ", data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });

      router.push("/login");
    } else {
      switch (role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "user":
          router.push("/user/dashboard");
          break;
        default:
          router.push("/logout");
          break;
      }
    }
  }, []);

  return <main>Redirecting ...</main>;
}
