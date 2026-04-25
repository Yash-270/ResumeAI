require("dotenv").config();
const express=require("express");
const Job = require("../models/resume");
const upload = require("../config/multer");
const cloudinary = require("../utils/cloudinary");
const router=express.Router();
const pdfParse=require("pdf-parse");
const axios = require("axios");
//const OpenAI = require("openai");

//const { GoogleGenerativeAI } = require("@google/generative-ai");
const streamifier = require("streamifier");
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateATS = (text) => {
  let score = 0;
  text = text.toLowerCase();

  // 🔹 1. Skills (20)
  const skills = ["react", "node", "mongodb", "python", "java"];
  const skillMatches = skills.filter(s => text.includes(s)).length;
  score += Math.min(skillMatches * 4, 20);

  // 🔹 2. Projects (25)
  const projectCount = (text.match(/project/g) || []).length;
  score += Math.min(projectCount * 5, 25);

  // 🔹 3. Experience (20)
  if (text.includes("intern") || text.includes("experience")) {
    score += 20;
  }

  // 🔹 4. Certifications (10)
  if (text.includes("certification") || text.includes("certificate")) {
    score += 10;
  }

  // 🔹 5. DSA / Problem solving (5)
  if (
    text.includes("leetcode") ||
    text.includes("dsa") ||
    text.includes("data structures")
  ) {
    score += 5;
  }

  // 🔹 6. Keywords (10)
  const keywords = ["api", "backend", "frontend", "database", "deployment"];
  const keywordMatches = keywords.filter(k => text.includes(k)).length;
  score += Math.min(keywordMatches * 2, 10);

  // 🔹 7. Impact (10)
  const numbers = text.match(/\d+%|\d+\+/g);
  if (numbers) {
    score += Math.min(numbers.length * 2, 10);
  }

  return Math.min(score, 100);
};
router.post("/add",upload.single("file"),async (req,res)=>{
    try{
        const userId=req.body.userId;
        console.log("HIT API");
        console.log("FILE:", req.file);
        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔥 Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
        //const fileBuffer=fs.readFileSync(req.file.path);
        const data = await pdfParse(req.file.buffer);
        const resumeText=data.text;
        console.log("resumeText",resumeText);
        const githubMatch=resumeText.match(/github\.com\/([a-zA-Z0-9_-]+)/);
        const githubUsername=githubMatch ? githubMatch[1] : "";
        const linkedinMatch=resumeText.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
        const linkedinUsername=linkedinMatch ? linkedinMatch[1] : "";
        const ats = calculateATS(resumeText);

        //const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const rest = await model.generateContent(`
        // You are an AI resume analyzer.

        // Analyze the resume below and return ONLY valid JSON.

        // Resume:
        // ${resumeText}

        // Return strictly in this format:
        // {
        // "skills": [],
        // "missing_skills": [],
        // "summary": "",
        // "suggestions": []
        // }
        // `);

        // const text = rest.response.text();

        

  const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                    text: `
        You are an expert-level AI Resume Analyzer  and Resume Parser  used by recruiters and hiring managers.

        Analyze the resume deeply and AND also convert it into structured JSON and return ONLY JSON (no extra text).

        Focus on actionable insights, real hiring signals, and ATS optimization.
        
        - Do NOT return empty strings, null, or empty objects in arrays
        - Only include meaningful content in skills, projects, experience, education
        Resume:
        ${resumeText}

        
        Important:
        - Same input must ALWAYS give same score
        - No randomness
        - Only use given data
        Return strictly in this format:

        Return strictly in this format:

        {
        "parsed_resume": {
            "name": "",
            "email": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "summary": "",
            "skills": [],
            "projects": [],
            "experience": [],
            "education": []
        },
        "analysis": {
            "strengths": [
                "Key strengths aligned with industry expectations"
            ],

            "weaknesses": [
                "Critical gaps impacting hiring decisions"
            ],

            "missing_skills": [
                "High-demand skills currently absent"
            ],

            "improvement_actions": [
                "Clear, actionable steps to enhance resume impact"
            ],

            "market_fit": "Roles and domains this profile is best suited for",

            "project_evaluation": "Quality and effectiveness of projects with improvement insights",

            "ats_optimization": [
                "Keyword gaps, formatting issues, and ATS-related improvements"
            ],

            "impact_score": number(0-100),

            "final_verdict": "Short expert-level hiring verdict (e.g. Strong candidate with minor gaps / Needs significant improvement)"
            }
         }
            `
                }
                ]
            }
            ]
        }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        let parsedData = {};
        let analysis = {};
        let cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        try {
            const json = JSON.parse(cleanText);
            parsedData = json.parsed_resume || {};
            analysis = json.analysis || {};
            const cleanArray = (arr) => {
            if (!Array.isArray(arr)) return [];
            return arr.filter(item => {
                if (!item) return false;
                if (typeof item === "string") return item.trim() !== "";
                if (typeof item === "object") return Object.keys(item).length > 0;
                return false;
            });
            };

            parsedData.skills = cleanArray(parsedData.skills);
            parsedData.projects = cleanArray(parsedData.projects);
            parsedData.experience = cleanArray(parsedData.experience);
            parsedData.education = cleanArray(parsedData.education);
        } catch {
            parsedData = {};

        analysis = {
            strengths: [],
            weaknesses: [],
            missing_skills: [],
            improvement_actions: [],
            market_fit: "",
            project_evaluation: "",
            ats_optimization: [],
            impact_score: 0,
            final_verdict: ""    
        };
        }
        // const aiRes = await client.chat.completions.create({
        // model: "gpt-4o-mini",
        // messages: [
        //     {
        //     role: "user",
        //     content: `
        //     Analyze this resume and return JSON:

        //     Resume:
        //     ${resumeText}

        //     Give:
        //     {
        //         "skills": [],
        //         "missing_skills": [],
        //         "summary": "",
        //         "suggestions": []
        //     }
        //     `
        //     }
        // ],
        // });

        // let analysis;

        // try {
        // analysis = JSON.parse(aiRes.choices[0].message.content);
        // } catch (err) {
        // console.log("Parse error", err);
        // analysis = { summary: aiRes.choices[0].message.content };
        // }

        // const newData = new Job({
        //     userId,
        //     resume: {
        //         url: result.secure_url,
        //         public_id: result.public_id,
        //         text: parsedData,   
        //         raw_text: resumeText,
        //         analysis: {
        //             github: githubUsername,
        //             linkedin: linkedinUsername,
        //             // github_score: analysis.github_score || 0,
        //             // linkedin_score: analysis.linkedin_score || 0,
        //             ats_score: Number(ats) || 0,
        //             strengths: analysis.strengths || [],
        //             weaknesses: analysis.weaknesses || [],
        //             missing_skills: analysis.missing_skills || [],
        //             improvement_actions: analysis.improvement_actions || [],
        //             market_fit: analysis.market_fit || "",
        //             project_evaluation: analysis.project_evaluation || "",
        //             ats_optimization: analysis.ats_optimization || [],
        //             impact_score: Number(analysis.impact_score) || 0,
        //             final_verdict: analysis.final_verdict || ""
        //         }
        //     }
        // });
        // await newData.save();
        const newData = await Job.findOneAndUpdate(
    { userId },
    {
        userId,
        resume: {
            url: result.secure_url,
            public_id: result.public_id,
            text: parsedData,
            raw_text: resumeText,
            analysis: {
                github: githubUsername,
                linkedin: linkedinUsername,
                ats_score: Number(ats) || 0,
                strengths: analysis.strengths || [],
                weaknesses: analysis.weaknesses || [],
                missing_skills: analysis.missing_skills || [],
                improvement_actions: analysis.improvement_actions || [],
                market_fit: analysis.market_fit || "",
                project_evaluation: analysis.project_evaluation || "",
                ats_optimization: analysis.ats_optimization || [],
                impact_score: Number(analysis.impact_score) || 0,
                final_verdict: analysis.final_verdict || ""
            }
        },
        githubData: null,
        linkedinData: null,
        jobMatch: null,
        improvedResume: null
    },
    { upsert: true, returnDocument: 'after' }
);

res.status(200).json({
    success: true,
    message: "Resume is Analyzed",
    resume: newData
});
    }
    catch(err){
        console.log("Error: ",err);
        res.status(500).json({ message: err.message });
    }
})
router.get("/:userId", async (req, res) => {
  try {
    const data = await Job.find({ userId: req.params.userId })
    .sort({ createdAt: -1 })
    .limit(1)
    .then(results => results[0]);

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({ data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/chat",async(req,res)=>{
    try{
        const {question,resume, gitData,linkData,jobMatch,improve}=req.body;
        const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                   text: `
                    You are a modern AI resume assistant with a smart, slightly GenZ tone.

                    User Question:
                    ${question}

                    Resume Data:
                    ${JSON.stringify(resume)}

                    GitHub Analysis:
                    ${JSON.stringify(gitData)}

                    LinkedIn Analysis:
                    ${JSON.stringify(linkData)}

                    Job Match Data:
                    ${JSON.stringify(jobMatch)}

                    Improvement Data:
                    ${JSON.stringify(improve)}

                    Instructions:
                    - Answer in a clean, structured, engaging way
                    - Use light emojis (⚡ 🚀 ✅ ❌), not too many
                    - Medium length response (not too short, not too long)
                    - Use bullet points, avoid long paragraphs
                    - No markdown symbols like ** or ###

                    Question Handling Rules:

                    1. If the question is completely unrelated:
                    Reply:
                    "⚠️ That’s outside your resume context 😅  
                    Ask me something about your resume, skills, or career — I got you 🚀"

                    2. If the question is generic career doubt (like “will I get a job?”):
                    - Answer practically using ALL available data (resume + github + linkedin + job match)
                    - No fake motivation
                    - Be honest and helpful

                    3. If the question is resume-related:
                    - Use all data sources for better answer
                    - Give actionable improvements

                    4. If something is missing:
                    - Clearly point it out

                    Format:

                    🚀 Answer:
                    - point 1
                    - point 2
                    - point 3

                    💡 Suggestions:
                    - actionable improvement 1
                    - actionable improvement 2

                    🔥 Reality Check:
                    1 honest, practical line
                    `
                }
            ]
        }
    ]
})
    let answer =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    answer = answer.replace(/```json/g, "").replace(/```/g, "").trim();
  res.json({ answer });
   } catch(err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/github",async(req,res)=>{
    try{
    const userId=req.body.userId;
    console.log("userId from body:", userId);
    console.log("userId type:", typeof userId);
    const {username}=req.body;
    const githubRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);

    const githubData = {
    followers: githubRes.data.followers,
    public_repos: githubRes.data.public_repos,
    following: githubRes.data.following,
    repos: reposRes.data.slice(0, 10).map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language
    }))
    };
    const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                    text: `
                    You are an expert GitHub profile reviewer.

                    Analyze this REAL GitHub data:

                    ${JSON.stringify(githubData)}

                    Rules:
                    - Return SHORT, SIMPLE, easy-to-understand output
                    - Avoid complex words
                    - Be practical and useful for beginners
                    - Base everything on the given data (no guessing)
                    
                    
                    Important:
                    - Same input must ALWAYS give same score
                    - No randomness
                    - Only use given data

                    Return ONLY JSON:
                    {
                    "github_score": number (0-100),

                    "summary": "2 lines overall review",

                    "key_strengths": [
                        "top strengths (max 4)"
                    ],

                    "critical_issues": [
                        "major problems hurting profile (max 4)"
                    ],

                    "top_recommendations": [
                        "high impact fixes (max 5)"
                    ],

                    "project_quality": "Low | Medium | High",

                    "activity_level": "Low | Medium | High"
                    }
                    `
                }
            ]
        }
    ]
})
    let ans =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    ans = ans.replace(/```json/g, "").replace(/```/g, "").trim();
    let git=JSON.parse(ans);  
    await Job.findOneAndUpdate(
    { userId },
    { githubData: git },
    { returnDocument: 'after' }
    );

    res.json({ git });
     } catch(err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ message: err });
    }

});

router.post("/linkedin",async(req,res)=>{
    try{
    const userId=req.body.userId;
    console.log("userId from body:", userId);
    console.log("userId type:", typeof userId);
    const {linkusername}=req.body;
    const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                    text: `
                    You are a top-level LinkedIn profile reviewer used by recruiters.

                    LinkedIn URl: ${linkusername}

                    Your job is to simulate a full LinkedIn audit like premium tools.

                    Analyze ALL aspects:
                    - Headline quality
                    - About (bio/summary)
                    - Experience section
                    - Skills & endorsements
                    - Profile completeness
                    - Activity (posts, engagement)
                    - Recruiter visibility
                    - Keywords & ATS optimization

                    Rules:
                    - Keep language SIMPLE and easy to understand
                    - Be practical (no generic advice)
                    - Give insights that actually help user get interviews
                    - Avoid complex words
                    
                    
                    Important:
                    - Same input must ALWAYS give same score
                    - No randomness
                    - Only use given data


                    Return ONLY JSON:

                    {
                    "linkedin_score": number (0-100),

                    "summary": "2 line profile review",

                    "profile_strength": [
                        "strong areas (max 4)"
                    ],

                    "missing_elements": [
                        "what is missing (max 4)"
                    ],

                    "improvement_actions": [
                        "clear steps to improve (max 5)"
                    ],

                    "profile_quality": "Low | Medium | High",
                
                    "visibility_score": number (0-100),

                    "engagement_level": "Low | Medium | High",

                    "keyword_optimization": ["missing keywords for jobs"],

                    "headline_suggestion": "improved headline example",

                    "about_suggestion": "short improved bio"
                    }
                     `
                }
            ]
        }
    ]
});
    let ans =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    ans = ans.replace(/```json/g, "").replace(/```/g, "").trim();
    let linkedin=JSON.parse(ans);
    await Job.findOneAndUpdate(
    { userId },
    {  linkedinData: linkedin },
   { returnDocument: 'after' }
    )
    res.json({ linkedin });
     } catch(err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ message: err.message });
    }

});
router.post("/match",async(req,res)=>{
    try{
        const userId=req.body.userId;
        const {match,resumeText}=req.body;
        const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                    text: `
                    You are an expert career assistant.

                    Analyze Resume: ${JSON.stringify(resumeText)} and Job Description: ${match}.
                    Rules:
                    - DO NOT guess score
                    - Calculate score using this method:

                    Scoring:
                    - Skill Match = 50%
                    - Experience/Projects relevance = 30%
                    - Keywords/ATS match = 20%

                    Steps:
                    1. Identify required skills from job description
                    2. Match them with resume
                    3. Calculate percentage match
                    4. Return FINAL consistent score

                    Important:
                    - Same input must ALWAYS give same score
                    - No randomness
                    - Only use given data

                    Return ONLY VALID JSON.
                    No explanation outside JSON.

                    Keep answers SHORT, PRECISE, ACTIONABLE.

                    Format:
                    {
                    "match_score": number (0-100),

                    "summary": "max 2 lines",

                    "matched_skills": ["only important skills"],

                    "missing_skills": ["only critical missing skills"],

                    "action_plan": [
                        "clear actionable steps (max 5)"
                    ],

                    "priority_improvements": [
                        "highest impact improvements first"
                    ]
                    }
                    `
                }
            ]
        }
    ]
})
    let ans =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    ans = ans.replace(/```json/g, "").replace(/```/g, "").trim();
    let jd=JSON.parse(ans);
    await Job.findOneAndUpdate(
    { userId },
    { jobMatch: jd },
    { returnDocument: 'after' }
);
  res.json({ jd });
   } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/improve",async(req,res)=>{
    try{
    const userId=req.body.userId;
    const {result,resumeText}=req.body;
    const response = await axios.post(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [
                {
                    text: `
                    You are a world-class Resume Writer who creates top 1% ATS-optimized resumes.

                    Resume Analysis:
                    ${JSON.stringify(result)}

                    Original Resume:
                    ${resumeText}

                    Your goal:
                    Transform this into a highly professional, ATS-optimized resume that maximizes interview chances.

                    STRICT RULES:
                    - NEVER generate fake information
                    - NEVER invent name, email, github, linkedin
                    - Only extract what is present in the resume
                    - Always produce a complete resume (never leave sections empty)
                    - If any data is missing (name, experience, etc.), intelligently infer or create realistic placeholders
                    - NEVER say "not provided" or "missing"
                    - Make the candidate look strong even if experience is low
                    - Focus on impact, clarity, and recruiter appeal

                    FORMAT RULES:
                    - Use clear sections:
                    Name
                    Email 
                    Phone
                    Github
                    Linkedin
                    Summary
                    Skills
                    Projects
                    Experience (if not present, convert projects into experience-style points)
                    Education

                    - Use bullet points (-)
                    - Each point must be short, impactful, and action-oriented
                    - Add measurable impact wherever possible (%, performance, scale)
                    - Use strong action verbs (Built, Developed, Optimized, Engineered)

                    ATS OPTIMIZATION:
                    - Include relevant keywords (React, Node.js, APIs, etc.)
                    - Keep formatting simple and ATS-friendly
                    - Avoid complex symbols

                    IMPORTANT:
                    - Make it look like a strong candidate (even if beginner)
                    - Do NOT exaggerate unrealistically
                    - Keep it believable but impressive
                    -projects, experience, skills, education arrays must contain ONLY plain strings. Never return objects inside arrays.

                    Return ONLY JSON:

                    {
                    "name": "Full Name",
                    "email": "professional@email.com",
                    "phone": "+91XXXXXXXXXX",
                    "github": "https://github.com/username",
                    "linkedin": "https://www.linkedin.com/in/username",
                    "summary": "2-3 lines strong professional summary",
                    "skills": ["skill1", "skill2", "skill3"],
                    "projects": ["bullet point", "bullet point"],
                    "experience": ["bullet point", "bullet point"],
                    "education": ["degree, college"]
                    }
                    `

                }
            ]
        }
    ]
});
    let ans =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    ans = ans.replace(/```json/g, "").replace(/```/g, "").trim();
    let improvedResume;
    try {
    improvedResume = JSON.parse(ans);
    improvedResume = JSON.parse(ans);

// ✅ ye add karo - objects ko strings mein convert karo
const flattenArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
            return Object.values(item).filter(Boolean).join(" — ");
        }
        return String(item);
    });
};

improvedResume.projects = flattenArray(improvedResume.projects);
improvedResume.experience = flattenArray(improvedResume.experience);
improvedResume.skills = flattenArray(improvedResume.skills);
improvedResume.education = flattenArray(improvedResume.education);
    } catch (err) {
    console.log("Parse failed:", err);

    // 🔥 fallback structure
    improvedResume = {
        name: "Candidate",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
        summary: ans,
        skills: [],
        projects: [],
        experience: [],
        education: []
    };
    }

    const x=await Job.findOneAndUpdate(
    { userId },
    { improvedResume },
    { returnDocument: 'after' }
    );

    console.log("Saved",x?.imporvedResume?.name);

    res.json({ improvedResume });
}
 catch(err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports=router;