"use client"

import Image from "next/image";
import Link from "next/link";
  import { useEffect, useRef, useState } from "react";
  import TrustedCompanies from "@/components/trustedCompanies";
import Section3 from "@/components/section3";
import Section4 from "@/components/section4";
import TestimonialSlider from "@/components/testimonialSlider";



export default function Home() {






const secondary= { label: "문의하기",     href: "/contact" }
const primary= { label: "무료로 시작 >", href: "/signup"  }

  return (
    <div className="w-full fc ">
      <div className="w-full md:min-w-7xl fc flex-col max-w-7xl md:px-10">


        {/*   section 1   */}

        <div className="flex flex-col-reverse p-2 md:flex-row md:my-10 w-full md:gap-12">
          <div className="flex flex-col w-full md:w-[55%] md:h-[350px]">
            <h1 className="font-semibold text-2xl md:text-5xl my-14">역추적 검색엔진은
쉬지않고 당신의 이미지를
발견합니다 </h1>
            <p className="">회사 도구와 연결하고 데이터 보안을 유지하고 팀이 진행하는 모든 프로젝트를 개선하세요. 여러분이 아는 챗피티기가 업무용으로 설계 되었습니다.</p>

            <div className="w-full md:w-[55%] my-10 fc gap-2">
                  <Link
                    href={secondary.href}
                    className="px-4 py-[7px] text-[13px] font-medium text-gray-700 border border-gray-300 rounded-full hover:border-gray-500 hover:text-gray-950 transition-all duration-200"
                  >
                    {secondary.label}
                  </Link>
                  <Link
                    href={primary.href}
                    className="px-4 py-[7px] text-[13px] font-medium text-white bg-gray-950 rounded-full hover:bg-black transition-colors duration-200 whitespace-nowrap"
                  >
                    {primary.label}
                  </Link>
                </div>
          </div>
          <div className=" w-full md:w-[45%] md:min-h-[350px]">
            <img className="md:my-14" src="i1.svg" alt="image sample" />
          </div>
        </div>



        <TrustedCompanies/>


        <Section3/>


        <Section4/>


        <TestimonialSlider/>


      </div>

    </div>
  );
}
