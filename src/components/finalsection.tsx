"use client"
const translations={
  "뉴스": "News",
  "뉴욕타임즈": "New York Times",
  "강력한 보안 기능을 갖춘": "Equipped with strong security features",
  "365일 동안 무료로 시작하기": "Start free for 365 days",
  "문의하기": "Contact Us",
  "지금 시작하기 >": "Start Now >"
}
// Type-safe translation helper
type TranslationKey = keyof typeof translations;
const t = (key: TranslationKey): string => translations[key];

const newsItems = [
  {
    title: "뉴욕타임즈" as TranslationKey,
    description: "강력한 보안 기능을 갖춘" as TranslationKey,
  },
  {
    title: "뉴욕타임즈" as TranslationKey,
    description: "강력한 보안 기능을 갖춘" as TranslationKey,
  },
  {
    title: "뉴욕타임즈" as TranslationKey,
    description: "강력한 보안 기능을 갖춘" as TranslationKey,
  },
];

export default function FinalSection() {
  return (
    <div className="w-full font-sans">
      {/* News Section */}
      <section className="bg-white px-2 py-12">
        {/* Section label */}
        <p className="text-lg text-gray-400 mb-8 tracking-wide">
          {/* Display in Korean; English: {t("뉴스")} */}
          뉴스
        </p>

        {/* Three-column grid */}
        <div className="flex flex-col md:flex-row md:justify-between w-full">
          {newsItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 pb-24">
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {/* Korean display */}
                {item.title}
                {/* English: {t(item.title)} */}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {/* Korean display */}
                {item.description}
                {/* English: {t(item.description)} */}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-gray-100 px-4 md:px-16 py-10 flex items-center justify-between">
        <h2 className="mr-3 text-4xl font-black text-gray-900 tracking-tight">
          {/* Korean display: 365일 동안 <strong>무료로 시작하기</strong> */}
          <span className="font-normal">365일 동안&nbsp;</span>
          <span className="font-black">무료로 시작하기</span>
          {/* English: {t("365일 동안 무료로 시작하기")} */}
        </h2>

        <div className="flex flex-col  md:flex-row items-center gap-4">
          {/* Ghost button */}
          <button className="text-sm text-gray-700 hover:text-gray-900 transition-colors px-2 py-1">
            {/* Korean display */}
            문의하기
            {/* English: {t("문의하기")} */}
          </button>

          {/* Primary pill button */}
          <button className="bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-black transition-colors whitespace-nowrap">
            {/* Korean display */}
            지금 시작하기 &gt;
            {/* English: {t("지금 시작하기 >")} */}
          </button>
        </div>
      </section>
    </div>
  );
}