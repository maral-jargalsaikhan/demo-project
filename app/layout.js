"use client";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body className="flex w-full gap-5 bg-neutral-100 pr-5">
          <Sidebar />
          <div className="min-h-[500px] w-full">
            <Header />
            <main className="p-5 min-h-[650px] bg-white rounded-lg">
              {children}
            </main>
          </div>
        </body>
      </AuthContextProvider>
    </html>
  );
}
