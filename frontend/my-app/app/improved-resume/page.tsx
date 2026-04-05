"use client";
import API from "@/lib/axios";
import { useEffect, useState } from "react"

export default function ImprovedResume(){
    const[loading,setLoading]=useState(true);
    const[improvedResume,setImprovedResume]=useState<any>(null);
    const [dload,setDload]=useState(false);
   const handleDownload = () => {

        setDload(true);
        // Use browser's built-in print-to-PDF (no external lib needed)
          const printWindow = window.open('', '_blank');
        if (!printWindow) { setDload(false); return; }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${improvedResume.name} - Resume</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; font-size: 13px; color: #000; padding: 40px; background: white; }
                    h1 { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
                    .summary { margin: 8px 0 16px 0; color: #333; line-height: 1.5; }
                    h2 { font-size: 14px; font-weight: bold; color: #1a56db; text-transform: uppercase;
                         letter-spacing: 0.5px; border-bottom: 1px solid #ddd; padding-bottom: 3px;
                         margin: 16px 0 8px 0; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 3px 0; padding-left: 12px; position: relative; line-height: 1.5; }
                    li::before { content: "•"; position: absolute; left: 0; color: #1a56db; }
                    @media print {
                        body { padding: 20px; }
                        @page { margin: 1cm; }
                    }
                </style>
            </head>
            <body>
                <h1>${improvedResume.name}</h1>
                <div style="display:flex; gap:16px; font-size:12px; color:#555; margin:6px 0 12px 0; flex-wrap:wrap;">
                ${improvedResume.email ? `<span>📧 ${improvedResume.email}</span>` : ''}
                ${improvedResume.phone ? `<span>📞 ${improvedResume.phone}</span>` : ''}
                ${improvedResume.github ? `<span>🐙 ${improvedResume.github}</span>` : ''}
                ${improvedResume.linkedin ? `<span>🔗 ${improvedResume.linkedin}</span>` : ''}
            </div>
                <p class="summary">${improvedResume.summary}</p>

              <h2>Skills</h2>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
                    ${(improvedResume.skills || []).map((s: string) => 
                        `<span style="background:#f1f5f9; border:1px solid #cbd5e1; padding:3px 10px; border-radius:20px; font-size:12px;">${s}</span>`
                    ).join('')}
                </div>

                <h2>Projects</h2>
                <ul>${(improvedResume.projects || []).map((p: string) => `<li>${p}</li>`).join('')}</ul>

                <h2>Experience</h2>
                <ul>${(improvedResume.experience || []).map((e: string) => `<li>${e}</li>`).join('')}</ul>

                <h2>Education</h2>
                <ul>${(improvedResume.education || []).map((e: string) => `<li>${e}</li>`).join('')}</ul>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
       printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            setTimeout(() => {
                printWindow.close();
                setDload(false);
            }, 500);
        };
    };
    useEffect(()=>{
       const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");

            const res = await API.get(`/resume/${userId}`);
            const data=res?.data?.data?.improvedResume;
            setImprovedResume(data);
            }
            catch(err: any){
                console.log(err.message);
            }
            finally{
                setLoading(false);
            }
       }
       fetchData();
    },[]); 
    if(loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg animate-pulse">Improving resume...</p>
        </div>
    )
    if (!improvedResume || !improvedResume.name) {
        return <p className="text-white">Invalid resume data</p>;
    }
    const safeArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (typeof data === "string") return data.split(",");
        return [];
    };
    const renderItem = (item: any) => {
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    return (
      <>
        <strong>{item.title}</strong> ({item.duration})
        <br />
        <span>{item.details}</span>
      </>
    );
  }
  return null;
};
    return(
        <>
        
       <div className=" flex flex-col items-center justify-center px-6 py-10 bg-[#0a0f1c] text-white relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
                
                {improvedResume && (
                    <div className="rounded-2xl bg-[#0b1220] p-8 space-y-6">
                        <div className="flex justify-center">
                            <h1 className="text-3xl font-bold mb-6">Resume</h1>
                        </div>
                        <h1 className="text-2xl font-bold">{improvedResume.name}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-1">
                        {improvedResume.email && (
                            <span>📧 {improvedResume.email}</span>
                        )}
                        {improvedResume.phone && (
                            <span>📞 {improvedResume.phone}</span>
                        )}
                        {improvedResume.github && (
                            <a href={improvedResume.github} target="_blank" className="text-blue-400 hover:underline">
                                🐙 {improvedResume.github}
                            </a>
                        )}
                        {improvedResume.linkedin && (
                            <a href={improvedResume.linkedin} target="_blank" className="text-blue-400 hover:underline">
                                🔗 {improvedResume.linkedin}
                            </a>
                        )}
                    </div>

                        <p className="mt-2 text-gray-300">{improvedResume.summary}</p>

                        <h2 className="mt-4 font-semibold text-blue-400">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {safeArray(improvedResume.skills).map((s: string, i: number) => (
                                <span key={i} className="bg-[#111827] border border-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                                    {s}
                                </span>
                            ))}
                        </div>

                        <h2 className="mt-4 font-semibold text-blue-400">Projects</h2>
                        <ul className="space-y-1">
                        {safeArray(improvedResume.projects).map((p: string, i: number) => <li key={i}>• {renderItem(p)}</li>)}
                        </ul>
                        <h2 className="mt-4 font-semibold text-blue-400">Experience</h2>
                        <ul className="space-y-1">
                        {safeArray(improvedResume.experience).map((exp: string, i: number) => <li key={i}>• {renderItem(exp)}</li>)}
                        </ul>
                        <h2 className="mt-4 font-semibold text-blue-400">Education</h2>
                        <ul className="space-y-1">
                        {safeArray(improvedResume.education).map((edu: string, i: number) => <li key={i}>• {renderItem(edu)}</li>)}
                        </ul>
                        <div className="flex justify-center">
                        <button className="px-4 py-2 m-3 bg-red-600 text-white rounded-lg hover:bg-red-800" onClick={handleDownload} disabled={dload}>
                            {dload ? "Preparing PDF..." : "Download PDF"}
                        </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}