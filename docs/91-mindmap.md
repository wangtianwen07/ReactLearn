# 91 思维导图（Mermaid）：6 个月企业级 React 中后台全景

> 你可以把本文件直接复制到支持 Mermaid 的平台（GitHub/部分 Markdown 预览）查看。

---

## 91.1 学习路线 Mindmap

```mermaid
mindmap
  root((React 企业级 ToB 中后台 · 6个月 · 10h/周))
    目标交付
      SaaS Admin Platform
        登录与会话
        IAM(组织/用户/角色/权限)
        工单闭环
        数据看板
        微前端按域拆分
        Next.js 帮助中心(辅线)
      方法论沉淀
        工程模板
        权限模型与契约
        测试与CI
        发布回滚
        可观测性
    主线(React SPA/Vite)
      React18
        组件化
        Hooks
        渲染性能热点
        StrictMode 影响
      路由
        React Router v6
        布局路由
        懒加载
        403/404
      状态分层
        URL状态
        服务端状态(TanStack Query)
        本地UI状态(Zustand)
      请求层
        Axios封装
        错误码分层
        取消/重试
        Token刷新(并发控制)
      表单
        React Hook Form
        Zod校验
        复杂联动
      UI
        Ant Design
        业务组件沉淀
    工程化与质量
      规范
        ESLint/Prettier/Stylelint
        Husky/lint-staged
        commitlint
      测试
        Vitest
        React Testing Library
        MSW
        Playwright(E2E)
      CI/CD
        lint/test/build
        制品与版本
        灰度与回滚
      可观测性
        ErrorBoundary
        日志/埋点
        traceId
        Sourcemap策略
      性能
        路由懒加载
        长列表优化
        Bundle体积基线
    ToB专项
      RBAC三层
        菜单/路由
        按钮/操作(actionKey)
        数据权限(行级/字段级)
      审计
        操作日志
        导出/授权等关键动作
      多租户(可扩展)
        tenant隔离
    微前端(qiankun)
      按业务域拆分
        Shell基座
        IAM子应用
        Ticket子应用
        Dashboard子应用(可选)
      治理
        统一会话
        统一权限
        依赖共享
        通信边界
        独立发布
    Next.js辅线
      使用场景
        帮助中心
        文档/公告
        status页
      渲染策略
        CSR/SSR/SSG/ISR(知道取舍)
      与SPA共存
        反向代理路由
```

---

## 91.2 6 个月时间轴（里程碑）

```mermaid
gantt
  title 6个月企业级路线（每周10小时）
  dateFormat  YYYY-MM-DD
  axisFormat  %m月

  section Month1 基础
  Web/浏览器/TS + 静态原型            :m1, 2026-05-01, 30d

  section Month2 SPA 主线
  React/Vite/路由/请求/状态/表单      :m2, after m1, 30d

  section Month3 工程化
  规范/测试/CI/可观测性               :m3, after m2, 30d

  section Month4 RBAC
  菜单/按钮/数据权限 + IAM闭环         :m4, after m3, 30d

  section Month5 微前端
  qiankun基座 + 域拆分 + 独立发布       :m5, after m4, 30d

  section Month6 Next + 收口
  Next.js辅线 + Capstone交付           :m6, after m5, 30d
```

---

## 91.3 微前端域图（推荐的高层结构）

```mermaid
flowchart TB
  subgraph Shell[Shell 基座]
    Nav[导航/菜单]
    Auth[会话/鉴权/Token刷新]
    Perm[权限初始化与守卫]
    Obs[错误监控/埋点/traceId]
    Shared[共享包 packages/*]
  end

  subgraph IAM[IAM 子应用]
    U[用户]
    R[角色]
    M[菜单/资源]
  end

  subgraph Ticket[Ticket 子应用]
    L[工单列表]
    D[工单详情]
    F[流转与处理记录]
  end

  subgraph Dash[Dashboard 子应用(可选)]
    K[指标卡]
    C[趋势图]
    Drill[明细钻取]
  end

  Shell --> IAM
  Shell --> Ticket
  Shell --> Dash

  Auth --> IAM
  Auth --> Ticket
  Perm --> IAM
  Perm --> Ticket
```
