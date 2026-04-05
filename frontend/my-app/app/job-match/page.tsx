"use client";
import API from "@/lib/axios";

import { useEffect, useState } from "react"

export default function JobMatch(){
    const[loading,setLoading]=useState(false);
    const[resumeText,setResumeText]=useState<any>(null);
    const[match,setMatch]=useState("");
    const[reply,setReply]=useState<any>(null);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");

            const res = await API.get(`/resume/${userId}`);
            const data=res?.data?.data?.resume?.raw_text;
            setResumeText(data);
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
    const handleMatch=async ()=>{

        try{
            console.log("resumeText:", resumeText);
            setLoading(true);
            const userId=localStorage.getItem("userId");
            const res=await API.post("resume/match",{
                match,
                resumeText,
                userId
            });
        
            const ans=res?.data?.jd;
            localStorage.setItem("jobmatch",JSON.stringify(ans));
            setReply(ans);
        }
        catch(err: any){
            console.log(err.message);
        }   
        finally{
            setLoading(false);
            setMatch("");
        }
    }
    return(
         <div className=" min-h-screen  flex flex-col items-center justify-center  px-6 py-10 bg-[#0a0f1c] text-white relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="w-full  max-w-2xl space-y-6 ">
                 {reply &&(
                <div className="rounded-2xl bg-[#0b1220] p-8 space-y-6">
                   

                    <h1 className="font-bold text-2xl text-center">Resume Vs Job </h1>
                    <div className="text-center">
                        <p className="text-gray-400">Match Score: </p>
                        <h2  className="text-4xl font-bold text-blue-400">{reply.match_score}</h2>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2 text-red-400 ">Missing Skills: </h2>
                        <ul className="space-y-1 text-gray-400 text-sm">{reply.missing_skills.map((i:string , index:number)=>(
                            <li key={index}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2 text-blue-400 ">Action Plan: </h2>
                        <ul className="space-y-1 text-gray-400 text-sm">{reply.action_plan.map((i:string, index:number)=>(
                            <li key={index}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2 text-yellow-600 ">Priority Improvements: </h2>
                        <ul className="space-y-1 text-gray-400 text-sm">{reply.priority_improvements.map((i:string, index:number)=>(
                            <li key={index}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    
                </div>
            )}
            <div className="flex gap-3">
                <input  className="flex-1 px-2 py-3 rounded-lg bg-[#111827] border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"type="text" placeholder="Paste Job description" value={match}onChange={(e)=>setMatch(e.target.value)}/>
                <button  disabled={loading}
            className="bg-blue-900 hover:border border-gray-900 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"onClick={handleMatch} >{loading ? "Finding Matches..." : "Find Matches"}</button>
            </div>
            
            </div>
        </div>
    )
}