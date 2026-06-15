# 项目开发规范（CLAUDE.md）

本文件供 Claude Code 及后续协作者快速理解项目约束与编码标准。所有修改必须遵循本规范，确保代码风格、结构与可维护性一致。

---

## 1. 项目概述

这是一个基于 **React + TypeScript + Vite + Tailwind CSS** 构建的个人主页项目。页面包含头像翻转卡片、个人简介、翻页时钟、右键圆形导航菜单等交互元素。

### 1.1 核心目标

- 高性能：首屏资源尽量小，动画使用 CSS/GPU 加速
- 可配置：文案、链接、音频、限制阈值等通过 JSON 配置集中管理
- 可访问性：键盘可操作、ARIA 标签完整、减少用户误操作
- 可维护：组件单一职责、类型清晰、副作用可控

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19（函数组件 + Hooks） |
| 语言 | TypeScript 5.8（`strict: false`，但新代码应尽可能避免 `any`） |
| 构建工具 | Vite 6 |
| 路由 | react-router-dom 7 |
| 样式 | Tailwind CSS 3.4 + 自定义 CSS（`src/styles/`） |
| 状态管理 | Zustand 5（`src/store/`） |
| 图标 | FontAwesome + lucide-react + react-icons |
| 工具库 | clsx + tailwind-merge（`cn` 工具函数） |
| 代码检查 | ESLint 9 + typescript-eslint + eslint-plugin-react-hooks/refresh |

---

## 3. 目录结构

```
home/
├── public/                 # 静态资源，构建时原样复制到 dist/
│   ├── home1.webp
│   ├── home2.webp
│   └── audio/              # 音频文件
├── src/
│   ├── App.tsx             # 根组件，仅负责路由挂载
│   ├── main.tsx            # 应用入口
│   ├── pages/              # 页面级组件
│   │   └── Home.tsx
│   ├── components/         # 可复用/纯展示组件
│   │   ├── AvatarCard.tsx
│   │   ├── CircularMenu.tsx
│   │   ├── FlipClock.tsx
│   │   ├── IntroSection.tsx
│   │   ├── InteractiveGridPattern.tsx
│   │   └── Toast.tsx
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useAudioPlayer.ts
│   │   └── useCircularMenu.ts
│   ├── store/              # Zustand 全局状态
│   │   └── index.ts
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── config/             # JSON 配置文件
│   │   ├── audio.config.json
│   │   ├── features.config.json
│   │   ├── menu.config.json
│   │   └── profile.config.json
│   ├── styles/             # 全局/组件专属 CSS
│   │   ├── index.css
│   │   └── flip-clock.css
│   └── lib/
│       └── utils.ts        # 通用工具函数（cn）
├── docs/                   # 文档与演示
│   └── demo/
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### 3.1 目录职责

- `pages/`：只放顶层页面组件，负责布局与组合，不包含复杂业务逻辑。
- `components/`：只放可复用组件，必须单一职责。
- `hooks/`：封装副作用、DOM 事件、音频播放等可复用逻辑。
- `store/`：全局状态，按业务域拆分 store（目前仅 avatar/menu）。
- `config/`：JSON 配置文件，禁止在组件中硬编码可配置内容。
- `styles/`：全局样式与特殊动画 CSS；组件通用样式优先使用 Tailwind。
- `lib/`：无依赖/轻依赖工具函数。

---

## 4. 命名规范

### 4.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase，与导出组件同名 | `AvatarCard.tsx` |
| Hooks | camelCase，以 `use` 开头 | `useAudioPlayer.ts` |
| Store/工具 | camelCase | `utils.ts`、`index.ts` |
| 配置文件 | kebab-case + `.config.json` | `audio.config.json` |
| 样式文件 | 与组件同名或语义化 | `flip-clock.css` |

### 4.2 变量/函数命名

- 组件名：PascalCase
- Hooks：camelCase，前缀 `use`
- 常量：SNAKE_CASE（模块级配置常量）
- 布尔状态：以 `is`/`has`/`should` 开头，如 `isFlipped`、`isPlaying`
- 事件处理：以 `handle` 开头，如 `handleClick`、`handleKeyDown`
- 回调 props：以 `on` 开头，如 `onClose`、`onPlay`

---

## 5. React 组件规范

### 5.1 组件定义

- 统一使用函数组件 + Hooks。
- 默认导出组件时，文件主键名与组件名一致。
- 组件 props 必须声明类型接口。

```tsx
interface FlipDigitProps {
  digit: string;
}

export function FlipDigit({ digit }: FlipDigitProps) {
  // ...
}
```

### 5.2 组件顺序

单个组件文件内部建议按以下顺序组织：

1. imports
2. 类型/常量定义
3. 组件函数
4. hooks 调用
5. state/ref 定义
6. useEffect 副作用
7. callbacks
8. render

### 5.3 副作用管理

- 所有 `setTimeout`/`setInterval`/`addEventListener` 必须在 `useEffect` 或 callback 中清理。
- 优先使用 `useCallback` 缓存事件处理函数，依赖项必须完整且正确。
- 禁止在 render 阶段产生副作用。

```tsx
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, []);
```

### 5.4 Refs

- DOM ref：使用 `useRef<HTMLElement>(null)`
- 值 ref（不触发渲染）：使用 `useRef<T>(initialValue)`
- 定时器 ref 类型：`ReturnType<typeof setTimeout>`

---

## 6. 状态管理规范

### 6.1 Zustand Store

- 一个文件一个业务域 store，当前 `src/store/index.ts` 包含 `useAvatarStore` 与 `useMenuStore`。
- 状态更新函数应使用函数式更新，避免依赖旧状态时产生竞态。
- 避免在 store 中放置可由组件本地状态管理的数据。

```ts
flip: () =>
  set((state) => ({
    isFlipped: !state.isFlipped,
  })),
```

### 6.2 本地状态 vs 全局状态

| 使用本地状态 | 使用全局状态 |
|-------------|-------------|
| 仅在组件内使用的 UI 状态（如 `isJelly`、`toastVisible`） | 跨组件共享的状态（如 `isFlipped`、`isOpen`） |
| 一次性事件 | 需要持久化或同步的副作用 |

---

## 7. 样式规范

### 7.1 Tailwind 使用原则

- 优先使用 Tailwind 工具类，复杂动画/关键帧使用自定义 CSS。
- 多行 className 使用 `cn()` 合并，提升可读性。
- 响应式断点按移动优先书写：`sm:` → `md:` → `lg:`。
- 避免在 JSX 中写死颜色/尺寸，优先使用设计 token 或 Tailwind 默认值。

```tsx
className={cn(
  "avatar-flip relative cursor-pointer",
  "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80",
  isJelly && "avatar-jelly"
)}
```

### 7.2 自定义 CSS

- 全局变量/重置放在 `src/styles/index.css`。
- 组件专属复杂动画放在 `src/styles/{component}.css`。
- 关键帧命名使用语义化小写，如 `@keyframes jelly`。

### 7.3 可访问性样式

- 自定义按钮必须提供可见焦点环：`focus-visible:ring-*`。
- 图片必须提供 `alt` 属性，装饰性图片使用 `aria-hidden="true"`。

---

## 8. 配置文件规范

所有用户可调整内容必须放入 `src/config/*.config.json`：

- `profile.config.json`：个人信息、头像路径、简介
- `features.config.json`：社交链接、底部/简介区提示文案
- `menu.config.json`：右键圆形菜单项
- `audio.config.json`：音频轨道、音量、点击速率限制、最大并发数

### 8.1 配置读取

- 组件中直接 import JSON，禁止在运行时读取文件系统。
- 配置常量解构后使用大写 SNAKE_CASE 命名。

```tsx
const { maxClicks: MAX_CLICKS_PER_MINUTE, windowMs: CLICK_WINDOW_MS } =
  audioConfig.clickRateLimit;
```

---

## 9. 资源规范

### 9.1 图片

- 头像/大图优先使用 WebP 格式。
- 静态图片放入 `public/`，构建后原样输出到 `dist/`。
- 图片引用路径以 `/` 开头，如 `/home1.webp`。
- 图片必须设置 `draggable={false}` 以防止拖拽干扰点击。

### 9.2 音频

- 音频文件放入 `public/audio/`。
- 播放逻辑封装在 `useAudioPlayer`，避免组件直接操作 `Audio`。
- 必须处理浏览器自动播放限制（`.catch()`）。

---

## 10. 自定义 Hooks 规范

- 文件名以 `use` 开头，函数名以 `use` 开头。
- 返回值应为对象，便于后续扩展。
- 内部副作用（timer、event listener）必须在卸载时清理。
- 涉及全局状态（store）时，明确返回操作结果供调用方响应。

```ts
export interface PlayResult {
  success: boolean;
  reason?: "concurrency";
}

export function useAudioPlayer() {
  // ...
  const play = useCallback((): PlayResult => {
    // ...
  }, []);

  return { play, stopAll };
}
```

---

## 11. 性能与体验

### 11.1 性能

- 图片使用 `loading="lazy"` 或 `loading="eager"`（首屏用 eager）。
- 动画使用 `transform` / `opacity`，避免触发回流。
- 音频播放限制最大并发，防止资源耗尽。
- 速率限制使用滑动窗口，避免内存无限增长。

### 11.2 交互体验

- 头像点击触发音频播放时，限制 1 分钟内最多 60 次。
- 音频最大并发数限制为 15。
- 限制触发时通过 `Toast` 组件给出友好提示，不静默失败。

---

## 12. 代码检查与构建

### 12.1 可用命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run preview    # 预览生产构建
npm run check      # TypeScript 类型检查（无 emit）
npm run lint       # ESLint 检查
```

### 12.2 提交前检查

提交前必须执行：

```bash
npm run check
npm run lint
```

### 12.3 ESLint 规则

- 禁止未使用变量
- 禁止显式 `any`
- 必须遵守 react-hooks/exhaustive-deps
- react-refresh/only-export-components 警告

---

## 13. Git 工作流

- 主分支：`master`
- 新功能/修复从 `master` 切出分支
- 提交信息使用中文，格式：`<type>: <description>`
  - `feat:` 新功能
  - `fix:` 修复
  - `refactor:` 重构
  - `style:` 样式/格式化
  - `docs:` 文档
  - `chore:` 构建/工具
- 提交前确保 `npm run check` 与 `npm run lint` 通过

---

## 14. 禁止事项

- 禁止在组件中硬编码可配置文案、URL、阈值。
- 禁止在 JSX 中写复杂表达式或内联函数（简单事件处理除外）。
- 禁止未清理的 `setTimeout`/`setInterval`/`addEventListener`。
- 禁止在 render 中直接修改 ref.current 或执行副作用。
- 禁止使用 `any` 绕过类型检查（遗留代码逐步清理）。
- 禁止图片默认可拖拽导致误触。

---

## 15. 后续改进方向

- 将 `tsconfig.json` 的 `strict` 逐步开启，提升类型安全。
- 引入 Vitest 进行 hooks 与工具函数单元测试。
- 修复现有 ESLint 告警（`CircularMenu.tsx`、`IntroSection.tsx`）。
- 考虑将 `Toast` 提升为全局 Context，避免多处重复状态。
- 头像翻转目前为一次性，需根据产品意图决定是否支持翻回。

---

*本规范自 2026-06-16 起生效，后续修改需同步更新本文件。*
