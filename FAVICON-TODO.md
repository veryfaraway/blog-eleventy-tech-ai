# 파비콘 업데이트 TODO

## ✅ 완료된 작업

1. HTML 태그 추가 (`src/_layouts/base.njk`)
2. `.eleventy.js` 설정 추가
3. `site.webmanifest` 생성

---

## 📋 해야 할 작업

### 1. 파비콘 파일 생성 (필수!)

현재 파비콘 파일들이 없습니다. 다음 중 하나를 선택하세요:

#### 옵션 A: 온라인 도구 사용 (추천 ⭐)

**[Favicon.io](https://favicon.io/)** 사용:

1. https://favicon.io/ 접속
2. "PNG/JPG to Favicon" 선택
3. `src/assets/logo.svg` 또는 `src/assets/favicon.svg` 업로드
   - SVG는 먼저 PNG로 변환 필요 (512x512 권장)
4. "Download" 클릭
5. 다운로드한 파일 중 다음을 `src/` 폴더에 복사:
   ```
   favicon.ico
   favicon-16x16.png
   favicon-32x32.png
   apple-touch-icon.png
   ```

#### 옵션 B: 수동 생성 (ImageMagick 필요)

```bash
# SVG를 PNG로 변환
convert src/assets/favicon.svg -resize 32x32 src/favicon-32x32.png
convert src/assets/favicon.svg -resize 16x16 src/favicon-16x16.png
convert src/assets/favicon.svg -resize 180x180 src/apple-touch-icon.png

# ICO 파일 생성
convert src/favicon-32x32.png src/favicon-16x16.png src/favicon.ico
```

---

### 2. 파일 배치 확인

`src/` 폴더에 다음 파일들이 있어야 합니다:

```
src/
├── favicon.ico              ← 생성 필요!
├── favicon-16x16.png        ← 생성 필요!
├── favicon-32x32.png        ← 생성 필요!
├── apple-touch-icon.png     ← 생성 필요!
└── site.webmanifest         ✅ 이미 생성됨
```

---

### 3. 빌드 및 배포

```bash
npm run build
git add .
git commit -m "feat: 파비콘 파일 추가"
git push
```

---

### 4. 구글 캐시 초기화

#### Google Search Console에서:
1. https://search.google.com/search-console 접속
2. "URL 검사" 도구
3. `https://burn.eone.one` 입력
4. "색인 생성 요청" 클릭

#### 브라우저에서 확인:
- 시크릿 모드로 사이트 접속
- 탭 아이콘 확인

---

## ⏱️ 예상 소요 시간

- 파비콘 생성: **5분**
- 빌드 및 배포: **2분**
- 브라우저 반영: **즉시**
- 구글 검색 반영: **1-2주**

---

## 🎯 현재 상태

- ✅ HTML 설정 완료
- ✅ 빌드 설정 완료
- ✅ Manifest 파일 생성
- ❌ **파비콘 이미지 파일 생성 필요** ← 이것만 하면 됩니다!

---

## 💡 팁

구글 검색 결과의 파비콘은 업데이트가 **매우 느립니다** (1-2주).
브라우저 탭에서 새 아이콘이 보이면 성공한 것입니다! 🎉

자세한 내용은 `FAVICON-GUIDE.md`를 참고하세요.
