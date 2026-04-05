export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-[#1f2937] to-[#111827] shadow-[0_0_40px_rgba(59,130,246,0.15)]">
      <div className="rounded-2xl bg-[#0b1220] p-6 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}