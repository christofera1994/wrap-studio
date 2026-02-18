import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  const links = [
    { href: "#services", label: "Usluge" },
    { href: "#gallery", label: "Galerija" },
    { href: "#faq", label: "Pitanja" },
    { href: "#contact", label: "Kontakt" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md py-4 shadow-lg border-b border-primary/20" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <Car className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl font-bold font-display uppercase tracking-widest text-white group-hover:text-primary transition-colors">
            Wrap<span className="text-primary">Studio</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/80 hover:text-primary font-display uppercase tracking-wider text-sm font-medium transition-colors hover:text-glow"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="px-6 py-2 bg-primary text-white font-display font-bold uppercase tracking-wider text-sm rounded hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(213,0,0,0.5)] hover:shadow-[0_0_25px_rgba(213,0,0,0.8)]"
          >
            Zakaži Termin
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-primary transition-colors"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xl font-display uppercase text-white hover:text-primary transition-colors text-center py-2"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
