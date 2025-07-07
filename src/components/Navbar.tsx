"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/images/oc_logo-rbg.png";
import Link from "next/link";

import { FaBars, FaTimes } from "react-icons/fa";

// Types
interface NavItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Navigation configuration
  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Schedule",
      href: "/schedule",
    },
    {
      label: "Gallery",
      href: "/gallery",
    },
  ];

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 h-20">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-600">
          {navItems.map((item: NavItem, index: number) => (
            <li key={index}>
              <Link href={item.href} className="hover:text-gray-800 transition">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 overflow-hidden"
        }`}
        style={{
          maxHeight: isMenuOpen ? "200px" : "0px",
        }}
        role="menu"
        aria-label="Mobile navigation menu"
      >
        <ul className="px-4 py-2 space-y-2">
          {navItems.map((item: NavItem, index: number) => (
            <li key={index}>
              <Link
                href={item.href}
                className="block py-2 text-gray-600 hover:text-gray-800 transition"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
