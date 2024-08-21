"use client";

import FullPageLoading from "@/components/loading/loading";
import { useGlobalContext } from "@/context/global";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthLogin({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // useRouter hook from next/router

  const { contextLoading, isLogin, userData } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);

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
    if (!contextLoading) {
      console.log("auth", isLogin);
      if (isLogin) {
        return redirectRole(userData?.role);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [contextLoading]);

  console.log(contextLoading, isLoading);

  return contextLoading || isLoading ? <FullPageLoading /> : <>{children}</>;
}

export function AuthRole({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const router = useRouter(); // useRouter hook from next/router

  const { contextLoading, isLogin, userData } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    if (!contextLoading) {
      if (!isLogin) {
        return router.push("/login");
      }

      if (userData?.role != role) {
        return setIsForbidden(true);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [contextLoading]);

  if (isForbidden) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: 16,
          }}
        >
          401 | Kamu tidak memiliki akses
        </h1>
      </div>
    );
  }

  return contextLoading ? <FullPageLoading /> : <>{children}</>;
}
