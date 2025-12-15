export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="text-center relative z-10">
        <div className="relative">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-honey to-honey/80 rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-black text-3xl font-bold">R</span>
          </div>
          
          {/* Spinner ring */}
          <div className="absolute inset-0 w-20 h-20 -m-2 mx-auto border-4 border-honey/20 border-t-honey rounded-full animate-spin" />
        </div>
        
        <p className="mt-6 text-white/60 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
