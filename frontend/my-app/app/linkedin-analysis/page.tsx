"use client";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LinkedinAnalysis(){
    const route=useRouter();
    const[manualId,setManualId]=useState("");
    const[loading,setLoading]=useState(false);
    useEffect(()=>{
        const fetchData=async ()=>{
            try{
                const userId=localStorage.getItem("userId");
                const res= await API.get(`/resume/${userId}`);
                const data=res?.data?.data?.resume?.text?.linkedin;
                if(data){
                    setManualId(data);
                }
                else{
                    setManualId("");
                }
            }
            catch(err: any){
                console.log(err.message);
            }
        }
        fetchData();
    },[]);
    const handleLinkedin=async ()=>{
        try{
            setLoading(true);
    
                const userId=localStorage.getItem("userId");
          
            const res=await API.post("/resume/linkedin",{
                linkusername: manualId,
                userId
            });
            route.push("/analyze-linkedin");
        }
        catch(err: any){    
            console.log(err.message);   
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className=" flex items-center justify-center px-6 bg-[#0a0f1c] text-white min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            <div className="rounded-2xl bg-[#0b1220] p-8 backdrop-blur-xl flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2">LinkedIn Profile Analyzer</h1>
                <p className="text-gray-400 text-sm mb-6 text-center">
                Get ATS score, job match, and AI improvements instantly
                </p>

                <input className=" w-full bg-[#111827] text-gray-400 placeholder:text-gray-500 border border-gray-600 m-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4" type="text" value={manualId} placeholder="Paste LinkedIn profile URL (e.g. linkedin.com/in/yash-kumar)" onChange={(e)=>setManualId(e.target.value)}/>
                <button className="w-full py-3 rounded-xl font-semibold bg-[#0a0f4c] text-white hover:opacity-90 m-4 transition" onClick={handleLinkedin} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze LinkedIn"}
                </button>
            </div>
            </div>
        </div>

    )
}