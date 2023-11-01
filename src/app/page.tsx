import 'inter-ui/inter.css'
import "../styles/globals.css"
import HomePageHeroSection from "./_sections/hero-section"

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center mx-40">
      <HomePageHeroSection />
    </main>
  );
}


