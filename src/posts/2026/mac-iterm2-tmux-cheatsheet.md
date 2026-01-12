---
layout: post.njk
title: "tmux 가이드 #3: 한 장으로 끝내는 핵심 단축키 요약 (Cheatsheet)"
description: "tmux를 쓰면서 매번 구글링하기 귀찮으셨죠? 가장 자주 쓰는 필수 단축키를 상황별로 정리했습니다."
slug: mac-iterm2-tmux-cheatsheet
lang: ko
date: 2026-01-11
category: Tools
tags:
  - iterm2
  - tmux
  - terminal
  - macos
thumbnail: https://images.unsplash.com/photo-1503551723145-6c040742065b-v2?q=80&w=2370&auto=format&fit=crop
relatedPosts:
  - mac-iterm2-tmux
  - mac-iterm2-tmux-tpm
---

tmux는 강력하지만 단축키가 익숙해지기까지 시간이 걸립니다. 이 포스트를 즐겨찾기 해두고 필요할 때마다 꺼내 보세요! 
*(모든 단축키는 본인의 설정에 따라 `Ctrl+b` 또는 `Ctrl+a`인 **Prefix**를 먼저 누른 후 입력해야 합니다.)*

## 1. 세션(Session) 관리 - 프로젝트 단위
| 기능 | 단축키 / 명령어 |
| :--- | :--- |
| 새 세션 생성 | `tmux new -s [이름]` |
| 세션 이름 변경 | `Prefix` + `$` |
| 세션 목록 보기/이동 | `Prefix` + `s` |
| 세션 나가기 (Detach) | `Prefix` + `d` |
| 마지막 세션 다시 접속 | `tmux attach` |

## 2. 윈도우(Window) 관리 - 탭 기능
| 기능 | 단축키 |
| :--- | :--- |
| 새 윈도우 생성 | `Prefix` + `c` |
| 다음/이전 윈도우 이동 | `Prefix` + `n` / `p` |
| 윈도우 번호로 이동 | `Prefix` + `0~9` |
| 윈도우 이름 변경 | `Prefix` + `,` |
| 윈도우 종료 | `Prefix` + `&` |

## 3. 패널(Pane) 관리 - 화면 분할
| 기능 | 단축키 |
| :--- | :--- |
| 세로 화면 분할 | `Prefix` + `%` (또는 설정한 `|`) |
| 가로 화면 분할 | `Prefix` + `"` (또는 설정한 `-`) |
| 패널 간 이동 | `Prefix` + `방향키` |
| 현재 패널 전체화면 전환 | `Prefix` + `z` (강력 추천!) |
| 패널 번호 보이기 | `Prefix` + `q` |
| 패널 종료 | `Prefix` + `x` |

## 4. 스크롤 및 복사 (Copy Mode)
tmux에서는 마우스 휠이 가끔 먹히지 않을 때가 있습니다.
1. `Prefix` + `[` 입력: 복사 모드 진입
2. 방향키나 Page Up/Down으로 스크롤
3. `q` 눌러서 빠져나오기

> **Pro Tip:** 지난 포스트에서 설정한 `set -g mouse on` 옵션을 사용 중이라면 마우스 휠로도 스크롤이 가능합니다!

```

---

## 포스팅 #4: Neovim과 tmux의 심화 연동

```markdown
---
title: "tmux 가이드 #4: Vim/Neovim 유저를 위한 심화 연동 (Seamless Navigation)"
description: "tmux 패널과 Neovim 창 사이를 마치 하나의 프로그램처럼 자유롭게 넘나드는 설정을 알아봅니다."
tag: ["Terminal", "tmux", "Neovim", "Vim", "Workflow"]
---

터미널 기반 개발자의 최종 목적지는 결국 **tmux + Neovim**의 조합입니다. 하지만 tmux 패널 사이를 이동할 때는 `Ctrl+a + 방향키`를 쓰고, Neovim 창 사이를 이동할 때는 `Ctrl+w + hjkl`을 쓰는 것은 매우 번거롭습니다.

오늘은 이 두 도구 사이의 벽을 허무는 방법을 소개합니다.

## 1. 목표: 동일한 단축키로 이동하기
`Ctrl + hjkl` 단축키 하나로 Neovim의 분할 창과 tmux의 패널을 구분 없이 이동하는 설정을 구성합니다.

## 2. tmux 플러그인 설치
먼저 `~/.tmux.conf`에 아래 플러그인을 추가하고 설치(`Prefix + I`)합니다.

```bash
set -g @plugin 'christoomey/vim-tmux-navigation'

```

## 3. Neovim(Vim) 설정

Neovim 설정 파일(`init.lua` 또는 `init.vim`)에도 대응하는 플러그인을 설치해야 합니다. (packer, lazy.nvim 등 본인의 플러그인 매니저 사용)

**lazy.nvim 예시:**

```lua
{
  "christoomey/vim-tmux-navigator",
  cmd = {
    "TmuxNavigateLeft",
    "TmuxNavigateDown",
    "TmuxNavigateUp",
    "TmuxNavigateRight",
    "TmuxNavigatePrevious",
  },
  keys = {
    { "<c-h>", "<cmd><C-U>TmuxNavigateLeft<cr>" },
    { "<c-j>", "<cmd><C-U>TmuxNavigateDown<cr>" },
    { "<c-k>", "<cmd><C-U>TmuxNavigateUp<cr>" },
    { "<c-l>", "<cmd><C-U>TmuxNavigateRight<cr>" },
  },
}

```

## 4. 왜 이 설정이 중요한가요?

이 설정이 완료되면 코딩 중에 왼쪽 패널(Neovim)에서 오른쪽 패널(터미널 로그 창)로 넘어갈 때, 별도의 Prefix 입력 없이 `Ctrl + l` 한 번으로 즉시 이동할 수 있습니다.

마치 **Neovim과 터미널이 하나의 IDE(통합 개발 환경)처럼 작동**하게 되는 것이죠.

## 5. 추가 팁: 배경색 통일하기

tmux 위에서 Vim을 실행할 때 배경색이 어색하게 변한다면, `~/.tmux.conf`에 아래 설정을 확인하세요.

```bash
set -g default-terminal "screen-256color"
set -as terminal-features ",xterm-256color:RGB"

```

이것으로 3편에 걸친 tmux 시리즈를 마칩니다. 이제 여러분의 터미널은 단순한 입력창이 아니라, 세상에서 가장 효율적인 개발 전용 공간이 되었습니다!