const mongoose=require("mongoose");
const jobSchema=mongoose.Schema({
    userId: String,
    resume: {
        url:{
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true
        },
        text:{
            type: Object,
        },
        raw_text:{
            type: String,
        },
        analysis:{
            github:String,
            linkedin:String,
            ats_score: Number,
            strengths: [String],
            weaknesses: [String],
            missing_skills: [String],
            improvement_actions: [String],
            market_fit: String,
            project_evaluation: String,
            ats_optimization: [String],
            impact_score: Number,
            final_verdict: String    
        }
    },
    githubData: Object,
    linkedinData: Object,
    jobMatch: Object,
    improvedResume: Object
}, { timestamps: true });
const Job=mongoose.model("Job",jobSchema);
module.exports=Job;