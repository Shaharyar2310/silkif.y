import { ReactNode, useState } from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";
import HistoryPanel from "./HistoryPanel";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Check if we're on the homepage
  const isHomePage = location === "/";
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`${isHomePage ? "flex flex-col" : "flex"} min-h-screen relative`}>
      {/* Header for all pages */}
      <Header />
      
      {/* Mobile header - only visible on small screens */}
      <div className="md:hidden">
        <MobileHeader isMenuOpen={mobileMenuOpen} toggleMenu={toggleMobileMenu} />
      </div>
      
      {/* Sidebar - only visible on non-home pages */}
      {!isHomePage && (
        <Sidebar />
      )}
      
      {/* Main content */}
      <main className={`flex-1 p-6 mt-16 ${!isHomePage ? "md:ml-60 lg:mr-60" : ""}`}>
        {children}
      </main>
      
      {/* History panel - only visible on non-home pages */}
      {!isHomePage && (
        <HistoryPanel />
      )}
    </div>
  );
}
