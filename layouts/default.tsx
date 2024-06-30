
import { Head } from "./head";

import { Navbar } from "@/components/MainPageComponent/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
     <main className="container mx-auto max-w-full px-3 flex-grow pt-8 ">
  {children}
</main>
      <footer className="w-full flex items-center justify-center py-3" />
    </div>
  );
}
