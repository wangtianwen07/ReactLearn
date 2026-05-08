# ReactLearn

本仓库用于沉淀 **React 企业级中后台（ToB SaaS）** 的学习路线与项目实践指南。

入口文档：

- [`docs/README.md`](./docs/README.md)
- 24 周总表：[`docs/roadmap-6months-react-spa.md`](./docs/roadmap-6months-react-spa.md)
- 实战项目说明：[`docs/project-saas-admin-practice.md`](./docs/project-saas-admin-practice.md)

## 已初始化的工程模板

当前仓库已经补齐一个可运行的 **pnpm monorepo** 模板：

- `apps/shell`：中后台基座（布局、导航、权限总览、`qiankun` 主应用）
- `apps/iam`：IAM 权限域子应用（用户列表、快速新增用户、RHF + Zod 示例，支持独立运行 + 被主应用挂载）
- `apps/ticket`：工单域子应用（看板、状态筛选、权限提示，支持独立运行 + 被主应用挂载）
- `packages/shared`：公共类型、演示数据、微应用清单
- `packages/auth`：RBAC routeKey/actionKey 与权限判断
- `packages/api`：Axios 工厂 + mock API（可替换真实网关）

## 已补齐的工程化护栏

- ESLint（Flat Config）
- Prettier
- Husky
- lint-staged
- commitlint
- GitHub Actions CI

相关文件：

- [`eslint.config.mjs`](./eslint.config.mjs)
- [`commitlint.config.cjs`](./commitlint.config.cjs)
- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

## 技术栈

- React + TypeScript + Vite
- Ant Design
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- qiankun
- pnpm workspace

## 启动方式

由于当前环境里 `pnpm` 通过 `corepack` 调用，建议使用以下命令：

```powershell
corepack pnpm install
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
corepack pnpm test
corepack pnpm ci
```

## 提交流程

- `pre-commit`：自动执行 `lint-staged`
- `commit-msg`：自动执行 `commitlint`

建议提交信息：

```text
feat: add qiankun shell integration
fix: correct workspace path aliases
chore: add eslint and ci workflow
```

分别启动三个应用：

```powershell
corepack pnpm dev:iam
corepack pnpm dev:ticket
corepack pnpm dev:shell
```

> 推荐顺序：先启动两个子应用，再启动 `shell`，这样访问 `http://localhost:5173/iam` 或 `http://localhost:5173/ticket` 时能直接被主应用挂载。

默认端口：

- Shell: `http://localhost:5173`
- IAM: `http://localhost:5174`
- Ticket: `http://localhost:5175`

## qiankun 路由说明

- Shell 首页：`http://localhost:5173`
- Shell 挂载 IAM：`http://localhost:5173/iam`
- Shell 挂载 Ticket：`http://localhost:5173/ticket`
- IAM 独立运行：`http://localhost:5174`
- Ticket 独立运行：`http://localhost:5175`

## 当前已验证事项

以下命令已在当前仓库实际执行通过：

- `corepack pnpm install`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`

并已确认开发端口可访问：

- `5173`（Shell）
- `5174`（IAM）
- `5175`（Ticket）

## 登录鉴权与路由守卫骨架

当前模板已补齐以下能力：

- 登录页：`/login`
- 受保护路由：未登录自动跳转登录页
- RBAC 路由守卫：无权限自动进入 `403` 页面
- 会话持久化：刷新后自动恢复登录态
- Token 刷新骨架：`401` 并发请求只触发一次 refresh
- 统一请求层：`packages/api` 提供统一 `login / logout / apiClient / getApiErrorMessage`
- 认证失败钩子：refresh 失败后自动清理会话并回到登录页

演示账号：

- `super.admin / Admin@123`
- `org.admin / Admin@123`
- `ticket.agent / Agent@123`

推荐访问路径：

- `http://localhost:5173/login`
- 登录后进入 `http://localhost:5173/`
- 在 Shell 中打开：`/iam`、`/ticket`

关键代码入口：

- `packages/auth/src/index.ts`：会话存储、token 持久化、订阅与 RBAC
- `packages/api/src/index.ts`：统一请求层、登录/退出、refresh 单飞与错误归一化
- `apps/shell/src/auth/LoginPage.tsx`：登录页
- `apps/shell/src/auth/ProtectedRoute.tsx`：路由守卫

## 下一步建议

现在这套模板已经适合作为你的主学习工程。优先继续做这 4 件事：

1. 在 `packages/api` 中接入真实网关与 token 刷新逻辑
2. 在 `shell` 中增加登录页、路由守卫与权限初始化
3. 为 `iam` / `ticket` 接入 MSW 或真实后端接口
4. 为微前端增加统一菜单、全局事件与错误监控
