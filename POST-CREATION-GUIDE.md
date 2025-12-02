# 포스트 생성 가이드

새로운 블로그 포스트를 쉽게 만드는 방법을 안내합니다.

## 방법 1: npm 스크립트 사용 (추천)

가장 빠르고 편리한 방법입니다.

```bash
npm run new
```

대화형 프롬프트가 나타나면 다음 정보를 입력하세요:
- 제목
- 설명
- 카테고리
- 태그 (쉼표로 구분)

스크립트가 자동으로:
- 현재 연도 폴더에 파일 생성
- 제목을 슬러그로 변환
- 오늘 날짜 자동 입력
- 기본 템플릿 적용

### 예시

```
📝 새 포스트 생성

제목: Docker 완벽 가이드
설명: Docker의 기초부터 실전까지 모든 것을 다룹니다
카테고리 (예: Frontend, Backend, DevTools): DevOps
태그 (쉼표로 구분): docker, container, devops

✅ 포스트가 생성되었습니다!
📁 경로: src/posts/2025/docker-완벽-가이드.md
🔗 슬러그: docker-완벽-가이드
```

## 방법 2: 템플릿 복사

수동으로 만들고 싶다면 템플릿을 복사하세요.

```bash
# 템플릿 복사
cp templates/post-template.md src/posts/2025/my-new-post.md

# 에디터로 열기
code src/posts/2025/my-new-post.md
```

그 다음 front matter를 수정하세요:
- `title`: 포스트 제목
- `description`: SEO 설명 (150자 이내 권장)
- `date`: YYYY-MM-DD 형식
- `category`: 카테고리명
- `tags`: 태그 목록

## 방법 3: VS Code 스니펫 (선택사항)

VS Code를 사용한다면 스니펫을 추가할 수 있습니다.

1. `Cmd/Ctrl + Shift + P` → "Configure User Snippets"
2. "markdown.json" 선택
3. 다음 스니펫 추가:

```json
{
  "Blog Post": {
    "prefix": "post",
    "body": [
      "---",
      "layout: post.njk",
      "title: ${1:제목}",
      "description: ${2:설명}",
      "date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "category: ${3:카테고리}",
      "tags:",
      "  - ${4:tag1}",
      "  - ${5:tag2}",
      "---",
      "",
      "# ${1:제목}",
      "",
      "${6:내용}",
      "",
      "## ${7:섹션}",
      "",
      "${8}",
      "",
      "## 마치며",
      "",
      "${9}"
    ],
    "description": "블로그 포스트 템플릿"
  }
}
```

사용법: 새 `.md` 파일에서 `post` 입력 후 Tab 키

## Front Matter 필드 설명

### 필수 필드

- `layout`: 항상 `post.njk`
- `title`: 포스트 제목 (SEO 중요)
- `description`: 포스트 설명 (검색 결과에 표시)
- `date`: 발행일 (YYYY-MM-DD)
- `category`: 카테고리 (하나만)
- `tags`: 태그 배열 (여러 개 가능)

### 선택 필드

- `draft`: `true`로 설정하면 빌드에서 제외
- `thumbnail`: 썸네일 이미지 경로
- `author`: 작성자 (기본값 사용 시 생략 가능)

## 카테고리 목록

기존 카테고리를 사용하는 것을 권장합니다:

- Frontend
- Backend
- DevOps
- DevTools
- Database
- NoSQL
- Modeling
- AI/ML
- Security
- Performance

## 태그 작성 팁

1. 소문자 사용
2. 하이픈으로 단어 연결 (예: `machine-learning`)
3. 3-5개 정도가 적당
4. 구체적이고 검색 가능한 키워드 사용

## 파일명 규칙

- 영문 소문자 사용
- 단어는 하이픈(-)으로 연결
- 확장자는 `.md`
- 예: `docker-complete-guide.md`

## 이미지 추가

```markdown
![대체 텍스트](/assets/images/my-image.jpg)
```

이미지는 `src/assets/images/` 폴더에 저장하세요.

## 코드 블록

\`\`\`언어
코드 내용
\`\`\`

지원 언어: javascript, typescript, python, bash, json, yaml, html, css 등

## 체크리스트

포스트 작성 후 확인사항:

- [ ] 제목이 명확하고 SEO 친화적인가?
- [ ] 설명이 150자 이내인가?
- [ ] 날짜가 올바른가?
- [ ] 카테고리와 태그가 적절한가?
- [ ] 코드 블록에 언어가 지정되었는가?
- [ ] 이미지에 대체 텍스트가 있는가?
- [ ] 맞춤법 검사를 했는가?
- [ ] 로컬에서 빌드 테스트를 했는가?

## 빌드 및 미리보기

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:8080
```

## 문제 해결

### 포스트가 목록에 안 보여요

1. `draft: true`가 설정되어 있는지 확인
2. 날짜가 미래인지 확인
3. front matter 문법 오류 확인 (YAML 형식)

### 빌드 오류가 나요

1. front matter의 `---` 구분자 확인
2. YAML 들여쓰기 확인 (태그는 2칸 들여쓰기)
3. 특수문자는 따옴표로 감싸기

### 한글 슬러그가 이상해요

파일명은 영문으로 작성하는 것을 권장합니다. 제목은 한글로 작성해도 됩니다.

## 추가 팁

1. **초안 작성**: `draft: true` 추가하면 공개되지 않음
2. **시리즈 포스트**: 태그를 동일하게 사용
3. **업데이트**: `updated` 필드로 수정일 표시 가능
4. **목차**: 긴 포스트는 `## 목차` 섹션 추가 권장

## 참고 문서

- [SLUG-GUIDE.md](./SLUG-GUIDE.md) - 슬러그 작성 가이드
- [SEO.md](./SEO.md) - SEO 최적화 가이드
- [SETUP.md](./SETUP.md) - 프로젝트 설정 가이드
