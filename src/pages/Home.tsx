import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import ServicePreview from '../components/home/ServicePreview'
import ProfileTeaser from '../components/home/ProfileTeaser'
import Packages from '../components/home/Packages'
import CTASection from '../components/home/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ServicePreview />
      <ProfileTeaser />
      <Packages />
      <CTASection />
    </>
  )
}
