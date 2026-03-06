"use client";

// ─── Korean → English text map ───────────────────────────────────────────────
const i18n: Record<string, string> = {
  "블로그": "Blog",
  "콘텐츠의 미래": "The Future of Content",
  "투스타를 이용해 소규모 팀이 안전하게 콘텐츠 관리하는 방법":
    "How small teams can safely manage content using Toosta",
  "더 자세히 >": "Learn More >",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPost {
  id: number;
  category: string;
  title: string;
  cta: string;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const posts: BlogPost[] = [
  {
    id: 1,
    category: "콘텐츠의 미래",
    title: "투스타를 이용해 소규모 팀이 안전하게 콘텐츠 관리하는 방법",
    cta: "더 자세히 >",
    href: "#",
  },
  {
    id: 2,
    category: "콘텐츠의 미래",
    title: "투스타를 이용해 소규모 팀이 안전하게 콘텐츠 관리하는 방법",
    cta: "더 자세히 >",
    href: "#",
  },
  {
    id: 3,
    category: "콘텐츠의 미래",
    title: "투스타를 이용해 소규모 팀이 안전하게 콘텐츠 관리하는 방법",
    cta: "더 자세히 >",
    href: "#",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlogSection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-6 py-16">
      {/* Section heading — kept in Korean as per design */}
      <h2 className=" text-2xl md:text-5xlfont-extrabold tracking-tight text-gray-900 mb-10">
        블로그
      </h2>

      {/* Post list */}
      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id} className="group">
            <a
              href={post.href}
              className="flex items-center justify-between gap-8 py-8 -mx-4 px-4 rounded-sm transition-colors hover:bg-gray-50"
            >
              {/* Left: category + title (Korean text unchanged) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-gray-900">
                  {post.category}
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {post.title}
                </span>
              </div>

              {/* Right: CTA (Korean text unchanged) */}
              <span className="shrink-0 text-sm text-gray-400 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                {post.cta}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}