# Feishu / Git 文档映射

> 这是 `docs/` 目录下文档与飞书文档之间的对应关系清单。
>
> 维护规则：**以后只要 `docs/` 里新增、删除、重命名或重新导入文档，就同步更新这里。**

## 使用方式

- `local file`：仓库里的相对路径，也就是 Git 里看到的文件名
- `Feishu title`：飞书文档标题
- `Feishu URL`：飞书文档访问地址
- `status`：当前状态（`imported` / `pending` / `renamed` 等）
- `last synced`：最近一次同步日期

## 当前映射

| local file                                     | Feishu title                           | Feishu URL                                            | status   | last synced |
| ---------------------------------------------- | -------------------------------------- | ----------------------------------------------------- | -------- | ----------- |
| `docs/README.md`                               | `README`                               | https://my.feishu.cn/docx/ONjwdVAlYoWCAkxh9q2cNN6nnjg | imported | 2026-05-09  |
| `docs/00-prerequisites.md`                     | `00-prerequisites`                     | https://my.feishu.cn/docx/UwkGdIJ1YoLTaAxdoy0cX8xZnoe | imported | 2026-05-09  |
| `docs/01-month1-foundations-web-ts.md`         | `01-month1-foundations-web-ts`         | https://my.feishu.cn/docx/E8IAd4Yx8o9rQixteg9cMmWZnBb | imported | 2026-05-09  |
| `docs/02-month2-react18-vite-spa.md`           | `02-month2-react18-vite-spa`           | https://my.feishu.cn/docx/YHYCd1I9gon5ulxRmrocQxXanth | imported | 2026-05-09  |
| `docs/03-month3-engineering-quality.md`        | `03-month3-engineering-quality`        | https://my.feishu.cn/docx/Hs7HdOJ5kotKbBxOu1ecOSr3nFb | imported | 2026-05-09  |
| `docs/04-month4-saas-rbac-3layers.md`          | `04-month4-saas-rbac-3layers`          | https://my.feishu.cn/docx/Ym4RdXVVcoiOvyxvDOFcxNXQnLc | imported | 2026-05-09  |
| `docs/05-month5-microfrontend-domain-split.md` | `05-month5-microfrontend-domain-split` | https://my.feishu.cn/docx/Pw0ndxpppooh4ixO7vccbDHdnEd | imported | 2026-05-09  |
| `docs/06-month6-nextjs-aux-and-capstone.md`    | `06-month6-nextjs-aux-and-capstone`    | https://my.feishu.cn/docx/VH5hdtGVloD3kRxQ5U4cMoRvn4f | imported | 2026-05-09  |
| `docs/90-checklists.md`                        | `90-checklists`                        | https://my.feishu.cn/docx/Uon8dAIotoH7TDxxV1mcTwJen2c | imported | 2026-05-09  |
| `docs/91-mindmap.md`                           | `91-mindmap`                           | https://my.feishu.cn/docx/E1PtdRX0EoZemQx0mmxcWxIXnWd | imported | 2026-05-09  |
| `docs/92-tech-stack-decisions.md`              | `92-tech-stack-decisions`              | https://my.feishu.cn/docx/Jc8bdqQ37omLJMx0JbWcQn7Anrf | imported | 2026-05-09  |
| `docs/99-resources.md`                         | `99-resources`                         | https://my.feishu.cn/docx/Uw8Vds50uoOIXvxAilecNLcJnlb | imported | 2026-05-09  |
| `docs/java-backend-collaboration.md`           | `java-backend-collaboration`           | https://my.feishu.cn/docx/UGzgdrmMToYvJAxi1rwcQvgXnCb | imported | 2026-05-09  |
| `docs/project-saas-admin-practice.md`          | `project-saas-admin-practice`          | https://my.feishu.cn/docx/HFJjdOV1vodYEOxFDbIc1KJVnbg | imported | 2026-05-09  |
| `docs/roadmap-6months-react-spa.md`            | `roadmap-6months-react-spa`            | https://my.feishu.cn/docx/KkAvdKL8goBtruxIJZ8cY5XLnBb | imported | 2026-05-09  |

## 维护说明

当你后续新增文档时，按下面步骤维护：

1. 在 `docs/` 里新增或修改对应的 Markdown 文件。
2. 导入/更新飞书文档后，把新链接补进本表。
3. 如果文档被重命名，保留旧记录或把 `status` 改为 `renamed`，并补充新路径。
4. 如果某个文档被废弃，保留一行历史记录，不要直接删除，方便回溯。

## 建议约定

- 新文档标题尽量和文件名保持一致，减少查找成本。
- 如果未来需要更严格追踪，可以额外加 `git commit` 或 `feishu token` 列。
- 这个文件就是“Git ↔ 飞书”的索引入口，建议优先维护它。
