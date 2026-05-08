# 04 第 4 月：ToB SaaS + RBAC 三层权限（菜单/按钮/数据）

> 本月定位：中后台的核心不是页面，而是**权限与治理**。你要把 RBAC 做到“前后端一致、可审计、可扩展”。

- 时间预算：4 周 × 10h/周
- 本月产出物（必须）：
  1. 权限口径文档（菜单/按钮/数据三层）+ 接口契约
  2. 前端权限中间层（路由守卫、权限组件、权限按钮、数据范围处理）
  3. IAM 域最小闭环：组织/用户/角色/权限/菜单/资源
  4. 会话与 token 策略：401/刷新 token/并发刷新/踢下线策略（至少文档 + 占位实现）

---

## 4.1 RBAC 三层口径（本路线强制采用）

> “三层一致”是企业级底线：**不可见 / 不可点 / 不可请求** 三者必须一致。

### 4.1.1 菜单/路由权限（Route/Menu）

- 目标：控制“看到什么、能到达哪里”
- 常见实现：后端下发可访问菜单树（含 route key/path）
- 前端落点：
  - 动态路由生成或路由守卫
  - 403/404 页面
  - 菜单渲染与面包屑

### 4.1.2 按钮/操作权限（Action/Button）

- 目标：控制页面内的操作（新增/编辑/删除/导出/审批等）
- 关键：操作权限必须有**稳定的 actionKey**（避免以文案作为权限）
- 前端落点：
  - `<Can action="user.create">` 或 `useCan('user.create')`
  - 统一禁用/隐藏策略

### 4.1.3 数据权限（Data Scope：行级 + 字段级）

- 行级：本部门/本租户/本人/自定义范围
- 字段级：例如手机号/成本价/薪资等敏感字段
- 前端落点：
  - 行级：查询条件中透传 `dataScope` 或后端基于 token 解析
  - 字段级：后端返回脱敏/置空；前端仅做展示控制（不能依赖前端隐藏保障安全）

**原则：数据权限必须以后端为准，前端只做体验与一致性。**

---

## 4.2 建议的权限数据模型（与你的 Java 后端对齐）

> 下面是“建议口径”，你可按实际表结构调整，但前后端必须统一。

### 核心实体

- `User`
- `OrgUnit`（部门/组织）
- `Role`
- `Permission`（可按类型区分：menu/action/resource/data）
- `Menu`（可选：也可视为一种 Permission）
- `Resource`（API 资源；可用于前端请求拦截/审计）

### 推荐字段（示例）

- `Menu`: `id`, `name`, `path`, `icon`, `order`, `parentId`, `routeKey`
- `Action`: `actionKey`（如 `iam.user.create`）, `name`, `module`
- `DataScope`:
  - `scopeType`: `ALL | DEPT | DEPT_AND_CHILD | SELF | CUSTOM`
  - `customDeptIds`: `string[]`
- `FieldPolicy`: `{ fieldKey: string, readable: boolean, writable: boolean, mask?: 'phone' | 'email' | ... }`

---

## 4.3 前后端接口契约（建议写进 OpenAPI）

### 登录与会话

- `POST /auth/login` → `{ accessToken, refreshToken, expiresIn, user }`
- `POST /auth/refresh` → `{ accessToken, refreshToken, expiresIn }`
- `POST /auth/logout`

### 权限与菜单

- `GET /me` → user profile
- `GET /me/permissions` →
  - `routes: string[]`（route keys）
  - `actions: string[]`（action keys）
  - `dataScopes: Record<string, DataScope>`（按模块/资源归类）
  - `fieldPolicies: Record<string, FieldPolicy[]>`
- `GET /me/menus` → menu tree

### IAM 管理（示例）

- `GET /iam/users`（分页 + 条件）
- `POST /iam/users`
- `PUT /iam/users/{id}`
- `DELETE /iam/users/{id}`
- `GET /iam/roles` ...
- `POST /iam/roles/{id}/grant` ...

### 错误码建议

- `401`：未登录/登录过期
- `403`：无权限（含 data scope 触发）
- `409`：冲突（如用户名重复）
- 业务码：例如 `IAM_1001`（更适合中后台做精确提示）

---

## 4.4 前端落地方案（你要写出来的模块）

### 4.4.1 权限缓存与初始化

- 登录后拉取：`me`、`menus`、`permissions`
- 缓存策略：
  - 进程内：Zustand 或 Context
  - 持久化：可选（localStorage），但要处理过期与更新

### 4.4.2 路由守卫（Route Guard）

- 未登录：跳转 `/login`
- 已登录但无路由权限：展示 403
- 动态菜单：根据 `menus` 渲染 Sidebar

### 4.4.3 按钮权限组件（Action Guard）

- 形态建议：
  - `useCan(actionKey)`
  - `<Can action="iam.user.create">...</Can>`
- 策略：
  - 默认隐藏（更安全）
  - 或默认禁用 + tooltip（更可解释）

### 4.4.4 数据权限（Data Scope）

- 行级：
  - 查询时携带 `scope`（如果后端需要）
  - UI 上给出范围提示（例如“当前仅能查看本部门数据”）
- 字段级：
  - 优先后端脱敏
  - 前端展示层根据 `fieldPolicies` 决定是否显示/是否可编辑

---

## 4.5 Token 刷新与并发刷新（必须掌握的企业坑）

> 这是你从后端视角最容易做对的地方：前端的坑在于并发。

推荐策略：

1. access token 过期返回 401
2. 触发 refresh（只允许一次 refresh 在飞行中）
3. 其他 401 请求等待 refresh 结果后重放
4. refresh 失败：清理会话 → 跳转登录

你在本月必须产出：

- 刷新并发策略的文字说明（状态机图更好）
- 请求层占位实现（第 4 月末至少能跑通）

---

## 4.6 每周安排（10h/周）

### Week 1：权限口径与接口契约落地（先写清楚再写代码）

- 产出：RBAC 三层口径文档 + OpenAPI 草案
- 把 actionKey、routeKey、dataScope 命名规则写死

**验收：**你能拿这份文档跟后端/产品/测试对齐，不会各说各话。

---

### Week 2：菜单/路由权限落地

- 动态菜单渲染
- 路由守卫（401/403）

**验收：**换一个权限较少的账号，菜单和路由访问都会被限制。

---

### Week 3：按钮权限 + 审计（操作日志）

- 权限按钮组件
- 关键操作埋点/审计：
  - 创建/删除/授权/导出 等

**验收：**无权限账号看不到/点不了按钮；即使手动调用接口也会被后端拒绝且前端提示一致。

---

### Week 4：数据权限（行级 + 字段级）与会话策略收口

- 行级：至少实现 2 种 scope（如 ALL/DEPT/SELF）
- 字段级：实现 1 个示例字段（比如手机号脱敏/不可编辑）
- token 并发刷新跑通（或完成可运行 PoC）

**验收：**同一页面不同账号看到的数据范围不同；敏感字段策略一致。

---

下一章进入第 5 月：微前端（qiankun）按业务域拆分与治理。
