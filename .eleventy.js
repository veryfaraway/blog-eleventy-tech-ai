const theme = require("@veryfaraway/eleventy-theme");

module.exports = function (eleventyConfig) {
  // Shared theme (build-time mermaid, unified permalink, selectable comments)
  const baseConfig = theme(eleventyConfig, {
    comments: { provider: "auto", utterances: { theme: "github-light", issueTerm: "pathname" } },
    mermaid: { enabled: true, mode: "buildtime" },
    permalink: { mode: "computed", stripNumericPrefix: true, enableLangParam: false },
    redirects: { enabled: true },
  });

  // Site-specific passthrough (favicons / manifest)
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");

  // 초안 포스트 필터링 함수
  const isDraft = (item) => item.data.draft === true;

  // 카테고리별 컬렉션 (언어별 필터링 + 날짜 정렬)
  eleventyConfig.addCollection("Trends", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Trends" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Frontend", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Frontend" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Backend", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Backend" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Mobile", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Mobile" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Data", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Data" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("Tools", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "Tools" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("DevOps", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "DevOps" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("AI/ML", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "AI/ML" && !isDraft(item))
      .sort((a, b) => b.date - a.date);
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
  return {
    ...baseConfig,
    dir: {
      ...baseConfig.dir,
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
