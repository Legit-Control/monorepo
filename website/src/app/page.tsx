import PageGrid from "@/components/Grid";
import Features from "@/components/sections/Features";
import HandsOn from "@/components/sections/HandsOn";
import Hero from "@/components/sections/Hero";

const HomePage = () => {
  return <PageGrid>
    <div className="min-h-[100vh]">
      <Hero />
      <Features />
      <HandsOn />
    </div>
  </PageGrid>;
};

export default HomePage;
