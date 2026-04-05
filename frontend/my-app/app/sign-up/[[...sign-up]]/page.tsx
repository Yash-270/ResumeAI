import { SignUp } from "@clerk/nextjs"
export default function Signup(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
      <SignUp
      />
    </div>
  );
}