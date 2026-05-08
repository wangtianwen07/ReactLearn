# 99 资料索引（按阶段与关键字）

> 原则：优先官方文档 + 权威实践文章；避免无边界刷视频。

---

## 99.1 第 1 月（Web/浏览器/TS）

### 浏览器与调试

- Chrome DevTools 官方文档：
  - https://developer.chrome.com/docs/devtools/

关键字建议：

- `Chrome DevTools Performance`（性能面板定位卡顿）
- `reflow repaint composite`（渲染流水线）
- `event loop microtask macrotask`（事件循环）

### TypeScript

- TS Handbook（官方）：
  - https://www.typescriptlang.org/docs/handbook/intro.html

关键字建议：

- `TypeScript narrowing type guard`
- `TypeScript generics best practices`

---

## 99.2 第 2 月（React SPA 主线）

### React 官方

- React 官方文档：
  - https://react.dev/

关键字建议：

- `React useEffect dependency`（effect 依赖）
- `React memo useMemo useCallback when`（性能优化边界）

### Vite

- Vite 官方：
  - https://vite.dev/

### React Router

- React Router 官方：
  - https://reactrouter.com/

### Ant Design

- Ant Design 官方：
  - https://ant.design/

### TanStack Query

- TanStack Query 官方：
  - https://tanstack.com/query/latest

### Zustand

- Zustand 官方：
  - https://github.com/pmndrs/zustand

### React Hook Form

- RHF 官方：
  - https://react-hook-form.com/

### Zod

- Zod 官方：
  - https://zod.dev/

---

## 99.3 第 3 月（工程化/测试/CI/可观测）

### ESLint / Prettier

- ESLint： https://eslint.org/
- Prettier： https://prettier.io/

### Vitest / Testing Library

- Vitest： https://vitest.dev/
- React Testing Library： https://testing-library.com/docs/react-testing-library/intro/

### MSW

- MSW： https://mswjs.io/

### Playwright

- Playwright： https://playwright.dev/

关键字建议：

- `sourcemap production security`
- `frontend error monitoring Sentry source map`

---

## 99.4 第 4 月（RBAC/鉴权/数据权限）

关键字建议：

- `RBAC menu permission action permission data scope`
- `refresh token concurrency axios interceptor`
- `authorization vs authentication`（鉴权 vs 认证）

推荐阅读方向：

- 结合你现有 Spring Security / OAuth2 的实践文档
- OpenAPI/Swagger：让前后端契约可生成类型
  - https://swagger.io/specification/

---

## 99.5 第 5 月（微前端 qiankun）

- qiankun 文档：
  - https://qiankun.umijs.org/

关键字建议：

- `micro frontend governance`（治理）
- `micro frontend dependency sharing`（依赖共享）
- `micro frontend routing`（路由）

---

## 99.6 第 6 月（Next.js 辅线）

- Next.js 官方：
  - https://nextjs.org/docs

关键字建议：

- `Next.js SSR SSG ISR difference`
- `reverse proxy route split SPA Next.js`

---

## 99.7 建议你的“学习记录”模板（每周 15 分钟就够）

- 本周交付了什么（可演示的功能）？
- 遇到的 3 个问题是什么？分别如何定位与解决？
- 形成了哪些可复用的规范/工具/组件？
- 下周要降低什么风险（技术债/不确定点）？
