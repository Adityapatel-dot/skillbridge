import { LandingNav } from '../components/layout/LandingNav'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/landing/Hero'
import { Stats } from '../components/landing/Stats'
import { Categories } from '../components/landing/Categories'
import { FeaturedWorkers } from '../components/landing/FeaturedWorkers'
import { Testimonials } from '../components/landing/Testimonials'
import { CTA } from '../components/landing/CTA'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <Hero />
      <Stats />
      <Categories />
      <FeaturedWorkers />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
