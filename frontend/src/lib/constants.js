import {
  Zap,
  Wrench,
  Hammer,
  Truck,
  Sparkles,
  Paintbrush,
  Settings,
  Cpu,
} from 'lucide-react'

export const CATEGORIES = [
  { id: 'electricians', name: 'Electricians', icon: Zap, description: 'Wiring, repairs, installations', color: 'from-yellow-400 to-orange-500', count: '248' },
  { id: 'plumbers', name: 'Plumbers', icon: Wrench, description: 'Pipes, fixtures, drainage', color: 'from-blue-400 to-cyan-500', count: '186' },
  { id: 'carpenters', name: 'Carpenters', icon: Hammer, description: 'Furniture, framing, finishing', color: 'from-amber-400 to-orange-500', count: '134' },
  { id: 'drivers', name: 'Drivers', icon: Truck, description: 'Transport, delivery, logistics', color: 'from-green-400 to-emerald-500', count: '312' },
  { id: 'cleaners', name: 'Cleaners', icon: Sparkles, description: 'Home, office, deep cleaning', color: 'from-sky-400 to-indigo-500', count: '203' },
  { id: 'painters', name: 'Painters', icon: Paintbrush, description: 'Interior, exterior, finishing', color: 'from-pink-400 to-rose-500', count: '97' },
  { id: 'mechanics', name: 'Mechanics', icon: Settings, description: 'Auto repair, maintenance', color: 'from-violet-400 to-purple-500', count: '156' },
  { id: 'technicians', name: 'Technicians', icon: Cpu, description: 'IT, electronics, smart home', color: 'from-teal-400 to-cyan-500', count: '178' },
]

export const FEATURED_WORKERS = [
  { id: 1, name: 'James Wilson', role: 'Master Electrician', rating: 4.9, jobs: 347, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', skills: ['Wiring', 'Smart Home', 'Panel Upgrades'] },
  { id: 2, name: 'Sarah Chen', role: 'Certified Plumber', rating: 4.8, jobs: 289, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', skills: ['Pipe Repair', 'Installation', 'Drainage'] },
  { id: 3, name: 'Marcus Johnson', role: 'Master Carpenter', rating: 4.9, jobs: 412, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', skills: ['Custom Furniture', 'Cabinetry', 'Framing'] },
  { id: 4, name: 'Elena Rodriguez', role: 'Professional Cleaner', rating: 4.7, jobs: 523, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', skills: ['Deep Clean', 'Office', 'Eco-Friendly'] },
]

export const TESTIMONIALS = [
  { id: 1, name: 'David Park', role: 'Homeowner', content: 'SkillBridge made finding an electrician effortless. I had a quote within minutes and the work was completed the same day. The quality was exceptional.', rating: 5, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'Lisa Thompson', role: 'Property Manager', content: 'We manage 50+ properties and SkillBridge has been a game-changer. The platform is intuitive, workers are vetted, and the messaging system keeps everything organized.', rating: 5, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Michael Torres', role: 'Business Owner', content: 'As a business owner, I need reliable workers fast. SkillBridge delivers every time. The transparency in pricing and worker ratings gives me complete confidence.', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
]

export const STATS = [
  { value: '50K+', label: 'Active Workers' },
  { value: '100K+', label: 'Jobs Completed' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '15min', label: 'Average Response' },
]

export const SIDEBAR_ITEMS = {
  customer: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'marketplace', label: 'Find Workers', icon: 'Search' },
    { id: 'my-jobs', label: 'My Jobs', icon: 'Briefcase' },
    { id: 'requests', label: 'Work Requests', icon: 'Send' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  worker: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'marketplace', label: 'Find Jobs', icon: 'Search' },
    { id: 'job-map', label: 'Job Map', icon: 'MapPin' },
    { id: 'my-jobs', label: 'My Jobs', icon: 'Briefcase' },
    { id: 'applications', label: 'Applications', icon: 'FileText' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'jobs', label: 'Jobs', icon: 'Briefcase' },
    { id: 'disputes', label: 'Disputes', icon: 'Scale' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
}
