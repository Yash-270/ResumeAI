import Link from "next/link";

export default function Footer(){
    return(
        <footer className="bg-[#0a0f1c]   px-6 py-7 border-t border-gray-900">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-5">
                    <div>

                        <div className="flex items-center gap-2">
                            <img src="https://img.icons8.com/fluency/48/artificial-intelligence.png" alt="logo" className="w-8 h-8 rounded-full" />
                            <Link href="/" className="text-white font-semibold text-lg">
                            ResumeAI
                            </Link>
                        </div>
                        <p className="text-gray-400 mt-2 max-w-sm">
                            Build professional resumes using AI. Fast, clean and optimized for success.
                        </p>
                        <ul className="mt-4 text-sm text-gray-400 space-y-1">
                            <li>• ATS Score Analysis</li>
                            <li>• GitHub Profile Insights</li>
                            <li>• AI Resume Improvements</li>
                            <li>• One-click Resume Builder</li>
                            <li>• LinkedIn Optimization</li>
                            <li>• Modern Resume Templates</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-3">Quick Links</h2>
                        <ul className="space-y-2 text-gray-400">
                            <Link href="/"><li className="hover:text-white cursor-pointer">Home</li></Link>
                            <Link href="/add-resume"><li className="hover:text-white cursor-pointer">Resume Analyze</li></Link>
                            <Link href="/template"><li className="hover:text-white cursor-pointer">Templates</li></Link>
                            <Link href="/github-analysis"><li className="hover:text-white cursor-pointer">Github Analyze</li></Link>
                            <Link href="/linkedin-analysis"><li className="hover:text-white cursor-pointer">Linkedin Analyse</li></Link>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-3">Legal</h2>
                        <ul className="space-y-2 text-gray-400">
                             <Link href="https://www.termsfeed.com/live/..." ><li className="hover:text-white cursor-pointer">Terms of Service</li></Link>
                            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-3">Contact</h2>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@resumeai.com</li>
                            <li>Support: support@resumeai.com</li>
                        </ul>
                    </div>  
                </div>
                <div className="text-center text-gray-500 mt-8 text-sm border-t border-gray-700 p-4 mt-6">
                    © 2026 ResumeAI. All rights reserved.
                </div>
        </footer>
    )
}