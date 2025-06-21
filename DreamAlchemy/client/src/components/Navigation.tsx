import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Store, 
  Sparkles, 
  Coins, 
  Settings, 
  Moon,
  Menu,
  X,
  Wallet,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleWalletConnect } from "@/components/SimpleWalletConnect";

const Navigation = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/journal", label: "Dream Journal", icon: BookOpen },
    { path: "/dashboard", label: "Sleep Dashboard", icon: BarChart3 },
    { path: "/marketplace", label: "NFT Marketplace", icon: Store },
    { path: "/interpreter", label: "AI Interpreter", icon: Sparkles },
    { path: "/mining", label: "Dream Mining", icon: Coins },
    { path: "/blockchain", label: "Blockchain", icon: Wallet },
    { path: "/rewards", label: "Claim Rewards", icon: Gift },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 glass-card text-white hover:bg-white/20"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 glass-card transform transition-transform duration-300 z-40 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] flex items-center justify-center">
              <Moon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Dream Protocol</h1>
          </div>
          
          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                      isActive ? "nav-active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Simple Wallet Connect */}
          <div className="mt-auto p-4 border-t border-white/10">
            <SimpleWalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
