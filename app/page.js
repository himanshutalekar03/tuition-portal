// app/page.js

import TopperSection from "@/components/TopperSection";
import FounderSection from "@/components/FounderSection";
import HeroSection from "@/components/HeroSection";
import TeachersSection from "@/components/TeacherSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <>
      <Navbar/>
      <FounderSection/>
      <HeroSection/>
      <TopperSection/> 
       <TeachersSection/>
       <Footer/>
    </>


  );
}