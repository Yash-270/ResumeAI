"use client";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const router = useRouter();
  const[open,setOpen]=useState(false);
  const { user } = useUser();
  return (
    <nav className="px-6 py-3 bg-[#0a0f2c] flex flex-wrap items-center justify-between border-b border-gray-700 relative z-50">
      <div className="flex items-center gap-2">
        <img src="https://img.icons8.com/fluency/48/artificial-intelligence.png" alt="logo" className="w-8 h-8 rounded-full" />
        <Link href="/" className="text-white font-semibold text-lg whitespace-nowrap">
          ResumeAI
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link className="text-white hover:text-gray-300"  href="/">Home</Link>
         <Link className="text-white hover:text-gray-300" href="/template">
          Templates
        </Link>

        {/* DROPDOWN */}
        <div 
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="text-white hover:text-gray-300">
            Analyzer ▾
          </button>

          {open && (
            <div className="absolute z-[999] top- full left-0 bg-[#111827] border border-gray-700 rounded-lg shadow-lg w-44 py-2">

              <Link href="/add-resume" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                Resume Analysis
              </Link>
              <Link href="/github-analysis" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                GitHub Analyze
              </Link>

              <Link href="/linkedin-analysis" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                LinkedIn Analyze
              </Link>

              
            </div>
          )}
          </div>
        {user?.id ? (
          <div>
            <SignOutButton>
    <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium text-sm shadow-md">Sign out</button>
  </SignOutButton>
  </div>
        ):(
          <div className="flex items-center gap-2">

    <button 
    className="px-4 py-2 rounded-lg border border-gray-500 text-white hover:bg-white hover:text-[#0a0f2c] transition font-medium text-sm"
    onClick={() => router.push("/sign-in")}
  >
    Login
  </button>
  <button 
    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm"
    onClick={() => router.push("/sign-up")}
  >
    Signup
  </button>
    </div>
  )
}

      </div>
    </nav>
  );
}