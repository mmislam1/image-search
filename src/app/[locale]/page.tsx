//"use client"

import Image from "next/image";
import Link from "next/link";
  //import { useEffect, useRef, useState } from "react";
  import TrustedCompanies from "@/components/trustedCompanies";
import Section3 from "@/components/section3";
import Section4 from "@/components/section4";
import TestimonialSlider from "@/components/testimonialSlider";
import BlogSection from "@/components/blogsection";
import FinalSection from "@/components/finalsection";
import Section1 from "@/components/section1";



export default function Home() {




  return (
    <div className="w-full fc ">
      <div className="w-full fc flex-col max-w-7xl md:px-10">


        {/*   section 1   */}

        
        <Section1/>


        <TrustedCompanies/>


        <Section3/>


        <Section4/>


        <TestimonialSlider/>


        <BlogSection/>


        <FinalSection/>


      </div>

    </div>
  );
}
