export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white text-3xl font-bold">R</span>
          </div>
          
          {/* Spinner ring */}
          <div className="absolute inset-0 w-20 h-20 -m-2 mx-auto border-4 border-[#E54A4A]/20 border-t-[#E54A4A] rounded-full animate-spin" />
        </div>
        
        <p className="mt-6 text-[#1a1a1a]/60 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

