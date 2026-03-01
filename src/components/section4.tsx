"use client";

import Image from "next/image";
import { useState } from "react";

// ── Text content ──────────────────────────────────────────────────────────────
export const section4Texts = {
  ko: {
    heading: "딥페이크 · 도용 · 불펌\n어떻게 대응하는지 확인하세요",
    subheading:
      "발견 된 사진의 출처가 동의없이 노출 되었다면\n셀프 혹은 소장 접수까지 연결 해드립니다",
    tabs: ["개인", "기업", "에이전시/엔터"],
    cardLabel: "발견 후 내용증명 진행",
    cardTitle: "짤로 떠돌아 다니는 내 사진",
    cardBody:
      "일반적인 검색으로는 찾기 어렵지만 투스타에서 제공되는 내용증명 서비스를 신청했고 로펌 계약이 없는 상태였지만 1/10 비용으로 빠르게 신청",
  },
  en: {
    heading: "Deepfake · Theft · Illegal Repost\nSee how we respond",
    subheading:
      "If photos of you have been shared without consent,\nwe connect you to self-help or formal legal complaint filing.",
    tabs: ["Individual", "Business", "Agency / Entertainment"],
    cardLabel: "Proof of Content After Discovery",
    cardTitle: "My photos spreading as memes",
    cardBody:
      "Hard to find through regular searches, but applied for the content verification service provided by Twostar — even without a law firm contract, filed quickly at 1/10 the cost.",
  },
};

// ── Mock UI data shown in the card ───────────────────────────────────────────
const tableRows = [
  { id: 1, dept: "Operations", cat: "Salaries", budget: 126845 },
  { id: 2, dept: "Operations", cat: "Software", budget: 21200 },
  { id: 3, dept: "Sales & Marketing", cat: "Contractors", budget: 15738 },
  { id: 4, dept: "Customer Support", cat: "Misc", budget: 4859 },
  { id: 5, dept: "Customer Support", cat: "Misc", budget: 24938 },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Section4() {
  const [activeTab, setActiveTab] = useState(0);
  const t = section4Texts.ko;

  return (
    <section className="bg-white py-20 px-4 w-full">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight whitespace-pre-line tracking-tight">
          {t.heading}
        </h2>
        <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {t.subheading}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-full p-1 gap-1">
          {t.tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-2 rounded-full  text-sm font-semibold transition-all duration-200 ${
                activeTab === i
                  ? "bg-white text-gray-900 border border-gray-300 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full mx-auto overflow-hidden">
        <div className="flex flex-col w-full md:flex-row items-stretch min-h-[420px]">
            <div className=" relative fc ">
                <Image src="/i2.png" alt="sample2" height={720} width={720}/>
            </div>

         

          {/* Right — text */}
          <div className="md:w-72 flex flex-col justify-center px-8 py-10 md:py-0 flex-1">
            <p className="text-md font-semibold text-gray-700  uppercase mb-3">
              {t.cardLabel}
            </p>
            <h3 className="text-3xl font-black text-gray-900 leading-snug mb-4">
              {t.cardTitle}
            </h3>
            <p className="text-lg text-gray-600 font-semibold leading-relaxed">{t.cardBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}