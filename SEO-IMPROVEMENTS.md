# 구글 검색 최적화 개선 완료

## 🎯 해결된 문제

### 1. 사이트 이름 표시 문제
**문제**: 구글 검색 결과에 `eone.one` (도메인)으로 표시됨  
**해결**: `주경야근`으로 표시되도록 개선

#### 적용된 변경사항:

1. **Title 태그 개선** (`src/_layouts/base.njk`)
   ```html
   <!-- 변경 전 -->
   <title>{{ title or site.title }} - {{ site.title }}</title>
   
   <!-- 변경 후 -->
   <title>{% if title %}{{ title }} | {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
   ```

2. **Schema.org 구조화된 데이터 추가**
   - BlogPosting/WebSite 타입 자동 설정
   - Publisher 정보에 사이트 이름 명시
   - 로고 이미지 포함
   ```json
   {
     "@context": "https://schema.org",
     "@type": "BlogPosting",
     "publisher": {
       "@type": "Organization",
       "name": "주경야근",
       "logo": {
         "@type": "ImageObject",
         "url": "https://burn.eone.one/assets/logo.svg"
       }
     }
   }
   ```

3. **Open Graph 개선**
   ```html
   <meta property="og:site_name" content="주경야근">
   <meta property="og:title" content="포스트 제목 | 주경야근">
   ```

---

### 2. Description 스니펫 문제
**문제**: 구글이 description 대신 본문 중간 내용을 임의로 선택  
**해결**: 구조화된 데이터와 메타 태그 강화

#### 적용된 변경사항:

1. **Description 우선순위 명확화**
   ```html
   <meta name="description" content="{{ description or site.description }}">
   ```

2. **Schema.org에 description 추가**
   ```json
   {
     "description": "{{ description or site.description }}"
   }
   ```

3. **Open Graph description 일관성 유지**
   ```html
   <meta property="og:description" content="{{ description or site.description }}">
   ```

---

## 📋 추가 개선사항

### 1. ISO 8601 날짜 형식 추가
구조화된 데이터를 위한 표준 날짜 형식 필터 추가 (`.eleventy.js`)

```javascript
eleventyConfig.addFilter("dateISO", function (date) {
  return date.toISOString();
});
```

### 2. Author 정보 개선
하드코딩된 "주경야근" 대신 `site.author.name` 사용

---

## 🚀 다음 단계

### 즉시 실행 가능한 작업:

1. **빌드 및 배포**
   ```bash
   npm run build
   # Netlify에 자동 배포됨
   ```

2. **Google Search Console에서 재크롤링 요청**
   - Search Console 접속
   - URL 검사 도구 사용
   - "색인 생성 요청" 클릭
   - 주요 페이지 3-5개 요청

3. **변경사항 확인** (1-2주 후)
   - 구글 검색: `site:burn.eone.one`
   - 사이트 이름이 "주경야근"으로 표시되는지 확인
   - Description이 올바르게 표시되는지 확인

---

## 💡 포스트 작성 시 권장사항

### Description 작성 가이드:

```yaml
---
title: "Git 브랜치 히스토리 오염 시 복구 방법"
description: "Main 브랜치의 히스토리가 비정상적으로 변경되었을 때, git reflog를 통해 정상 시점을 찾아 수정된 파일들만 새 브랜치로 이관하는 실무 가이드입니다."
---
```

#### ✅ 좋은 Description:
- **길이**: 120-160자 (구글 표시 제한)
- **키워드**: 자연스럽게 포함
- **행동 유도**: "가이드", "방법", "완벽 정리" 등
- **구체적**: 무엇을 배울 수 있는지 명확히

#### ❌ 나쁜 Description:
- 너무 짧음 (50자 미만)
- 너무 김 (200자 이상)
- 키워드만 나열
- 본문 첫 문장 그대로 복사

---

## 🔍 검증 도구

### 1. Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- 구조화된 데이터 검증

### 2. Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Open Graph 태그 검증

### 3. Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Twitter Card 검증

---

## 📊 예상 효과

### 단기 (1-2주):
- ✅ 사이트 이름 "주경야근"으로 표시
- ✅ Description 정확도 향상
- ✅ 구조화된 데이터 인식

### 중기 (1-2개월):
- 📈 CTR (클릭률) 5-10% 향상
- 📈 검색 노출 증가
- 📈 Rich Snippet 표시 가능성

### 장기 (3-6개월):
- 🚀 검색 순위 상승
- 🚀 브랜드 인지도 향상
- 🚀 자연 유입 트래픽 증가

---

## ⚠️ 주의사항

1. **구글 업데이트 시간**
   - 변경사항 반영: 1-2주 소요
   - 인내심을 가지고 기다리기

2. **Description이 여전히 다르게 표시될 수 있음**
   - 구글은 검색 쿼리에 따라 최적의 스니펫을 선택
   - Description은 "제안"이지 "강제"가 아님
   - 하지만 대부분의 경우 설정한 description 사용

3. **지속적인 개선**
   - 각 포스트마다 고유한 description 작성
   - 정기적으로 Search Console 확인
   - 성과가 낮은 페이지 개선

---

## 📚 참고 자료

- [Google 검색 센터 - 제목 링크](https://developers.google.com/search/docs/appearance/title-link)
- [Google 검색 센터 - 스니펫](https://developers.google.com/search/docs/appearance/snippet)
- [Schema.org - BlogPosting](https://schema.org/BlogPosting)
- [Open Graph Protocol](https://ogp.me/)

---

**완료!** 🎉 이제 빌드하고 배포하면 구글 검색 최적화가 적용됩니다.
