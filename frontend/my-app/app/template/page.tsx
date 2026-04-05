"use client";   
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template() {
    const route=useRouter();
    const [loading,setLoading]=useState(false);
    const [resumeText,setResumeText]=useState<any>(null);
    useEffect(()=>{
        const fetchData = async () => {
            try {
            const userId=localStorage.getItem("userId");

            const res = await API.get(`/resume/${userId}`);
            const data=res?.data?.data?.resume?.text;
            setResumeText(data);
            }
            catch(err: any){
                console.log(err.message);
            }
        }
        fetchData();
    },[]);
    const handleSelect = async (template: string) => {
        try{
        setLoading(true);
        console.log(`Selected template: ${template}`);
        localStorage.setItem("selectedTemplate", template);
        route.push("/see-template");
        }
        catch(err: any){
            console.log(err.message);   
        }
        finally{
            setLoading(false);  
        }       
    }
    return (
    <div className="min-h-screen bg-[#0a0f1c] text-white px-6 py-10">

        {/* Heading */}
        <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Select Your Template</h1>
        <p className="text-gray-400 mt-2">
            Choose from a variety of professional templates to showcase your skills and experience.
        </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Card */}
        <div className="bg-[#0b1220] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
            <img
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400"
            className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
            <p className="font-semibold mb-3">Modern Template</p>
            <button
                onClick={resumeText ? () => handleSelect("Modern") : () => route.push("/add-resume")}
                className="w-full bg-blue-900 hover:bg-blue-800 py-2 rounded-lg font-semibold"
            >
                {loading ? "Loading..." : "Select"}
            </button>
            </div>
        </div>

        {/* Card */}
        <div className="bg-[#0b1220] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
            <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400"
            className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
            <p className="font-semibold mb-3">Classic Template</p>
            <button
                onClick={resumeText ? () => handleSelect("Classic") : () => route.push("/add-resume")}
                className="w-full bg-blue-900 hover:bg-blue-800 py-2 rounded-lg font-semibold"
            >
                {loading ? "Loading..." : "Select"}
            </button>
            </div>
        </div>

        {/* Card */}
        <div className="bg-[#0b1220] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
            <img
            src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400"
            className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
            <p className="font-semibold mb-3">Creative Template</p>
            <button
                onClick={resumeText ? () => handleSelect("Creative") : () => route.push("/add-resume")}
                className="w-full bg-blue-900 hover:bg-blue-800 py-2 rounded-lg font-semibold"
            >
                {loading ? "Loading..." : "Select"}
            </button>
            </div>
        </div>
            
        </div>
    </div>
    );
}
