import { useState } from "react";

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: string[];
  projects: string[];
  experience: string[];
  education: string[];
};

const safeArray = (data: any) => {
    if (!data) return [];
    const arr = Array.isArray(data) ? data : typeof data === "string" ? data.split(",") : [];
    return arr.map((item: any) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
            return Object.values(item).filter(Boolean).join(" — ");
        }
        return String(item);
    }).filter(Boolean);
}
    const renderItem = (item: any) => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
        // object ko flat string mein convert karo
        const parts = Object.values(item).filter(v => v && String(v).trim() !== "");
        return parts.join(" — ");
    }
    return null;
}

export default function Classic({ data }: { data: ResumeData }) {
  const[dload,setDload]=useState(false);
      const handleDownload = () => {
    
            setDload(true);
            // Use browser's built-in print-to-PDF (no external lib needed)
              const printWindow = window.open('', '_blank');
            if (!printWindow) { setDload(false); return; }
    
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${data?.name} - Resume</title>
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
                    <h1>${data?.name}</h1>
                    <div style="display:flex; gap:16px; font-size:12px; color:#555; margin:6px 0 12px 0; flex-wrap:wrap;">
                    ${data?.email ? `<span>📧 ${data?.email}</span>` : ''}
                    ${data?.phone ? `<span>📞 ${data?.phone}</span>` : ''}
                    ${data?.github ? `<span>🐙 ${data?.github}</span>` : ''}
                    ${data?.linkedin ? `<span>🔗 ${data?.linkedin}</span>` : ''}
                </div>
                    <p class="summary">${data?.summary}</p>
    
                  ${data?.skills?.length > 0 ? `
                  <h2>Skills</h2>
                    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
                        ${safeArray(data?.skills || []).map((s: string) => 
                            `<span style="background:#f1f5f9; border:1px solid #cbd5e1; padding:3px 10px; border-radius:20px; font-size:12px;">${s}</span>`
                        ).join('')}
                    </div>
                     ` : ''}
                    <h2>Projects</h2>
                    ${data?.projects?.length > 0 ? ` 
                    <ul>${safeArray(data?.projects || []).map((p: string) => `<li>${p}</li>`).join('')}</ul>
                     ` : ''}
                    ${data?.experience?.length > 0 ? `
                    <h2>Experience</h2>
                    <ul>${safeArray(data?.experience || []).map((e: string) => `<li>${e}</li>`).join('')}</ul>
                      ` : ''}
                    ${data?.education?.length > 0 ? ` 
                    <h2>Education</h2>
                    <ul>${safeArray(data?.education || []).map((e: string) => `<li>${e}</li>`).join('')}</ul>
                      ` : ''}
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
      }
  return (
<div className=" flex flex-col items-center justify-center px-6 py-10 bg-[#0a0f1c] text-white relative overflow-hidden">
            <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            <div className="bg-white py-3 px-4">
      
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        {data?.name && (
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide uppercase">{data.name}</h1>
        )}
        <p className="text-sm text-gray-600 mt-2 flex justify-center flex-wrap gap-3">
          {data?.email && <span>📧 {data.email}</span>}
          {data?.phone && <span>📞 {data.phone}</span>}
        </p>
        <p className="text-sm text-gray-600 mt-1 flex justify-center flex-wrap gap-3">
          {data?.linkedin && <span>🔗 {data.linkedin}</span>}
          {data?.github && <span>🐙 {data.github}</span>}
        </p>
      </div>

      {data?.summary && (
        <p className="mt-3 text-gray-700 text-sm leading-relaxed italic border-l-4 border-gray-800 pl-3">{data.summary}</p>
      )}

      {data?.skills?.length>0 && (
        <div className="mt-5">
          <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest border-b-2 border-gray-800 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {safeArray(data.skills).map((s, i) => (
              <span key={i} className="bg-gray-100 border border-gray-400 text-gray-800 px-3 py-1 rounded text-xs font-medium">{renderItem(s)}</span>
            ))}
          </div>
        </div>
      )}

      {data?.projects?.length>0 && (
        <div className="mt-5">
          <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest border-b-2 border-gray-800 pb-1 mb-3">Projects</h2>
          <ul className="mt-2 space-y-2">
            {safeArray(data.projects).filter(item => item && item !== "").map((p, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-800 font-bold">▸</span>{renderItem(p)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.experience?.length>0 && (
        <div className="mt-5">
          <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest border-b-2 border-gray-800 pb-1 mb-3">Experience</h2>
          <ul className="mt-2 space-y-2">
            {safeArray(data.experience).filter(item => item && item !== "").map((e, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-800 font-bold">▸</span>{renderItem(e)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.education?.length>0 && (
        <div className="mt-5">
          <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest border-b-2 border-gray-800 pb-1 mb-3">Education</h2>
          <ul className="mt-2 space-y-2">
            {safeArray(data.education).filter(item => item && item !== "").map((ed, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-800 font-bold">▸</span>{renderItem(ed)}
              </li>
            ))}
          </ul>
        </div>
      )}

    <div
     className="flex justify-center">
        <button className="px-4 py-2 m-3 bg-red-600 text-white rounded-lg hover:bg-red-800" onClick={handleDownload} disabled={dload}>
            {dload ? "Preparing PDF..." : "Download PDF"}
        </button>

      </div>
      </div>
    
      </div>
    </div>
  );
}