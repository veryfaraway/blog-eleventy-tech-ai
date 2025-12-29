---
layout: post.njk
title: "Prism.js 완벽 가이드: 코드 구문 강조로 블로그를 더 읽기 쉽게 만들기"
slug: prismjs-code-syntax-highlighting-ko
date: 2025-12-24
draft: false
description: "Prism.js를 사용하여 블로그에 아름다운 코드 구문 강조를 추가하는 방법을 알아봅니다. Eleventy와의 통합 방법부터 커스터마이징까지 실전 가이드를 제공합니다."
category: Frontend
tags:
  - prismjs
  - syntax-highlighting
  - eleventy
  - code
  - frontend
  - javascript
lang: ko
thumbnail: https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fkxr87p5hyncxnaj5esbp.jpg
---

## Prism.js란?

**Prism.js**는 경량이고 확장 가능한 코드 구문 강조(Syntax Highlighting) 라이브러리입니다. 웹사이트나 블로그에서 코드 블록을 아름답게 표시하고 가독성을 크게 향상시킵니다.

### 왜 Prism.js인가?

- 🚀 **경량**: 약 2KB로 압축되어 빠른 로딩
- 🎨 **다양한 테마**: 미리 만들어진 아름다운 테마 제공
- 🔌 **플러그인 시스템**: 다양한 기능을 추가할 수 있는 플러그인
- 🛠️ **사용하기 쉬움**: 간단한 설정으로 바로 사용 가능
- 📦 **200개 이상의 언어 지원**: 대부분의 프로그래밍 언어 지원

## Prism.js 설치 및 기본 사용법

### npm으로 설치

```bash
npm install prismjs
```

### CDN으로 사용

```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet" />

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
```

### 기본 사용법

```html
<pre><code class="language-javascript">
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
</code></pre>
```

Prism.js는 자동으로 `language-*` 클래스를 인식하여 코드를 하이라이팅합니다.

## Eleventy와 Prism.js 통합하기

Eleventy는 정적 사이트 생성기이므로, 빌드 타임에 코드를 하이라이팅할 수 있습니다.

### 1. 플러그인 설치

```bash
npm install @11ty/eleventy-plugin-syntaxhighlight
```

### 2. Eleventy 설정 파일에 추가

`.eleventy.js` 파일을 열고 다음과 같이 설정합니다:

```javascript
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Prism.js 플러그인 추가
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`
    }
  });
  
  // Prism.js 테마 CSS 복사
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  return {
    // ... 기타 설정
  };
};
```

### 3. 레이아웃에 CSS 추가

`src/_layouts/base.njk` 파일의 `<head>` 섹션에 추가:

```html
<link rel="stylesheet" href="/css/prism-theme.css">
```

### 4. 마크다운에서 사용

이제 마크다운 파일에서 코드 블록을 작성하면 자동으로 하이라이팅됩니다:

````markdown
```javascript
const data = {
  name: "Prism.js",
  version: "1.29.0"
};

console.log(JSON.stringify(data, null, 2));
```
````

## 지원되는 언어

Prism.js는 200개 이상의 언어를 지원합니다:

- **프론트엔드**: JavaScript, TypeScript, HTML, CSS, Sass, Less
- **백엔드**: Java, Python, PHP, Ruby, Go, Rust
- **데이터베이스**: SQL, MongoDB
- **도구**: Bash, Git, YAML, JSON, Markdown
- **그 외**: C, C++, C#, Swift, Kotlin 등

사용할 언어는 `language-*` 클래스로 지정합니다:

```html
<pre><code class="language-python">print("Hello, World!")</code></pre>
<pre><code class="language-java">System.out.println("Hello, World!");</code></pre>
<pre><code class="language-sql">SELECT * FROM users;</code></pre>
```

## 테마 커스터마이징

### 기본 테마 선택

Prism.js는 여러 테마를 제공합니다:

- `prism.css` - 기본 테마
- `prism-dark.css` - 다크 테마
- `prism-tomorrow.css` - Tomorrow 테마 (추천)
- `prism-okaidia.css` - Okaidia 테마
- `prism-twilight.css` - Twilight 테마

CDN에서 테마를 변경하려면:

```html
<!-- 기본 테마 -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet" />

<!-- 다크 테마 -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-dark.min.css" rel="stylesheet" />

<!-- Tomorrow 테마 -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
```

### 커스텀 테마 만들기

CSS 파일을 만들어 커스텀 테마를 만들 수 있습니다:

```css
/* custom-prism-theme.css */
code[class*="language-"],
pre[class*="language-"] {
  color: #f8f8f2;
  background: #272822;
  text-shadow: 0 1px rgba(0, 0, 0, 0.3);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 1em;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 4;
  hyphens: none;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #75715e;
}

.token.punctuation {
  color: #f8f8f2;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
  color: #f92672;
}

.token.boolean,
.token.number {
  color: #ae81ff;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #a6e22e;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
  color: #f8f8f2;
}

.token.atrule,
.token.attr-value,
.token.function,
.token.class-name {
  color: #e6db74;
}

.token.keyword {
  color: #66d9ef;
}
```

## 유용한 플러그인

Prism.js에는 다양한 플러그인이 있습니다:

### 1. Line Numbers (줄 번호)

```bash
npm install prismjs
```

```javascript
import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

// HTML에 클래스 추가
// <pre class="line-numbers"><code class="language-javascript">...</code></pre>
```

### 2. Copy to Clipboard (복사 버튼)

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
```

### 3. Toolbar (도구바)

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/toolbar/prism-toolbar.min.css" rel="stylesheet" />
```

### 4. Show Language (언어 표시)

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/show-language/prism-show-language.min.js"></script>
```

## 실전 예제: Eleventy 블로그에 적용하기

### 전체 설정 예제

`.eleventy.js`:

```javascript
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Prism.js 플러그인 설정
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`,
      'data-line': ({ lineStart, lineEnd }) => 
        lineStart ? `${lineStart}${lineEnd ? `-${lineEnd}` : ''}` : undefined
    },
    codeAttributes: {
      'data-language': ({ language }) => language
    }
  });

  // Prism.js 테마 복사
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

### 코드 복사 기능 추가

`js/code-copy.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const pre = block.parentElement;
    
    // 이미 복사 버튼이 있으면 스킵
    if (pre.querySelector('.copy-button')) return;
    
    // 복사 버튼 생성
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background: #333;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    
    // pre에 relative positioning 추가
    pre.style.position = 'relative';
    
    button.addEventListener('click', async () => {
      const text = block.textContent;
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
    
    pre.appendChild(button);
  });
});
```

## 성능 최적화

### 필요한 언어만 로드

모든 언어를 로드하면 번들 크기가 커집니다. 필요한 언어만 로드하세요:

```javascript
import Prism from 'prismjs';

// 필요한 언어만 import
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

Prism.highlightAll();
```

### 자동 하이라이팅 비활성화

필요한 코드 블록만 하이라이팅하려면:

```javascript
// 자동 하이라이팅 비활성화
Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';

// 특정 요소만 하이라이팅
const codeBlocks = document.querySelectorAll('.highlight');
codeBlocks.forEach(block => {
  Prism.highlightElement(block);
});
```

## 마치며

Prism.js는 블로그나 웹사이트에 코드 구문 강조를 추가하는 가장 좋은 방법 중 하나입니다. 간단한 설정으로 아름다운 코드 블록을 만들 수 있고, 다양한 커스터마이징 옵션을 제공합니다.

Eleventy와 함께 사용하면 빌드 타임에 코드를 하이라이팅하여 성능도 좋고, SEO에도 유리합니다. 이제 여러분의 블로그에도 Prism.js를 적용해보세요!

### 참고 자료

- [Prism.js 공식 사이트](https://prismjs.com/)
- [Prism.js GitHub](https://github.com/PrismJS/prism)
- [Eleventy 문서](https://www.11ty.dev/)
- [@11ty/eleventy-plugin-syntaxhighlight](https://github.com/11ty/eleventy-plugin-syntaxhighlight)

