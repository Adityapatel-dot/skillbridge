import { Logo } from '../ui/Logo'

const footerLinks = {
  Platform: ['How it Works', 'Categories', 'For Workers', 'For Clients', 'Pricing'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Support: ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy', 'FAQs'],
}

export function Footer() {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-body-sm text-primary-200 mb-6 max-w-xs">
              The premium marketplace connecting skilled workers with customers who need quality service.
            </p>
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <a key={social} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all text-caption">
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-label text-white/40 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-body-sm text-white/70 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-white/40">&copy; 2026 SkillBridge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-caption text-white/40 hover:text-white/60">Privacy</a>
            <a href="#" className="text-caption text-white/40 hover:text-white/60">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
