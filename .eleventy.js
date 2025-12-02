const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  // 플러그인 - Prism.js 테마 설정
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`
    }
  });

  // 정적 자산 복사
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Prism.js 테마 복사
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  // 이미지 처리 필터
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // 날짜 필터
  eleventyConfig.addFilter("dateFilter", function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // limit 필터
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // slice 필터
  eleventyConfig.addFilter("slice", function(array, start, end) {
    return array.slice(start, end);
  });

  // getAllTags 필터
  eleventyConfig.addFilter("getAllTags", function(collection) {
    let tagSet = new Set();
    collection.forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).filter(tag => tag !== "blog" && tag !== "post");
  });

  // filterByTag 필터
  eleventyConfig.addFilter("filterByTag", function(collection, tag) {
    return collection.filter(item => {
      return (item.data.tags || []).includes(tag);
    });
  });

  // AdSense 광고 shortcode
  eleventyConfig.addShortcode("adsense", function(type = "display") {
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

  // 컬렉션
  eleventyConfig.addCollection("blog", function(collection) {
    // 하위 디렉토리 포함 (src/posts/**/*.md)
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");
    
    // draft 필터링 (프로덕션에서만)
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }
    
    return posts.sort(function(a, b) {
      return b.date - a.date;
    });
  });

  // 카테고리별 컬렉션
  eleventyConfig.addCollection("Frontend", function(collection) {
    return collection.getAll().filter(item => item.data.category === "Frontend");
  });
  
  eleventyConfig.addCollection("Backend", function(collection) {
    return collection.getAll().filter(item => item.data.category === "Backend");
  });
  
  eleventyConfig.addCollection("Modeling", function(collection) {
    return collection.getAll().filter(item => item.data.category === "Modeling");
  });
  
  eleventyConfig.addCollection("NoSQL", function(collection) {
    return collection.getAll().filter(item => item.data.category === "NoSQL");
  });
  
  eleventyConfig.addCollection("DevOps", function(collection) {
    return collection.getAll().filter(item => item.data.category === "DevOps");
  });
  
  eleventyConfig.addCollection("AI/ML", function(collection) {
    return collection.getAll().filter(item => item.data.category === "AI/ML");
  });

  // 태그별 컬렉션
  eleventyConfig.addCollection("tagList", function(collection) {
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

  // 카테고리 목록
  eleventyConfig.addGlobalData("categoryList", [
    "Frontend",
    "Backend", 
    "Modeling",
    "NoSQL",
    "DevOps",
    "AI/ML"
  ]);

  // 읽기 시간 자동 계산
  eleventyConfig.addFilter("readingTime", function(content) {
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
