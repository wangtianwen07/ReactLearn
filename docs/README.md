# Docs 总览：6 个月 React 企业级中后台路线（每周 10 小时）

> 目标画像：你是 **Java 高级后端**，要转 **全栈/前端为主**；主战场是 **ToB SaaS 中后台**；技术主线是 **React SPA（Vite）**，辅线是 **Next.js（SSR/全栈）**；需要落地 **RBAC（三层：菜单/按钮/数据）**；并覆盖 **微前端（按业务域拆子应用，qiankun）**。

这套路线不是“知识点列表”，而是用一个贯穿式项目把能力做出来：

- 你会最终交付一个可演示的企业级样板工程：**SaaS Admin Platform**
- 过程中持续沉淀：工程规范、权限模型、接口协作约定、测试与 CI、发布回滚策略

---

## 你将得到什么（终局交付物）

### 1) 能拿去面试/入组的作品集（Capstone）

- 一个 ToB 中后台：登录、布局、路由、表格/表单、CRUD、异常处理
- RBAC 三层权限闭环：
  - 菜单/路由可见与可达
  - 按钮/操作权限（action）
  - 数据权限（行级/字段级策略与接口契约）
- 组织架构（部门/岗位/用户/角色/权限）管理
- 工单域（Ticket）最小闭环：创建→流转→处理→完结
- 数据看板域：指标卡 + 趋势图 + 明细钻取
- 微前端：按业务域拆分子应用并独立发布（至少 2 个子应用）
- 可观测性：错误监控、埋点策略、关键性能指标（Core Web Vitals 口径）

### 2) 一套可复用的工程模板与方法论

- React + TS + Vite 企业模板（目录结构、规范、脚本、CI）
- 请求层封装（错误码、重试、取消、并发刷新 token、幂等/防抖）
- 权限中间层（路由守卫、权限组件、数据权限策略）
- 单测/组件测/E2E 最小可用配置
- 微前端基座治理能力（统一导航/会话/权限/公共依赖）

---

## 时间预算与执行方式（每周 10 小时）

**推荐节奏（每周）：**

- 3h：概念学习（只学与你当前阶段任务相关的）
- 5h：编码实践（项目推进、补齐组件/模块）
- 2h：复盘与沉淀（写文档、补测试、做小结、整理 checklist）

**每周最小产出（必须可见）：**

- 至少 1 个可演示功能（页面/流程/组件）
- 至少 1 次可追溯提交（遵循提交规范）
- 至少 1 条复盘记录（写在你自己的日志或 PR 描述中）

---

## 文档导航（按学习顺序）

1. [`00-prerequisites.md`](./00-prerequisites.md)：起点评估、工具链、补课清单、后端→前端映射
2. 第 1 月：[`01-month1-foundations-web-ts.md`](./01-month1-foundations-web-ts.md)：Web/浏览器/TS 基础 + 静态原型
3. 第 2 月：[`02-month2-react18-vite-spa.md`](./02-month2-react18-vite-spa.md)：React18 + SPA 主线（路由/请求/状态/表单）
4. 第 3 月：[`03-month3-engineering-quality.md`](./03-month3-engineering-quality.md)：工程化与质量（规范/测试/CI/可观测性）
5. 第 4 月：[`04-month4-saas-rbac-3layers.md`](./04-month4-saas-rbac-3layers.md)：ToB SaaS + RBAC 三层权限落地
6. 第 5 月：[`05-month5-microfrontend-domain-split.md`](./05-month5-microfrontend-domain-split.md)：微前端（qiankun）按业务域拆分与治理
7. 第 6 月：[`06-month6-nextjs-aux-and-capstone.md`](./06-month6-nextjs-aux-and-capstone.md)：Next.js 辅线 + 总项目收口交付

路线与项目（建议常看）：

- [`roadmap-6months-react-spa.md`](./roadmap-6months-react-spa.md)：24 周一页纸总表
- [`project-saas-admin-practice.md`](./project-saas-admin-practice.md)：贯穿式 ToB SaaS 中后台实战项目说明
- [`java-backend-collaboration.md`](./java-backend-collaboration.md)：与 Spring Boot/JWT/OAuth2/网关协作口径

辅助资料：

- [`90-checklists.md`](./90-checklists.md)：阶段验收清单（可当 PR 模板）
- [`91-mindmap.md`](./91-mindmap.md)：Mermaid 思维导图（路线全景）
- [`92-tech-stack-decisions.md`](./92-tech-stack-decisions.md)：技术选型（ADR 风格：选择/理由/替代/风险）
- [`99-resources.md`](./99-resources.md)：资料索引（按阶段关键字）

---

## 主流技术栈（本路线默认选型）

> 先固化口径，避免“边学边换”导致项目不可收口。

- 包管理：**pnpm**（更快、更适合 monorepo）
- 构建：**Vite**
- 语言：**TypeScript（strict）**
- UI：**Ant Design（ToB 生态成熟）**
- 路由：**React Router v6**
- 服务端状态：**TanStack Query（React Query）**
- 本地状态：**Zustand**（轻量；复杂场景补充 Redux Toolkit 的对比）
- 表单：**React Hook Form + Zod**（性能 + 校验 + 类型）
- 请求：**Axios**（拦截器/取消/兼容性；也说明 fetch 方案边界）
- Mock：**MSW**
- 测试：**Vitest + React Testing Library + Playwright**
- 微前端：**qiankun**（治理能力与落地案例多）
- 规范：ESLint/Prettier/Stylelint + Husky + lint-staged + commitlint

---

## 学习的“企业级标准”是什么？（你要对齐的能力刻度）

你不是要会写页面，而是要具备以下工程能力：

1. **可协作**：目录结构、规范、Code Review 可读性、变更可追溯
2. **可演进**：模块边界清晰、依赖可控、可重构、可替换
3. **可上线**：构建产物可控、发布/灰度/回滚策略清晰
4. **可治理**：权限/审计/可观测性/异常处理一体化
5. **可量化**：性能、稳定性、质量有指标与基线

---

## 最终项目（Capstone）范围（建议固定不再扩）

项目名：**SaaS Admin Platform（单体 SPA → 微前端 → 收口交付）**

业务域（按业务域拆子应用）：

- **基座（shell）**：登录/会话、全局布局、导航、路由守卫、统一权限与公共依赖
- **IAM 域（子应用 A）**：组织、用户、角色、权限、菜单、资源（按钮/接口）
- **Ticket 域（子应用 B）**：工单列表、工单详情、流转操作、处理记录
- **Dashboard 域（可选子应用 C）**：指标/趋势/明细钻取

RBAC 三层：

- 菜单/路由：可见 & 可达
- 按钮：操作级（action）
- 数据：行级 + 字段级（最小先行级，字段级可作为增强项）

---

## 如何使用本仓库

当前仓库以“学习路线文档”为主。后续你开始写代码时，建议采用：

- `apps/`：放应用（spa-shell、iam-app、ticket-app、dashboard-app、next-help-center 等）
- `packages/`：放共享包（ui、utils、api-client、auth、types 等）

如果你希望我下一步直接把 **Vite + React + TS + AntD 的企业模板**也初始化到仓库里，我也可以继续推进。
