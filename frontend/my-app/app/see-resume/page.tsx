"use client";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function SeeResume(){
    const route=useRouter();
    const[resumeText,setResumeText]=useState<any>(null);
    const[result,setResult]=useState<any>(null);
    const[linkLoad,setLinkLoad]=useState(false);
    const[gitLoad,setGitLoad]=useState(false);
    const[improLoad,setImproLoad]=useState(false);
    const[loading,setLoading]=useState(true);
    useEffect(() => {
        
  const fetchData = async () => {
    try {
      const userId=localStorage.getItem("userId");
      if(!userId){
        console.log("No userId found");
        return;
      }

      const res = await API.get(`/resume/${userId}`);

      const data = res?.data?.data;

      setResult(data?.resume?.analysis);
      setResumeText(data?.resume?.raw_text);

    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
    const handleAsk=()=>{
        try{
            route.push("/ask-resume");
        }
        catch(err: any){
            console.log(err.message);
        }
    }
    const handleGithub=async ()=>{
        try{
            const userId=localStorage.getItem("userId");
            console.log("github username:", result?.github); 
            if (!result?.github) {
                alert("GitHub username not found in resume!");
                return;
            }
            setGitLoad(true);
            const res=await API.post("/resume/github",{
            username: result?.github,
            userId
           
        });
        route.push("/analyze-github");
        }
        catch(err: any){    
            console.log(err.message); 
        }
        finally{
            setGitLoad(false);
        }
    }
    const handleLinkedin=async ()=>{
        try{
            const userId=localStorage.getItem("userId");
            console.log("linkedin username:", result?.linkedin); 
            if (!result?.linkedin) {
                alert(" Linkedin username not found in resume!");
                return;
            }
            setLinkLoad(true);
            const res=await API.post("/resume/linkedin",{
                linkusername: result?.linkedin,
                userId
            });
            route.push("/analyze-linkedin");
        }
        catch(err: any){    
            console.log(err.message); 
        }
        finally{
            setLinkLoad(false);
           
        }
    }
    const handleImprove=async ()=>{
        try{
            const userId=localStorage.getItem("userId");
            setImproLoad(true);
            console.log("ResumeText",resumeText);
            console.log("result",result);
            const res=await API.post("/resume/improve",{

                result,
                resumeText,
                userId
            });   
            localStorage.setItem("improvedResume", JSON.stringify(res.data.improvedResume));
        }
        catch(err: any){    
            console.log(err.message); 
        }
        finally{
            setImproLoad(false);
            route.push("/improved-resume");
        }
    }
    if(loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg animate-pulse">Analyzing resume...</p>
        </div>
    )
    return(
        <div className="px-6 py-10 bg-[#0a0f1c] text-white min-h-screen relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="max-w-6xl mx-auto grid md:grid md:grid-cols-[3fr_1fr] gap-6 items-start">
            <div className="w-full p-[1px] rounded-2xl  bg-gradient-to-r from-[#1f2937] to-[#111827]">
                    {result && (
                    <div className="bg-[#0b1220] p-6 rounded-2xl  space-y-6 h-full">

                        {/* SCORE */}
                        <div className="flex justify-between">
                            <div>
                            <p className="text-gray-400 text-sm">ATS Score</p>
                            <p className="text-2xl font-bold text-blue-400">
                                {result.ats_score}/100
                            </p>
                            </div>
                            <div>
                            <p className="text-gray-400 text-sm">Impact Score</p>
                            <p className="text-2xl font-bold text-green-400">
                                {result.impact_score}/100
                            </p>
                            </div>
                        </div>

                        {/* MARKET FIT */}
                        <div>
                            <p className="text-gray-400 text-sm">Market Fit</p>
                            <p className="text-white">{result.market_fit}</p>
                        </div>

                        {/* STRENGTHS */}
                        <div>
                            <h3 className="text-green-400 font-semibold mb-2">Strengths</h3>
                            <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            {result.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        {/* WEAKNESSES */}
                        <div>
                            <h3 className="text-red-400 font-semibold mb-2">Weaknesses</h3>
                            <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            {result.weaknesses?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        {/* MISSING SKILLS */}
                        <div>
                            <h3 className="text-yellow-400 font-semibold mb-2">Missing Skills</h3>
                            <div className="flex flex-wrap gap-2">
                            {result.missing_skills?.map((s: string, i: number) => (
                                <span key={i} className="bg-[#111827] px-3 py-1 rounded-full text-sm">
                                {s}
                                </span>
                            ))}
                            </div>
                        </div>

                        {/* IMPROVEMENTS */}
                        <div>
                            <h3 className="text-blue-400 font-semibold mb-2">Improvements</h3>
                            <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            {result.improvement_actions?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        {/* FINAL VERDICT */}
                        <div className="bg-[#111827] p-4 rounded-xl">
                            <p className="text-gray-400 text-sm">Final Verdict</p>
                            <p className="text-white font-medium">{result.final_verdict}</p>
                        </div>

                    </div>
                    )}
                </div>
            {result?.github && result?.linkedin && (
            <div className="bg-[#0b1220] p-6 rounded-2xl space-y-6">
                {result?.github && (
                    <div className="bg-[#0b1220] p-4 rounded-xl">
                        
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Github ID Detected:  {result.github}</h3>
                            <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg" onClick={handleGithub}>
                                {gitLoad ? "Analyzing...": "Analyze Github"}
                            </button>
                        </div>
                        
                    </div>
                )}
                 {result?.linkedin && (
                    <div className="bg-[#0b1220] p-4 rounded-xl">
                   
                        <div>

                            <h3 className="font-semibold mb-2 text-sm">LinkedIn ID Detected: {result.linkedin}</h3>
                            <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg" onClick={handleLinkedin} disabled={linkLoad}> 
                               {linkLoad ? "Analyzing...": "Analyze LinkedIn"}
                            </button>
                        </div>
                    
                    </div>
                )}
            </div>
            )}
            </div>
            <div className="flex justify-center mt-8">
                <button 
                onClick={handleAsk}
                className="px-6 py-4  rounded-xl font-semibold 
 bg-[#0a0f4c] 
text-white hover:opacity-90 transition"
                >
                Ask AI 
                </button>
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="flex justify-between max-w-md mx-auto mt-6">
                
                <button 
                onClick={()=>route.push("/job-match")}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
                >
                Job Match
                </button>

                <button 
                onClick={handleImprove}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg" disabled={improLoad}
                >
                {improLoad ? "Improving" : "Improve Resume"}
                </button>

            </div>
        </div>
    )
}