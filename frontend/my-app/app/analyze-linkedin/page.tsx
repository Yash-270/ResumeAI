"use client";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function AnalyzeLinkedin(){
    const route=useRouter();
    const[loading,setLoading]=useState(true);
    const[linkedin,setLinkedin]=useState<any>(null);
    useEffect(()=>{
        const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");

            const res = await API.get(`/resume/${userId}`);
            const data=res?.data?.data?.linkedinData;
            setLinkedin(data); 
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
            <p className="text-lg animate-pulse">Analyzing LinkedIn...</p>
        </div>
    )
    return(
        <div className=" flex items-center justify-center px-6 bg-[#0a0f1c] text-white min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] [background-size:22px_22px] opacity-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-gradient-to-r from-[#1f2937] to-[#111827]">
            {linkedin && (    
                <div className="rounded-2xl bg-[#0b1220] p-8 space-y-6">
                   

                    <h1 className="font-bold text-2xl text-center">LinkedIn Analysis</h1>
                    <div className="text-center">
                        <p className="text-gray-400">Linkedin Score: </p>
                        <h2  className="text-4xl font-bold text-blue-400">{linkedin.linkedin_score}</h2>
                    </div>
                    <div>
                        <h2 className="text-lg mb-2 font-semibold">Summary: </h2>
                        <p>{linkedin.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-green-400">Profile Strength</h3>
                        <ul>{linkedin.profile_strength.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-red-400">Missing Elements</h3>
                        <ul>{linkedin.missing_elements.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-yellow-400">Improvement Actions</h3>
                        <ul>{linkedin.improvement_actions.map((i:string , idx:number)=>(
                            <li key={idx}>{i}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Profile Quality</h3>
                        <p>{linkedin.profile_quality}</p>
                    </div>
                    <div className="pt-4 flex justify-center">
                    <button className="bg-[#0a0f4c] hover:border border-gray-900 text-white  font-bold py-2 px-9 rounded" onClick={()=>route.push("/ask-resume")}>Ask AI</button>
                    </div>
                </div>
                
            )}
            
        </div>
        </div>
        
    )

}