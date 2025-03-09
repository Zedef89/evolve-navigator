
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, BarChart, LineChart, Plus, CalendarDays, Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/contexts/AssessmentContext";
import { AnimatePresence, motion } from "framer-motion";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { startNewAssessment, exportData } = useAssessment();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewAssessment = () => {
    startNewAssessment();
    navigate("/assessment");
    setMenuOpen(false);
  };

  const handleExport = () => {
    exportData();
    setMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isHomePage = location.pathname === "/";
  const showBackButton = !isHomePage;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-lg transition-all duration-300 
          ${scrolled ? "bg-white/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="focus-ring"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="text-xl font-medium">Growth</div>
          )}

          <div className="hidden md:flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate("/")}
              className={`focus-ring ${location.pathname === "/" ? "bg-secondary" : ""}`}
            >
              <BarChart className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate("/history")}
              className={`focus-ring ${location.pathname.includes("/history") ? "bg-secondary" : ""}`}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate("/trends")}
              className={`focus-ring ${location.pathname.includes("/trends") ? "bg-secondary" : ""}`}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Trends
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleNewAssessment}
              size="sm"
              className="focus-ring"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMenuOpen(true)}
              className="md:hidden focus-ring"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start focus-ring"
                  onClick={() => handleNavigate("/")}
                >
                  <BarChart className="w-5 h-5 mr-3" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start focus-ring"
                  onClick={() => handleNavigate("/history")}
                >
                  <CalendarDays className="w-5 h-5 mr-3" />
                  History
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start focus-ring"
                  onClick={() => handleNavigate("/trends")}
                >
                  <LineChart className="w-5 h-5 mr-3" />
                  Trends
                </Button>
                <hr className="my-4" />
                <Button
                  variant="outline"
                  className="w-full justify-start focus-ring"
                  onClick={handleExport}
                >
                  <Download className="w-5 h-5 mr-3" />
                  Export Data
                </Button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16"></div> {/* Spacer for fixed header */}
    </>
  );
};

export default NavBar;
