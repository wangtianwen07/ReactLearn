# 与 Java 后端协作指南：Spring Boot + JWT/OAuth2 + 网关（面向 ToB 中后台）

> 目标：把你后端优势转成前端团队的“稳定契约”。这份文档给出前后端最容易扯皮/返工的点，并给出推荐口径。

---

## 1. 接口契约的第一原则：可生成、可验证、可演进

### 1.1 OpenAPI 优先

- 后端：用 Swagger/OpenAPI 输出规范
- 前端：
  - 用 OpenAPI 生成类型（例如 openapi-typescript 之类工具）
  - 将“接口返回类型”视作契约，避免口头对齐

### 1.2 版本与兼容

- 接口变更必须：
  - 兼容旧字段（新增字段不破坏）
  - 删除/重命名字段要给迁移期
- 推荐：接口契约变更写入变更日志（可在 PR 描述中体现）

---

## 2. 统一响应结构与错误码分层（ToB 强烈建议）

### 2.1 统一响应结构（示例口径）

```json
{
  "code": "0",
  "message": "ok",
  "data": {},
  "traceId": "..."
}
```

说明：

- `code`：业务码（字符串或数字都可，但要统一）
- `message`：可面向用户或面向研发（建议再加 i18n key）
- `traceId`：前端展示在错误弹窗中（便于后端查日志）

### 2.2 错误分层建议

- HTTP 状态码：表达认证/授权/网关级异常
- 业务码：表达业务规则（用户名重复、状态不允许流转等）

常见建议：

- `401`：未登录/登录过期
- `403`：无权限（包含数据权限不满足）
- `409`：资源冲突（重复/版本冲突）
- `422`：参数校验失败（可选）

---

## 3. 分页/排序/过滤：把口径写死，前端才能复用组件

### 3.1 分页请求

- 请求：`pageNo`（从 1 开始） + `pageSize`
- 响应：
  - `total`
  - `list`
  - `pageNo/pageSize`（可选）

### 3.2 排序

- `sortBy`：字段名白名单
- `sortOrder`：`asc | desc`

### 3.3 过滤

- 对外开放的过滤字段必须白名单（避免任意 SQL 条件）
- 日期区间建议：`startAt/endAt`（ISO 格式）

---

## 4. 鉴权与会话：JWT/Refresh Token 的前端落地要点

### 4.1 Access + Refresh 的推荐策略

- access token 短期有效（例如 15~60min）
- refresh token 较长期有效（例如 7~30d）
- 刷新接口：`POST /auth/refresh`

### 4.2 前端并发刷新（关键）

- 多个请求同时 401 时：
  - 只允许触发一次 refresh
  - 其他请求等待 refresh 结果
  - refresh 成功后重放请求

> 这部分建议把“并发刷新状态机”写清楚，避免线上偶现 bug。

### 4.3 Token 存储

- ToB 内网常见两种：
  1. localStorage：实现简单，但 XSS 风险更高
  2. httpOnly Cookie：更安全，但要处理 CSRF/SameSite/网关域名

建议：

- 如果你们已有网关 + SSO，优先沿用公司的安全方案；前端只遵循统一口径。

---

## 5. RBAC 三层权限的接口契约建议

### 5.1 权限数据一次性拉取

- `GET /me/permissions`
  - `routes: string[]`（routeKey）
  - `actions: string[]`（actionKey）
  - `dataScopes: Record<string, DataScope>`
  - `fieldPolicies: Record<string, FieldPolicy[]>`

### 5.2 actionKey / routeKey 命名规则

建议使用“域.资源.动作”：

- `iam.user.create`
- `iam.user.delete`
- `ticket.ticket.assign`

---

## 6. 文件上传/下载/导入导出（中后台高频）

### 6.1 上传

- 统一支持：multipart/form-data
- 返回：`fileId/url` + `md5`（可选）
- 前端需要：
  - 进度条
  - 大文件失败重试策略说明

### 6.2 下载

- 导出大文件建议异步：
  - `POST /export` → 返回任务 id
  - `GET /export/{id}` → 查询状态
  - 完成后返回下载链接

---

## 7. 幂等性与重试（前端会自动做的事，要和后端对齐）

- 前端可能因为网络抖动/刷新 token 重放请求而重复提交
- 建议后端对“写请求”支持幂等 key（例如 `Idempotency-Key`）

典型场景：

- 创建工单
- 提交审批
- 支付/扣费（如果有）

---

## 8. 实时通知（可选但很加分）

中后台常见需求：

- 工单被指派/状态变化提示

方案：

- SSE（更简单）
- WebSocket（更强）

前后端要对齐：

- 断线重连策略
- 权限（只能收到自己有权的消息）

---

## 9. CORS、网关与反向代理（联调最常见问题）

- 统一通过网关转发：减少浏览器跨域
- 反向代理建议路径拆分：
  - `/api/*` → 后端
  - `/app/*` → SPA
  - `/help/*` → Next.js

这样可以：

- 同域 cookie
- 统一 CSP/安全头
- 减少联调复杂度

---

## 10. 最终建议：把协作规范变成“代码约束”

你可以把这些口径固化为：

- OpenAPI 生成类型（接口变更自动暴露编译错误）
- 前端请求层统一错误处理（避免每页各写一套）
- 后端错误码枚举与前端映射表（统一提示文案）

这样你会成为“能把前后端拉齐并减少返工”的全栈工程师。
