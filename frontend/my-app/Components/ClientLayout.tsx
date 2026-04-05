"use client";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/axios";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [improve, setImprove] = useState<any>(null);
  const [gitData, setGitData] = useState<any>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [resumeText, setResumeText] = useState<any>(null);
  const { user } = useUser();
    useEffect(() => {
        
   if (user?.id) {
    // ✅ login hua → store
    localStorage.setItem("userId", user.id);
  } else {
    // ✅ logout hua → remove
    localStorage.clear();
  }
    }, [user]);
  // ✅ This function reads all localStorage keys fresh
  const syncFromStorage = async () => {
   
            try {
            const userId=localStorage.getItem("userId");
            if (!userId || userId === "null") return;
            const res = await API.get(`/resume/${userId}`);
            setResumeText(res?.data?.data?.resume?.text);
            setGitData(res?.data?.data?.githubData);
            setLinkData(res?.data?.data?.linkedinData);
            setImprove(res?.data?.data?.improvedResume);
            }
            catch(err: any){
                console.log(err.message);
            }
  
    }
  // ✅ Re-sync every time the route changes (e.g. after upload navigates away)
  useEffect(() => {
    if (user?.id) syncFromStorage();
  }, [pathname, user]); // <- key fix: pathname as dependency

  // ✅ Also listen for storage events (cross-tab support)
  useEffect(() => {
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const showSidebar =
    pathname.startsWith("/github-analysis") ||
    pathname.startsWith("/linkedin-analysis")||
    pathname.startsWith("/add-resume") ||
    pathname.startsWith("/see-resume") ||
    pathname.startsWith("/ask-resume") ||
    pathname.startsWith("/improved-resume") ||
    pathname.startsWith("/job-match") ||
    pathname.startsWith("/analyze-github") ||
    pathname.startsWith("/see-template") ||
    pathname.startsWith("/analyze-linkedin");

  return (
    <>
      <Navbar />
      <div className="flex">
        {showSidebar && (
          <div className={`${open ? "w-45" : "w-16"} transition-all duration-300 min-h-screen bg-[#0a0f2c] border-r border-gray-800 flex flex-col items-center py-6 gap-4`}>
            
            <button onClick={() => setOpen(!open)} className="text-white hover:text-gray-300 text-2xl">
              ☰
            </button>

            {/* Always visible */}
            <SideBtn open={open} emoji="📄" label="Add Resume" onClick={() => router.push("/add-resume")} active={pathname === "/add-resume"} />

            {/* Only when resume is uploaded */}
            {resumeText && (
              <SideBtn open={open} emoji="🧑‍💻" label="See Resume" onClick={() => router.push("/see-resume")} active={pathname === "/see-resume"} />
            )}
            {resumeText && (
              <SideBtn open={open} emoji="🤖" label="Ask AI" onClick={() => router.push("/ask-resume")} active={pathname === "/ask-resume"} />
            )}
            {resumeText && (
              <SideBtn open={open} emoji="💼" label="Job Match" onClick={() => router.push("/job-match")} active={pathname === "/job-match"} />
            )}

            {/* Only when improved resume exists */}
            {improve && (
              <SideBtn open={open} emoji="🚀" label="Improve Resume" onClick={() => router.push("/improved-resume")} active={pathname === "/improved-resume"} />
            )}

            {/* Only when github data exists */}
            {gitData && (
              <SideBtn open={open} emoji="🐙" label="Analyze Github" onClick={() => router.push("/analyze-github")} active={pathname === "/analyze-github"} />
            )}

            {/* Only when linkedin data exists */}
            {linkData && (
              <SideBtn open={open} emoji="🔗" label="Analyze Linkedin" onClick={() => router.push("/analyze-linkedin")} active={pathname === "/analyze-linkedin"} />
            )}
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}

// ✅ Clean reusable sidebar button
function SideBtn({ open, emoji, label, onClick, active }: {
  open: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-sm font-medium
        ${active ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-[#1a1f3c] hover:text-white"}
        ${open ? "justify-start gap-3" : "justify-center"}
      `}
    >
      <span className="text-lg">{emoji}</span>
      {open && <span>{label}</span>}
    </button>
  );
}