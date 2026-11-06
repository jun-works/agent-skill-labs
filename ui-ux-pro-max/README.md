# ui-ux-pro-max 실습

같은 UI 요청을 스킬 유무로 만들어, 스킬 파일이 내세우는 규칙이 결과물에 적용되는지 비교했습니다.

- 스킬: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT)
- 환경: Claude Code 2.1.318, `claude-opus-5-5`, effort `high`
- 조건: 스킬 없는 폴더(`plain`) / `/ui-ux-pro-max`(`skill`)
- 요청: 가계부 앱 랜딩, 쇼핑몰 매출 대시보드, 동물병원 진료 예약([prompts.json](prompts.json)). 조건별 1회씩 총 6회

## 결과 요약

| | 스킬 없음 | 스킬 |
|---|---|---|
| 디자인 시스템 생성 | 0/3 | 3/3 |
| 폰에서 44px보다 작은 조작 요소 | 29/62 (47%) | 8/68 (12%) |
| 명암비 미달 글자 비율 (최대) | 4.6% | 0.4% |
| 폰 폭(390px) 가로 스크롤 | 0/3 | 1/3 |
| 비용 합계 | $5.24 | $5.41 |

## 결과 화면

[GitHub Pages에서 보기](https://jun-works.github.io/agent-skill-labs/ui-ux-pro-max/). 폰 크기로 두 조건을 나란히 볼 수 있습니다.

## 파일

- `pages/`: 생성된 HTML 원본
- `screenshots/`: 밝은 모드, 폭 1280px(`desktop`)과 390px(`phone`) 화면
- `audit.json`: 렌더링한 페이지에서 잰 값
- `metrics.json`: 실행별 토큰, 비용, 시간
- `run.py`: 실행. `audit.mjs`: 측정 (Chrome `--remote-debugging-port=9348` 필요)

## 다시 실행

```bash
python3 run.py <작업 폴더> plain 1 2 3
python3 run.py <작업 폴더> skill 1 2 3
node audit.mjs <작업 폴더> plain-1 plain-2 plain-3 skill-1 skill-2 skill-3
```

`skill` 조건은 `~/.claude/skills/ui-ux-pro-max`에 스킬이 있어야 합니다. 결과는 실행마다 달라질 수 있습니다.

## 한계

요청별 1회만 실행했고, 자동으로 잴 수 있는 항목만 쟀습니다. 디자인 품질이나 가독성을 잰 값은 아닙니다.
