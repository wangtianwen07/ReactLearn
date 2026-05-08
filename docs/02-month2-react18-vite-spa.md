# 02 第 2 月：React18 + Vite SPA 主线（路由/请求/状态/表单）

> 本月定位：从“能写页面”升级到“能写一个可扩展的中后台 SPA 基座”。你要把常见企业能力模块化：路由体系、请求层、状态分层、表单与校验、通用组件。

- 时间预算：4 周 × 10h/周
- 本月产出物（必须）：
  1. `spa-shell`（单体 SPA 基座）：可登录、可导航、可 CRUD（先 Mock）
  2. 统一请求层（含错误码分层、Token 刷新策略占位）
  3. 统一状态分层：URL/服务端状态/本地 UI 状态清晰
  4. 通用业务组件：表格页模板、查询表单模板、详情抽屉/弹窗模板

---

## 2.1 技术栈落地（本路线默认）

- React 18 + TypeScript + Vite
- UI：Ant Design
- Router：React Router v6
- 服务端状态：TanStack Query
- 本地状态：Zustand
- 表单：React Hook Form + Zod
- 请求：Axios（拦截器 + 取消 + 统一错误处理）
- Mock：MSW（让你在无后端/后端不稳定时也能推进）

> 为什么这样选：这套组合在 ToB 中后台是“高频且稳定”的主流解。

---

## 2.2 React 要掌握到什么程度（面向交付）

你不需要把 React 原理背成教材，但必须能稳定处理这些交付问题：

- 组件拆分：页面组件 vs 领域组件 vs 通用组件
- Hook 使用边界：
  - `useEffect` 依赖正确（避免重复请求/无限循环）
  - `useMemo/useCallback` 用在“稳定引用/性能热点”而不是滥用
- 渲染性能常见坑：长列表、频繁 setState、无意义重渲染
- 并发相关：知道 StrictMode 可能导致开发环境 effect 触发两次

---

## 2.3 推荐的目录结构（先约定，后续微前端与 monorepo 会升级）

单体 SPA 期建议：

- `src/app/`：应用入口（router、providers、layout）
- `src/pages/`：路由页面
- `src/features/`：按业务特性分（更贴近 ToB）
- `src/components/`：可复用组件
- `src/services/`：请求层 + API client
- `src/stores/`：Zustand stores（仅放 UI/本地状态）
- `src/types/`：领域类型
- `src/utils/`：通用工具

原则：**按“变更原因”分层**，不要按“技术名词”堆文件。

---

## 2.4 每周安排（10h/周）

### Week 1：初始化 SPA 基座（路由/布局/登录骨架）

**学习重点（3h）：**

- React Router：嵌套路由、布局路由、懒加载
- Ant Design 布局组件与中后台常用组件

**编码练习（5h）：**

- 完成：登录页 + 主布局（Header/Sidebar/Content）
- 路由体系：
  - `/login`
  - `/dashboard`
  - `/iam/users`、`/iam/roles`（先占位）
- 页面骨架统一：
  - loading / empty / error（先占位组件）

**复盘（2h）：**

- 写“路由与布局怎么组织”的笔记：为何采用布局路由？

**验收：**

- 登录成功进入布局；刷新不丢路由；懒加载生效（chunk 可见）

---

### Week 2：请求层封装 + MSW Mock（让项目可持续推进）

**学习重点（3h）：**

- Axios 拦截器
- 错误处理分层：网络错误/鉴权错误/业务错误
- MSW 基本用法（拦截 fetch/xhr）

**编码练习（5h）：**

- 统一 `apiClient`：
  - 统一 baseURL、超时、header
  - 统一错误对象（包含 `code/message/traceId`）
- 统一登录态策略（先占位，4 月会做严谨版）：
  - 401 → 跳转登录
  - token 存储策略说明（localStorage vs cookie）
- 接入 MSW：
  - mock 登录
  - mock 用户列表分页

**复盘（2h）：**

- 写“为什么要用 MSW，而不是写死假数据”的说明

**验收：**

- 在无后端情况下，用户列表页能真实分页与筛选（由 MSW 返回）

---

### Week 3：状态分层：TanStack Query + Zustand（把状态管住）

**学习重点（3h）：**

- 服务端状态（Query） vs 本地 UI 状态（Store） vs URL 状态

**编码练习（5h）：**

- 用户列表：
  - 查询参数进 URL（可复制链接复现状态）
  - 列表数据用 Query 管（缓存、loading、error）
  - 弹窗开关/选中行等用 Zustand 管（本地 UI 状态）

**复盘（2h）：**

- 写“为什么不把一切都塞到 Redux/Store”

**验收：**

- 刷新页面：URL 能恢复筛选条件；Query 正确拉取；UI 状态合理重置

---

### Week 4：表单体系：React Hook Form + Zod（复杂表单的基础）

**学习重点（3h）：**

- RHF 控制/非控制组件
- Zod：运行时校验 + TS 类型推导

**编码练习（5h）：**

- 新增/编辑用户：
  - 表单校验（必填/格式/长度/异步校验占位）
  - 提交成功刷新列表（Query invalidation）
- 详情页：抽屉/弹窗展示 + 编辑入口

**复盘（2h）：**

- 总结：表单为什么是中后台最容易写成灾难的模块？你如何避免？

**验收：**

- 表单校验清晰、可维护；错误提示统一；提交过程有 loading 防重复

---

## 2.5 本月“企业级验收标准”（达标即进入第 3 月工程化）

1. 路由与布局：支持多层路由、懒加载、404/403 页面占位
2. 请求层：错误分层统一，页面不直接处理底层 axios 错误
3. 状态分层：
   - 列表数据属于服务端状态（Query）
   - UI 弹窗属于本地状态（Store）
   - 筛选条件属于 URL 状态（可分享、可回放）
4. 表单：校验与类型一致，可扩展复杂联动

下一章进入第 3 月：工程化与质量体系（让项目能多人协作与上线）。
