"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaVolleyballBall, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { id: 1, title: "Home", href: "/" },
  { id: 2, title: "Schedule", href: "/schedule" },
  { id: 3, title: "Photos", href: "/photos" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 h-20">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <FaVolleyballBall />
        </Link>

        <ul className="hidden md:flex space-x-6 text-gray-600">
          {navLinks.map(({ id, title, href }) => (
            <li key={id} className="hover:text-gray-800 transition">
              <Link href={href}>{title}</Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
        >
          {navOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {navOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-600">
            {navLinks.map(({ id, title, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  onClick={() => setNavOpen(false)}
                  className="text-xl hover:text-gray-800 transition"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
