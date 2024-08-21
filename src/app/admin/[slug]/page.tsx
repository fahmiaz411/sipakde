"use client";

import { useEffect } from "react";
import Navbar from "./(components)/navbar";
import Sidebar from "./(components)/sidebar";
import Dashboard from "./(pages)/dashboard/page";
import ProjectList from "./(pages)/projects/page";

interface Props {
  params: Params;
}

interface Params {
  slug: string;
}

export default function Page({ params }: Props) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main>
        <Content slug={params.slug} />
      </main>
    </>
  );
}

function Content({ slug }: { slug: string }) {
  switch (slug) {
    case "dashboard":
      return <Dashboard />;
    case "projects":
      return <ProjectList />;
    default:
      return <div>Page not found</div>;
  }
}
