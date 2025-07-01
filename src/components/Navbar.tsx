"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/images/oc_logo-rbg.png";
import Link from "next/link";

import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

// Types
interface DropdownItem {
  label: string;
  href: string;
}

interface Dropdown {
  items: DropdownItem[];
}

interface NavItem {
  label: string;
  href: string; // Changed from string | null to string
  dropdown: Dropdown | null;
}

interface DropdownsState {
  [key: string]: boolean;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openDropdowns, setOpenDropdowns] = useState<DropdownsState>({});
  const navRef = useRef<HTMLElement>(null);

  // Generate years from 2023 to current year (memoized)
  const galleryItems = useMemo(() => {
    const currentYear: number = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2023; year <= currentYear; year++) {
      years.push(year);
    }
    return [...years].reverse().map(
      (year: number): DropdownItem => ({
        label: year.toString(),
        href: `/gallery/${year}`,
      })
    );
  }, []);

  // Navigation configuration (memoized)
  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        dropdown: null,
      },
      {
        label: "Schedule",
        href: "/schedule", // Empty string instead of null
        dropdown: null,
      },
      {
        label: "Gallery",
        href: "", // Empty string instead of null
        dropdown: {
          items: galleryItems,
        },
      },
    ],
    [galleryItems]
  );

  // Click outside handler for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    // Close all dropdowns when mobile menu closes
    if (isMenuOpen) {
      setOpenDropdowns({});
    }
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
    setOpenDropdowns({});
  };

  const toggleDropdown = (itemLabel: string): void => {
    setOpenDropdowns((prev: DropdownsState) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  const closeDropdown = (itemLabel: string): void => {
    setOpenDropdowns((prev: DropdownsState) => ({
      ...prev,
      [itemLabel]: false,
    }));
  };

  const closeAllDropdowns = (): void => {
    setOpenDropdowns({});
  };

  const isDropdownOpen = (itemLabel: string): boolean => {
    return openDropdowns[itemLabel] || false;
  };

  // Calculate dynamic height for mobile dropdowns
  const getMobileDropdownHeight = (itemCount: number): string => {
    const itemHeight = 32; // Approximate height per item in pixels
    const padding = 16; // Top and bottom padding
    return `${itemCount * itemHeight + padding}px`;
  };

  // Desktop Navigation Item Component
  const DesktopNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    if (!item.dropdown) {
      // Simple link - only render if href is not empty
      if (!item.href) {
        return null;
      }
      return (
        <li>
          <Link href={item.href} className="hover:text-gray-800 transition">
            {item.label}
          </Link>
        </li>
      );
    }

    // Dropdown item
    return (
      <li className="relative group">
        <button
          className="flex items-center space-x-1 hover:text-gray-800 transition"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span>{item.label}</span>
          <FaChevronDown
            className="transition-transform duration-200 group-hover:rotate-180"
            size={12}
            aria-hidden="true"
          />
        </button>

        {/* Desktop Dropdown - Hover Based */}
        <div
          className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border opacity-0 invisible transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50"
          style={{ minWidth: "120px" }}
          role="menu"
          aria-label={`${item.label} menu`}
        >
          <ul className="py-2">
            {item.dropdown.items.map(
              (dropdownItem: DropdownItem, index: number) => (
                <li key={index} role="none">
                  <Link
                    href={dropdownItem.href}
                    className="block px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition"
                    role="menuitem"
                  >
                    {dropdownItem.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </li>
    );
  };

  // Mobile Navigation Item Component
  const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    if (!item.dropdown) {
      // Simple link - only render if href is not empty
      if (!item.href) {
        return null;
      }
      return (
        <li>
          <Link
            href={item.href}
            className="block py-2 text-gray-600 hover:text-gray-800 transition"
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        </li>
      );
    }

    // Dropdown item
    const dropdownHeight = getMobileDropdownHeight(item.dropdown.items.length);

    return (
      <li>
        <button
          className="flex items-center justify-between w-full py-2 text-gray-600 hover:text-gray-800 transition"
          onClick={() => toggleDropdown(item.label)}
          aria-expanded={isDropdownOpen(item.label)}
          aria-haspopup="true"
        >
          <span>{item.label}</span>
          <FaChevronDown
            className={`transition-transform duration-200 ${
              isDropdownOpen(item.label) ? "rotate-180" : ""
            }`}
            size={12}
            aria-hidden="true"
          />
        </button>

        {/* Mobile Submenu */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isDropdownOpen(item.label) ? "opacity-100" : "opacity-0"
          }`}
          style={{
            maxHeight: isDropdownOpen(item.label) ? dropdownHeight : "0px",
          }}
          role="menu"
          aria-label={`${item.label} menu`}
        >
          <ul className="ml-4 space-y-1">
            {item.dropdown.items.map(
              (dropdownItem: DropdownItem, index: number) => (
                <li key={index} role="none">
                  <Link
                    href={dropdownItem.href}
                    className="block py-1 text-sm text-gray-500 hover:text-gray-700 transition"
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    {dropdownItem.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50" ref={navRef}>
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 h-20">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-600">
          {navItems.map((item: NavItem, index: number) => (
            <DesktopNavItem key={index} item={item} />
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
          maxHeight: isMenuOpen ? "500px" : "0px", // Increased max height for more items
        }}
        role="menu"
        aria-label="Mobile navigation menu"
      >
        <ul className="px-4 py-2 space-y-2">
          {navItems.map((item: NavItem, index: number) => (
            <MobileNavItem key={index} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}
