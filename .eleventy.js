const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // 플러그인 - Prism.js 테마 설정
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`
    }
  });

  // Markdown 설정
  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  const md = markdownIt(mdOptions);

  // Custom renderer for mermaid
  const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'mermaid') {
      return `<pre class="mermaid">${code}</pre>`;
    }
    return defaultRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);

  // 정적 자산 복사
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  // SEO 및 인증 파일
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/*.html");

  // 파비콘 파일들
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");

  // Prism.js 테마 복사
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  // 이미지 처리 필터
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // 날짜 필터
  eleventyConfig.addFilter("dateFilter", function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // ISO 8601 날짜 필터 (구조화된 데이터용)
  eleventyConfig.addFilter("dateISO", function (date) {
    return date.toISOString();
  });

  // limit 필터
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  // slice 필터
  eleventyConfig.addFilter("slice", function (array, start, end) {
    return array.slice(start, end);
  });

  // getAllTags 필터
  eleventyConfig.addFilter("getAllTags", function (collection) {
    let tagSet = new Set();
    collection.forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).filter(tag => tag !== "blog" && tag !== "post").sort();
  });

  // filterByTag 필터
  eleventyConfig.addFilter("filterByTag", function (collection, tag) {
    return collection.filter(item => {
      return (item.data.tags || []).includes(tag);
    });
  });

  // find 필터 - slug로 포스트 찾기
  eleventyConfig.addFilter("find", function (collection, slug) {
    return collection.find(item => item.data.slug === slug);
  });

  // AdSense 광고 shortcode
  eleventyConfig.addShortcode("adsense", function (type = "display") {
    const siteData = this.ctx.site || {};
    const envData = this.ctx.env || {};

    // 환경 변수 우선, 없으면 site.json 사용
    const adsenseEnabled = envData.adsense?.enabled ?? siteData.adsense?.enabled;
    const adsenseClient = envData.adsense?.client || siteData.adsense?.client;
    const adsenseSlots = {
      inArticle: envData.adsense?.slots?.inArticle || siteData.adsense?.slots?.inArticle,
      display: envData.adsense?.slots?.display || siteData.adsense?.slots?.display
    };

    if (!adsenseEnabled || !adsenseClient) {
      return '<!-- AdSense disabled -->';
    }

    const slot = type === "inArticle" ? adsenseSlots.inArticle : adsenseSlots.display;

    if (type === "inArticle") {
      return `
        <div class="my-8 flex justify-center">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="${adsenseClient}"
               data-ad-slot="${slot}"></ins>
        </div>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `;
    } else {
      return `
        <div class="my-8 flex justify-center">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${adsenseClient}"
               data-ad-slot="${slot}"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `;
    }
  });

  // 다국어 번역 필터
  eleventyConfig.addFilter("t", function (key, lang = "ko") {
    const i18n = require("./src/_data/i18n.js");
    const keys = key.split(".");
    let value = i18n[lang] || i18n.ko;

    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }

    return value || key;
  });

  // 현재 언어 가져오기 (페이지 front matter 또는 기본값)
  eleventyConfig.addFilter("getLang", function (page) {
    return page?.data?.lang || "ko";
  });

  // 언어별 포스트 필터링
  eleventyConfig.addFilter("filterByLang", function (collection, lang) {
    return collection.filter(item => {
      const itemLang = item.data.lang || "ko";
      return itemLang === lang;
    });
  });

  // 컬렉션
  eleventyConfig.addCollection("blog", function (collection) {
    // 하위 디렉토리 포함 (src/posts/**/*.md)
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");

    // draft 필터링 (프로덕션에서만)
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }

    return posts.sort(function (a, b) {
      return b.date - a.date;
    });
  });

  // 언어별 컬렉션
  eleventyConfig.addCollection("blog_ko", function (collection) {
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }
    return posts.filter(post => {
      const lang = post.data.lang || "ko";
      return lang === "ko";
    }).sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("blog_en", function (collection) {
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }
    return posts.filter(post => {
      const lang = post.data.lang || "ko";
      return lang === "en";
    }).sort((a, b) => b.date - a.date);
  });

  // 카테고리별 컬렉션 (언어별 필터링 + 날짜 정렬)
  eleventyConfig.addCollection("Trends", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Trends")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Frontend", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Frontend")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Backend", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Backend")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Mobile", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Mobile")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Data", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Data")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Tools", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Tools")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("DevOps", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "DevOps")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("AI/ML", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "AI/ML")
      .sort((a, b) => b.date - a.date);
  });

  // 태그별 컬렉션
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag !== "blog" && tag !== "post") {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  });

  // 카테고리 목록 (이름과 슬러그 분리)
  eleventyConfig.addGlobalData("categoryList", [
    { name: "Trends", slug: "trends" },
    { name: "Frontend", slug: "frontend" },
    { name: "Backend", slug: "backend" },
    { name: "Mobile", slug: "mobile" },
    { name: "Data", slug: "data" },
    { name: "Tools", slug: "tools" },
    { name: "DevOps", slug: "devops" },
    { name: "AI/ML", slug: "ai-ml" }
  ]);

  // 읽기 시간 자동 계산
  eleventyConfig.addFilter("readingTime", function (content) {
    if (!content) return 0;

    // HTML 태그 제거
    const text = content.replace(/<[^>]*>/g, '');

    // 단어 수 계산 (한글/영문 혼합)
    const koreanChars = (text.match(/[\u3131-\uD79D]/g) || []).length;
    const words = text.split(/\s+/).filter(word => word.length > 0).length;

    // 한글: 500자/분, 영문: 200단어/분 기준
    const koreanMinutes = koreanChars / 500;
    const englishMinutes = words / 200;

    const totalMinutes = Math.ceil(koreanMinutes + englishMinutes);

    return totalMinutes > 0 ? totalMinutes : 1;
  });

  // 설정 객체
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};

async function imageShortcode(src, alt) {
  let metadata = await Image(src, {
    widths: [300, 600, 1200],
    formats: ["webp", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes: "(min-width: 1024px) 1024px, 100vw",
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}
