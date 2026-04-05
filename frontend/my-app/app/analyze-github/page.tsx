"use client";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function AnalyzeGithub(){
    const route=useRouter();
    const[loading,setLoading]=useState(true);
    const[github,setGithub]=useState<any>(null);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");
           
            const res = await API.get(`/resume/${userId}`);
            const data=res?.data?.data?.githubData;
            setGithub(data); 

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
            <p className="text-lg animate-pulse">Analyzing Github...</p>
        </div>
    )
    return(
        <div className=" flex items-center justify-center px-6 bg-[#0a0f1c] text-white min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            {github && (    
                <div className="rounded-2xl bg-[#0b1220] p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-center">Github Analysis</h1>
                    <div className="text-center">
                        <p className="text-gray-400">Github Score: </p>
                        <h2 className="text-4xl font-bold text-blue-400">{github.github_score}</h2>
                    </div>
                   <div>
                        <h2 className="text-lg font-semibold mb-2">Summary</h2>
                        <p className="text-gray-400">{github.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-green-400">Key Strengths</h3>
                        <ul>{github.key_strengths.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-red-400">Critical Issues</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">{github.critical_issues.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <h3 className="font-semibold mb-2 text-yellow-400">Top Recommendations</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">{github.top_recommendations.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                     <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                        <p>Project Quality: <span className="text-white">{github.project_quality}</span></p>
                        <p>Activity: <span className="text-white">{github.activity_level}</span></p>
                    </div>
                    <div className="pt-4 flex justify-center">
                     <button className="bg-[#0a0f4c] hover:border border-gray-900 text-white font-bold py-2 px-9 rounded" onClick={()=>route.push("/ask-resume")}>Ask AI</button>
                     </div>
                </div>
            )}
           
            
        </div>
        </div>
    )
}