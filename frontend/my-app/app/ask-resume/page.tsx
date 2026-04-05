"use client";
import API from "@/lib/axios";

import { useEffect, useState } from "react"

export default function AskResume(){
    const[loading,setLoading]=useState(false);
    const[resume,setResume]=useState<any>(null);
    const[question,setQuestion]=useState<any>(null);
    const[reply,setReply]=useState<any>(null);
    const[gitData,setGitData]=useState<any>(null);
    const[linkData,setLinkData]=useState<any>(null);
    const[jobMatch,setJobMatch]=useState<any>(null);
    const[improve,setImprove]=useState<any>(null);
    useEffect(()=>{
        const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");
            
            const res = await API.get(`/resume/${userId}`);
            setResume(res?.data?.data?.resume?.raw_text);
            setGitData(res?.data?.data?.githubData);
            setLinkData(res?.data?.data?.linkedinData);
            setImprove(res?.data?.data?.improvedResume);
            setJobMatch(res?.data?.data?.jobMatch);
            }
            catch(err: any){
                console.log(err.message);
            }
            finally{
                setLoading(false);
            }
        }
    },[]);
     const handleAsk=async()=>{
        try{
            setLoading(true);
            const res=await API.post("/resume/chat",{
                question,
                resume,
                gitData,
                linkData,
                jobMatch,
                improve
            });
            const ans=res?.data?.answer;
            setReply(ans);
            setQuestion(" ");
        }
        catch(err: any){
            console.log(err.message);
        }
        finally{
            setLoading(false);
        }
    }
   return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#0a0f1c] text-white relative">

        {/* BG */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>

        {/* CONTENT BOX */}
        <div className="w-full max-w-2xl space-y-6">

        {/* RESPONSE */}
        {reply && (
            <div className="bg-[#0b1220] p-5 rounded-xl border border-gray-700 shadow-md">
            <h1 className="font-semibold mb-2 text-blue-400">AI Response</h1>
            {reply.split("\n").map((line: string, i: number) => {
            if (line.includes("🚀")) {
                return <p key={i} className="text-blue-400 font-semibold mt-3">{line}</p>;
            }
            if (line.includes("💡")) {
                return <p key={i} className="text-yellow-400 font-semibold mt-3">{line}</p>;
            }
            if (line.includes("🔥")) {
                return <p key={i} className="text-green-400 font-semibold mt-3">{line}</p>;
            }
            return <p key={i} className="text-gray-300">{line}</p>;
            })}
            </div>
        )}

        {/* INPUT + BUTTON */}
        <div className="flex gap-3">

            <input
            type="text"
            
            placeholder="Ask your doubt..."
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#111827] border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />

            <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-900 hover:border border-gray-900 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
            {loading ? "Thinking..." : "Ask"}
            </button>

        </div>

        </div>
    </div>
    )
}
