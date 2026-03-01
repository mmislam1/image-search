"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  image: string;
  quote: string;
  author: string;
  role: string;
  rating: number; // out of 5, shown as filled dots
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: "/icon1.svg",
    quote:
      "전혀 예상하지 못한 곳에서 발견 된 내 사진은 수익이 증가했고, 처리 시간이단축되어 결과가 폭발적으로 늘었습니다.",
    author: "김지현",
    role: "설립자",
    rating: 4,
  },
  {
    id: 2,
    image: "/icon2.svg",
    quote:
      "서비스를 도입한 이후로 저작권 침해 사례가 눈에 띄게 줄었습니다. 정말 믿을 수 있는 탐지 솔루션입니다.",
    author: "이민준",
    role: "크리에이티브 디렉터",
    rating: 5,
  },
  {
    id: 3,
    image: "/icon3.svg",
    quote:
      "정확성이 뛰어나고 처리 속도가 빠릅니다. 우리 팀의 업무 효율이 두 배 이상 향상되었어요.",
    author: "박서연",
    role: "CTO",
    rating: 5,
  },
];

const TOTAL_DOTS = 17;
const AUTO_PLAY_INTERVAL = 6000;

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [displayed, setDisplayed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayed(index);
        setCurrent(index);
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    const nextIndex = (current + 1) % testimonials.length;
    goTo(nextIndex, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    const prevIndex = (current - 1 + testimonials.length) % testimonials.length;
    goTo(prevIndex, "prev");
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
  }, [next]);

  const handleNext = () => {
    next();
    resetTimer();
  };

  const handlePrev = () => {
    prev();
    resetTimer();
  };

  const testimonial = testimonials[displayed];

  const slideClass = isAnimating
    ? direction === "next"
      ? "opacity-0 translate-x-4"
      : "opacity-0 -translate-x-4"
    : "opacity-100 translate-x-0";

  return (
    <section className="w-full py-16 px-2 font-[Pretendard,_'Noto_Sans_KR',_sans-serif]">
      {/* Title */}
      <h2 className="text-center text-4xl font-black tracking-tight text-gray-900 mb-10">
        신뢰할 수 있는 정확한 탐지
      </h2>

      {/* Card */}
      <div className="w-full mx-auto overflow-hidden px-2 "
        style={{
          background: "linear-gradient(135deg, #ead8fd 0%, #ffdcef 30%, #fff7d8 60%, #ffdff1 90%, #ecdaff 100%)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">

          {/* Left — Image + Nav */}
          <div className="relative flex flex-col items-center justify-center p-10 gap-6">
            {/* Image */}
            <div
              className={`transition-all duration-500 ease-in-out ${slideClass} w-62 h-62 md:w-92 md:h-92  overflow-hidden`}
            >
              <div className="w-full h-full bg-white/30 flex items-center justify-center text-white/60 text-sm tracking-widest">
                {/* Replace with real <Image /> when images are available */}
                 <Image src={testimonial.image} alt={testimonial.author} fill className="object-cover" />
                
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="w-9 h-9 rounded-full bg-white/50 hover:bg-white/80 transition-all flex items-center justify-center text-gray-700 hover:scale-105 active:scale-95"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="w-9 h-9 rounded-full bg-white/50 hover:bg-white/80 transition-all flex items-center justify-center text-gray-700 hover:scale-105 active:scale-95"
              >
                →
              </button>
            </div>
          </div>

          {/* Right — Quote */}
          <div
            className="relative flex-1 flex flex-col justify-center p-8 md:p-10 m-3 bg-white/60"
           
          >
            {/* Top dots */}
            <Dots total={TOTAL_DOTS} filled={current + 1} position="top" />

            {/* Quote mark */}
            <div className="text-4xl font-gray-600 text-gray-700/80 leading-none mb-3 mt-4">
              ❝
            </div>

            {/* Quote text */}
            <div
              className={`transition-all duration-500 ease-in-out ${slideClass}`}
            >
              <p className="text-gray-700 text-base md:text-2xl font-semibold leading-relaxed mb-6">
                {testimonial.quote}
              </p>
            </div>

            {/* Bottom dots */}
            <Dots total={TOTAL_DOTS} filled={current + 1} position="bottom" />

            {/* Author */}
            <div
              className={`mt-3 transition-all duration-500 ease-in-out ${slideClass}`}
            >
              <p className="text-md text-gray-600 font-semibold">{testimonial.author}</p>
              <p className="text-md text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i, i > current ? "next" : "prev");
              resetTimer();
            }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-pink-400"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function Dots({
  total,
  filled,
  position,
}: {
  total: number;
  filled: number;
  position: "top" | "bottom";
}) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${
            i < filled
              ? position === "top"
                ? "bg-pink-400/70"
                : "bg-purple-400/70"
              : "border border-gray-400/60"
          }`}
        />
      ))}
    </div>
  );
}