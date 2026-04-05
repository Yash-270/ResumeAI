"use client";
import { useRouter } from "next/navigation";


export default function Home() {
  const route=useRouter();
  return (
    <div className="relative min-h-screen bg-[#0a0f1c] text-white overflow-hidden pb-32">

    
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>

    
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#3b82f6]/20 blur-[120px] rounded-full"></div>

   
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Build a <span className="bg-gradient-to-r from-[#d4a373] to- bg-blue-900   text-transparent bg-clip-text">
            Job-Winning resume
          </span> with AI
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl text-lg">
          Analyze your resume, match jobs, improve instantly, and track your career growth — all in one place.
        </p>

        {/* CTA */}
        <div className="flex gap-4 mt-8">
        
            <button 
  className="relative z-90 px-6 py-3 rounded-xl font-semibold text-white  border border-blue-500 "
  onClick={() => route.push("/add-resume")}
>
  Scan your Resume
</button>
  
        </div>
      </div>

      
      <div className="mt-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">

        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
          <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-2">📊 ATS Score</h3>
            <p className="text-gray-400">
              Know how well your resume performs in real hiring systems.
            </p>
          </div>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
          <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-2">💼 Job Match</h3>
            <p className="text-gray-400">
              Match your resume with job descriptions and find gaps instantly.
            </p>
          </div>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
          <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-2">🚀 AI Improve</h3>
            <p className="text-gray-400">
              Rewrite your resume with powerful, recruiter-friendly content.
            </p>
          </div>
        </div>

          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-2">🐙 GitHub Analyzer</h3>
              <p className="text-gray-400">
                Analyze your GitHub profile and improve project impact.
              </p>
            </div>
          </div>

            <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
          <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-2">🤖 AI Career Chat</h3>
            <p className="text-gray-400">
              Ask career questions, get resume advice, and prepare for interviews.
            </p>
          </div>
        </div>

          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            <div className="p-6 rounded-2xl bg-[#0b1220] backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-2">🔗 LinkedIn Analyzer</h3>
              <p className="text-gray-400">
                Optimize your LinkedIn profile for recruiters and visibility.
              </p>
            </div>   
        </div>
        </div>

        <div className="py-20 px-6 bg-[#020817]">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT - IMAGE */}
    <div className="relative">
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-500/20 blur-3xl rounded-full"></div>

      <img
        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
        alt="Resume Preview"
        className="relative w-full rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] border border-gray-700 hover:scale-105 transition duration-500"
      />
    </div>

    {/* RIGHT - TEXT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
        Customized <span className="text-[#0a0f7c]">Resume Templates</span>
      </h2>

     
      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">

        <button className="px-6 py-3 border border-blue-700  text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition" onClick={()=>route.push("/template")}>
          View Templates
        </button>
      </div>
    </div>

  </div>
</div>

      

      <div className="mt-28 text-center px-6">
        <h2 className="text-3xl font-bold">
          Everything you need to get hired faster
        </h2>
        <p className="text-gray-400 mt-4">
          Let AI guide your career decisions...
        </p>
      </div>

    </div>
  );
}