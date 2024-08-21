"use client";

import { useEffect } from "react";
import Navbar from "../(components)/navbar";
import Sidebar from "../(components)/sidebar";
import DocumentsList from "./(pages)/documents/page";
import DistrictList from "./(pages)/district/page";

interface Props {
  params: Params;
}

interface Params {
  slug: string;
  subSlug: string;
}

export default function Page({ params }: Props) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main>
        <Content slug={params.slug} subSlug={params.subSlug} />
      </main>
    </>
  );
}

function Content({ slug, subSlug }: { slug: string; subSlug: string }) {
  switch (slug) {
    case "dashboard":
      return <SubDashboard slug={subSlug} />;
    case "projects":
      return <></>;
    case "contact":
      return <></>;
    default:
      return <div>Page not found</div>;
  }
}

function SubDashboard({ slug }: { slug: string }) {
  switch (slug) {
    case "district":
      return <DistrictList />;
    case "documents":
      return <DocumentsList />;
  }
}
