require('dotenv').config();
const express=require("express");
const app=express();
const db=require("./db");
const cors=require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
const add=require("./src/routes/addResume");
app.use("/resume",add);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("Running");
});
