"use client";

const footerLinks = {
  styles: [
    { name: 'Top Down', href: '#work' },
    { name: 'Product', href: '#work' },
    { name: 'Diagonal', href: '#work' },
    { name: 'Lifestyle', href: '#work' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Process', href: '#process' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ],
  rush: [
    { name: 'Rush.graphics', href: 'https://rushgraphics.com', active: false },
    { name: 'Rush.vision', href: '#', active: false },
    { name: 'Rush.photos', href: '#', active: true },
    { name: 'Rush.videos', href: '#', active: false },
  ],
};

export default function Footer() {
  return (
    <footer className="py-16 bg-[#1a1a1a]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Rush</span>
                <span className="text-[#E54A4A] font-bold text-lg">.photo</span>
              </div>
            </a>
            <p className="text-white/40 text-sm mb-6 max-w-xs">
              Professional product photography for brands that want to stand out.
            </p>
            <a href="mailto:hello@rush.photos" className="text-[#E54A4A] text-sm font-medium hover:underline">
              hello@rush.photos
            </a>
          </div>

          {/* Styles */}
          <div>
            <h4 className="text-white font-semibold mb-5">Styles</h4>
            <ul className="space-y-3">
              {footerLinks.styles.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 text-sm hover:text-[#E54A4A] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 text-sm hover:text-[#E54A4A] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Rush Family */}
          <div>
            <h4 className="text-white font-semibold mb-5">Rush Family</h4>
            <ul className="space-y-3">
              {footerLinks.rush.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className={`text-sm transition-colors ${link.active ? 'text-[#E54A4A] font-medium' : 'text-white/50 hover:text-[#E54A4A]'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-semibold mb-5">Location</h4>
            <address className="not-italic text-white/50 text-sm space-y-1">
              <p>1122 Goffle Rd.</p>
              <p>Hawthorne, NJ 07506</p>
              <a href="tel:973-427-9393" className="block hover:text-[#E54A4A] transition-colors mt-3">
                973-427-9393
              </a>
            </address>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Rush Photos. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 text-sm hover:text-[#E54A4A] transition-colors">Privacy</a>
            <a href="#" className="text-white/30 text-sm hover:text-[#E54A4A] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
