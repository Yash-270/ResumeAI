"use client";
import Classic from "@/Components/Classic";
import Creative from "@/Components/Creative";
import Modern from "@/Components/Modern";
import API from "@/lib/axios";
import { useEffect, useState } from "react"

export default function SeeTemplate(){
  const [template, setTemplate] = useState("");
    const[resumeText,setResumeText]=useState<any>(null);
  useEffect(()=>{
    const fetchData = async () => {
        try {
        const userId=localStorage.getItem("userId");

        const res = await API.get(`/resume/${userId}`);
        const data=res?.data?.data?.resume?.text;
        setResumeText(data);

         const t = localStorage.getItem("selectedTemplate");
         if(t) setTemplate(t);
        }
        catch(err: any){
            console.log(err.message);
        }
    }
   fetchData();
  },[]);

  
  if (!resumeText)return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg ">Loading Template...</p>
        </div>
    )
  return (
    <div className="p-6 text-white">

      {template === "Modern" && <Modern data={resumeText} />}
      {template === "Classic" && <Classic data={resumeText} />}
      {template === "Creative" && <Creative data={resumeText} />}

    </div>
  );
}