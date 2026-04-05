"use client";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Info = File | null;

export default function AddResume() {
  const route = useRouter();

 // const [see, setSee] = useState<any>(null);
  const [file, setFile] = useState<Info>(null);
  const [loading, setLoading] = useState(false);
  const[error,setError]=useState("");
  const handleAdd = async () => {
    try {
    const userId=localStorage.getItem("userId");
      setLoading(true);

      if (!file) {
        setError("Please select file");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId || ""); 
      const res = await API.post("/resume/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const analysis = res?.data?.resume?.resume?.analysis;

      if (!analysis) {
        setError("AI failed");
        return;
      }

      //setSee(analysis);

      setError("Resume added");

      // 🔥 backend se fetch hoga next page pe
      route.push("/see-resume");

    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex items-center justify-center px-6 bg-[#0a0f1c] text-white min-h-screen relative overflow-hidden">

    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>

    {/* ✅ FIXED */}
    <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

    <div className="w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
      <div
        className="rounded-2xl bg-[#0b1220] p-8 flex flex-col items-center border border-gray-800">


        <h1 className="text-2xl font-bold mb-2">Upload Resume</h1>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Get ATS score, job match, and AI improvements instantly
        </p>

        {/* FILE INPUT */}
        <input
          className="w-full mb-2 text-sm m-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-[#111827] file:hover:bg-blue-900 file:transition  file:text-white cursor-pointer"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setFile(file);
          }}
        />

        
        <button
          className="w-full py-3 rounded-xl font-semibold bg-[#0a0f4c] m-3 hover:bg-blue-900"
          onClick={handleAdd} disabled={loading}
        >
          {loading ? "Uploading..." : "Add Resume"}
        </button>
          <p className={`text-sm mt-2 ${error === "Resume added" ? "text-green-400" : "text-red-400"}`}>
    {error}
</p>


        </div>
      </div>
    </div>
  );
}