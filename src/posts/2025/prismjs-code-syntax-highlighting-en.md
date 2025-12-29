---
layout: post.njk
title: "Prism.js Complete Guide: Making Your Blog Code More Readable with Syntax Highlighting"
slug: prismjs-code-syntax-highlighting-en
date: 2025-12-24
draft: false
description: "Learn how to add beautiful syntax highlighting to your blog using Prism.js. A comprehensive guide from integration with Eleventy to customization and best practices."
category: Frontend
tags:
  - prismjs
  - syntax-highlighting
  - eleventy
  - code
  - frontend
  - javascript
lang: en
thumbnail: https://images.unsplash.com/photo-1586764635350-4f88a6a30a52?q=80&w=2729&auto=format&fit=crop
---

## What is Prism.js?

**Prism.js** is a lightweight, extensible syntax highlighting library. It makes code blocks on websites or blogs beautiful and significantly improves readability.

### Why Prism.js?

- 🚀 **Lightweight**: Only about 2KB minified for fast loading
- 🎨 **Beautiful Themes**: Pre-built, gorgeous themes available
- 🔌 **Plugin System**: Extensible with various plugins
- 🛠️ **Easy to Use**: Works out of the box with simple setup
- 📦 **200+ Languages**: Supports most programming languages

## Installation and Basic Usage

### Install via npm

```bash
npm install prismjs
```

### Use via CDN

```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet" />

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
```

### Basic Usage

```html
<pre><code class="language-javascript">
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
</code></pre>
```

Prism.js automatically recognizes `language-*` classes and highlights the code accordingly.

## Integrating Prism.js with Eleventy

Since Eleventy is a static site generator, you can highlight code at build time.

### 1. Install the Plugin

```bash
npm install @11ty/eleventy-plugin-syntaxhighlight
```

### 2. Add to Eleventy Configuration

Open your `.eleventy.js` file and configure it as follows:

```javascript
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Add Prism.js plugin
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`
    }
  });
  
  // Copy Prism.js theme CSS
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  return {
    // ... other configurations
  };
};
```

### 3. Add CSS to Layout

Add this to the `<head>` section of `src/_layouts/base.njk`:

```html
<link rel="stylesheet" href="/css/prism-theme.css">
```

### 4. Use in Markdown

Now you can write code blocks in markdown and they'll be automatically highlighted:

````markdown
```javascript
const data = {
  name: "Prism.js",
  version: "1.29.0"
};

console.log(JSON.stringify(data, null, 2));
```
````

## Supported Languages

Prism.js supports over 200 languages:

- **Frontend**: JavaScript, TypeScript, HTML, CSS, Sass, Less
- **Backend**: Java, Python, PHP, Ruby, Go, Rust
- **Database**: SQL, MongoDB
- **Tools**: Bash, Git, YAML, JSON, Markdown
- **Others**: C, C++, C#, Swift, Kotlin, and more

Specify languages using the `language-*` class:

```html
<pre><code class="language-python">print("Hello, World!")</code></pre>
<pre><code class="language-java">System.out.println("Hello, World!");</code></pre>
<pre><code class="language-sql">SELECT * FROM users;</code></pre>
```

## Theme Customization

### Choose a Default Theme

Prism.js offers several themes:

- `prism.css` - Default theme
- `prism-dark.css` - Dark theme
- `prism-tomorrow.css` - Tomorrow theme (recommended)
- `prism-okaidia.css` - Okaidia theme
- `prism-twilight.css` - Twilight theme

To change themes via CDN:

```html
<!-- Default theme -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet" />

<!-- Dark theme -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-dark.min.css" rel="stylesheet" />

<!-- Tomorrow theme -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
```

### Create a Custom Theme

You can create a custom theme by creating a CSS file:

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

## Useful Plugins

Prism.js has various useful plugins:

### 1. Line Numbers

```bash
npm install prismjs
```

```javascript
import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

// Add class to HTML
// <pre class="line-numbers"><code class="language-javascript">...</code></pre>
```

### 2. Copy to Clipboard

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
```

### 3. Toolbar

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/toolbar/prism-toolbar.min.css" rel="stylesheet" />
```

### 4. Show Language

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/show-language/prism-show-language.min.js"></script>
```

## Practical Example: Applying to Eleventy Blog

### Complete Configuration Example

`.eleventy.js`:

```javascript
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Configure Prism.js plugin
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

  // Copy Prism.js theme
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

### Adding Copy to Clipboard Feature

`js/code-copy.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const pre = block.parentElement;
    
    // Skip if copy button already exists
    if (pre.querySelector('.copy-button')) return;
    
    // Create copy button
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
    
    // Add relative positioning to pre
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

## Performance Optimization

### Load Only Required Languages

Loading all languages increases bundle size. Only load what you need:

```javascript
import Prism from 'prismjs';

// Import only required languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

Prism.highlightAll();
```

### Disable Auto Highlighting

To highlight only specific code blocks:

```javascript
// Disable auto highlighting
Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';

// Highlight only specific elements
const codeBlocks = document.querySelectorAll('.highlight');
codeBlocks.forEach(block => {
  Prism.highlightElement(block);
});
```

## Conclusion

Prism.js is one of the best ways to add syntax highlighting to your blog or website. With simple configuration, you can create beautiful code blocks and have access to various customization options.

Using it with Eleventy allows code highlighting at build time, providing better performance and SEO benefits. Now try applying Prism.js to your blog!

### References

- [Prism.js Official Site](https://prismjs.com/)
- [Prism.js GitHub](https://github.com/PrismJS/prism)
- [Eleventy Documentation](https://www.11ty.dev/)
- [@11ty/eleventy-plugin-syntaxhighlight](https://github.com/11ty/eleventy-plugin-syntaxhighlight)

