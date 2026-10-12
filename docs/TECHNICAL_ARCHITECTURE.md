# Reverse Engineer Anything 技术架构

> 状态：V1 架构基线  
> 更新时间：2026-10-12  
> 适用仓库：`pyxm1618/reverse-Software`

## 1. 架构目标

本项目是一个面向大量开源逆向工程工具的 Web 平台。当前阶段以项目索引、发现、详情页和真实数据库读取为主；后续逐步支持在线工具运行。

架构目标：

- 前期基础设施成本尽量为 0；
- 静态内容、大文件和工具资源尽量走 Cloudflare 边缘网络；
- 可在浏览器执行的工具优先在浏览器本地运行，避免服务端计算成本；
- 动态 API 和 SSR 使用 Cloudflare Workers；
- 大文件、WASM、工具包、用户上传文件使用 Cloudflare R2；
- 结构化业务数据继续使用 Neon PostgreSQL；
- 后续真正需要重计算时，再独立接入 Sandbox / Containers，不提前引入；
- 从一开始区分“静态分发、轻计算、重计算”，避免后续整体迁移。

---

## 2. 总体架构

```text
                        ┌──────────────────────────┐
                        │        用户浏览器         │
                        └────────────┬─────────────┘
                                     │ HTTPS
                                     ▼
                        ┌──────────────────────────┐
                        │   Cloudflare DNS / CDN   │
                        │       WAF / Cache        │
                        └────────────┬─────────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │                                   │
                   ▼                                   ▼
        ┌─────────────────────┐             ┌─────────────────────┐
        │ Workers Static      │             │ Cloudflare Workers  │
        │ Assets              │             │ SSR / API / 业务逻辑 │
        │ HTML/CSS/JS/图片    │             └──────────┬──────────┘
        └─────────────────────┘                        │
                                                     │
                               ┌─────────────────────┼─────────────────────┐
                               │                     │                     │
                               ▼                     ▼                     ▼
                    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
                    │ Neon PostgreSQL  │  │ Cloudflare R2    │  │ Future: Sandbox  │
                    │ 结构化业务数据    │  │ 大文件/上传/WASM │  │ / Containers     │
                    └──────────────────┘  └──────────────────┘  │ 重型逆向计算      │
                                                               └──────────────────┘
```

---

## 3. 各层职责

### 3.1 Cloudflare DNS / CDN

职责：

- 托管域名 DNS；
- HTTPS / TLS；
- CDN 和边缘缓存；
- 基础 DDoS 防护；
- 后续按需增加 WAF、Rate Limit、Bot 防护。

原则：

- 正式域名统一接入 Cloudflare；
- 静态资源必须允许合理缓存；
- 大文件尽量避免穿透到应用层。

### 3.2 Cloudflare Workers

Workers 是本项目的应用运行层，负责动态请求。

当前职责：

- Next.js 动态路由；
- SSR；
- API；
- 服务端业务逻辑；
- Neon 数据库访问；
- 后续签名上传 URL、权限校验、任务状态等轻量逻辑。

禁止承担：

- 长时间 CPU 密集型反编译；
- 大型二进制程序长期运行；
- 大文件长期缓存在 Worker 内存中；
- 将 Worker 当传统 VPS 使用。

### 3.3 Workers Static Assets

Static Assets 与 Worker 属于同一套部署体系，不需要单独申请一个“服务器”。

负责：

- HTML；
- CSS；
- 客户端 JavaScript；
- 图标；
- 普通图片；
- 前端构建产物；
- 适合直接边缘分发的静态文件。

原则：

- 静态内容尽量不进入 Worker 动态执行；
- 文件名使用内容哈希，支持长期缓存；
- 图片使用 WebP / AVIF 等现代格式；
- 大型工具包、用户上传文件不放 Static Assets，交给 R2。

### 3.4 Cloudflare R2

R2 是本项目的大文件对象存储层。

适合存放：

- WASM；
- 工具运行资源；
- ZIP / TAR 等工具包；
- 大型 JSON / 字典 / 规则库；
- 用户上传的 APK、EXE、DLL、IPA 等文件；
- 分析结果文件；
- 后续需要分发的大型静态资源。

不适合存放：

- 用户、项目、任务等关系型结构化数据；
- 需要复杂查询和事务的数据。

建议至少逻辑区分：

```text
tools/
uploads/
results/
assets/
```

后续如上传量增大，应分别设置生命周期规则，例如自动删除临时上传和过期分析结果。

### 3.5 Neon PostgreSQL

Neon 保持现有数据库职责。

存放：

- 项目目录；
- 工具元数据；
- 分类；
- 许可证信息；
- 项目 URL；
- 用户信息（后续）；
- 在线任务记录（后续）；
- R2 对象 key / URL / 状态；
- 分析结果索引。

不存放：

- APK；
- EXE；
- ZIP；
- WASM；
- 图片大文件；
- 工具二进制；
- 大型分析产物。

原则：数据库只保存“结构化数据与索引”，对象内容进入 R2。

---

## 4. 在线工具的执行策略

必须按以下优先级设计。

### Level 1：浏览器本地执行 —— 首选

适用于：

- JavaScript 工具；
- WebAssembly 工具；
- 可完全在客户端运行的解析器。

路径：

```text
R2 / Static Assets
      ↓
浏览器下载工具
      ↓
用户本机 CPU 执行
      ↓
结果直接在浏览器显示
```

优点：

- 几乎不产生服务端 CPU 成本；
- 易于承受高并发；
- 用户文件可不离开本机，隐私更好。

### Level 2：Workers 轻计算

适用于：

- 元数据解析；
- 轻量 API；
- 权限校验；
- 数据库读写；
- 任务创建；
- 小型数据转换。

### Level 3：Sandbox / Containers —— 后续再引入

适用于：

- JADX；
- Ghidra；
- radare2；
- Java / Python / Native 二进制工具；
- 长时间 CPU / 内存任务；
- 需要独立文件系统和进程隔离的任务。

当前 V1 不部署这一层，只保留架构接口。

---

## 5. 数据流

### 5.1 普通页面访问

```text
用户
→ Cloudflare CDN
→ Static Assets（静态内容）
或
→ Worker（SSR / API）
→ Neon（需要数据时）
```

### 5.2 大文件下载

```text
用户
→ Cloudflare CDN
→ R2
```

尽量不让 Worker 代理整个大文件传输。

### 5.3 用户上传（后续）

推荐：

```text
用户
→ Worker 请求授权
→ Worker 生成受控上传信息
→ 浏览器直接上传 R2
→ Worker 记录元数据到 Neon
```

避免：

```text
用户
→ Worker 接收整个大文件
→ Worker 再转发 R2
```

### 5.4 在线重计算（后续）

```text
用户
→ Worker 创建任务
→ R2 保存输入文件
→ Sandbox / Container 执行
→ 结果写入 R2
→ Neon 保存状态与索引
→ 用户读取结果
```

---

## 6. 成本设计

### 前期可保持免费或接近 0 成本

- Cloudflare DNS：基础使用免费；
- Cloudflare CDN：基础使用免费；
- Workers Free：先使用免费额度；
- Workers Static Assets：静态资源分发按 Cloudflare 当前免费政策使用；
- R2：先使用免费存储和请求额度；
- R2 互联网出口流量：按 Cloudflare 当前政策为 0 egress fee；
- Neon：继续使用当前免费计划。

### 后续最可能产生费用的部分

1. R2 存储持续增长；
2. R2 请求次数超过免费额度；
3. Worker 动态请求 / CPU 超过免费额度；
4. Neon 数据量和计算量超过免费计划；
5. 后续启用 Sandbox / Containers 的 CPU、内存、磁盘费用。

原则：

- 不提前购买高配；
- 先用免费额度上线；
- 根据真实 Usage 再升级；
- 任何重计算能力上线前必须单独做成本上限和滥用防护。

> Cloudflare 和 Neon 的免费额度及价格可能调整，正式扩容前必须以官方当期 Pricing 为准。

---

## 7. 缓存策略

### Static Assets

- 带内容哈希的 JS / CSS / 图片：长期缓存；
- HTML / 动态页面：按页面特性设置；
- 不对用户私有数据进行公共缓存。

### R2 公共工具资源

- 使用独立资源域名，例如：`assets.<domain>`；
- 对版本化资源使用长缓存；
- 文件路径必须带版本或内容哈希；
- 避免同一个 URL 对应不同内容。

### 用户上传

- 默认私有；
- 不直接暴露公共 Bucket；
- 使用受控访问或短期签名；
- 设置生命周期，自动清除临时文件。

---

## 8. 安全与滥用控制

该项目未来允许用户上传和运行逆向工具，风险高于普通内容站。

必须遵守：

- 用户上传文件与应用运行环境隔离；
- 上传文件不能直接执行；
- 文件大小限制；
- MIME / 魔数 / 扩展名多重校验；
- 上传频率限制；
- API Rate Limit；
- Worker 不保存长期敏感文件；
- 临时 R2 文件自动过期；
- 重计算必须进入隔离 Sandbox / Container；
- 每个计算任务设置 CPU、内存、时长和并发上限；
- 禁止让用户提交任意系统命令；
- 记录必要审计日志；
- Secret 只存 Cloudflare Secret / 环境变量，不进入 Git。

---

## 9. 环境变量与 Secret

当前至少需要：

```env
DATABASE_URL=
```

未来可能增加：

```env
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=
```

注意：

- R2 如果通过 Worker Binding 访问，优先使用 Binding，而不是在代码中保存 Access Key；
- 所有生产 Secret 在 Cloudflare 环境中配置；
- `.env.local` 仅用于本地开发；
- 不允许提交真实数据库连接串、Token、API Key。

---

## 10. 部署模型

目标：

```text
GitHub main
   ↓
Cloudflare Build / Deploy
   ↓
Cloudflare Worker + Static Assets
   ↓
正式域名
```

推荐：

- GitHub 作为唯一代码源；
- Production 只跟踪 `main`；
- PR 先通过 CI，再合并；
- Preview 与 Production 分开；
- 正式环境变量只配置在 Cloudflare；
- Neon Production 数据库与本地开发配置分离。

---

## 11. 当前实施顺序

### Phase 1 — 现在

1. 将域名接入 Cloudflare；
2. 开通 / 创建 Workers 项目；
3. 配置 Static Assets；
4. 开通 R2；
5. 创建项目专用 R2 Bucket；
6. 将 GitHub 仓库连接到 Cloudflare 部署；
7. 在 Cloudflare 配置 `DATABASE_URL`；
8. 完成 Next.js 到 Workers 的部署适配；
9. 绑定正式域名；
10. 验证首页、`/explore`、`/projects/[slug]` 与 Neon 真实数据读取。

### Phase 2 — 有大型工具资源时

1. 工具包、WASM、大文件迁入 R2；
2. 绑定独立资源域名；
3. 设置缓存；
4. 设置 R2 生命周期；
5. 前端改为直接访问 CDN / R2 资源。

### Phase 3 — 开始用户上传时

1. 私有上传 Bucket / 前缀；
2. 受控直传；
3. 文件限制；
4. 生命周期；
5. Rate Limit；
6. 任务记录进入 Neon。

### Phase 4 — 真正在线运行重型逆向工具时

1. 评估 Sandbox / Containers；
2. 单独设计任务队列；
3. 隔离执行；
4. 资源限额；
5. 成本上限；
6. 安全审计；
7. 只对确实无法浏览器本地执行的工具启用。

---

## 12. 当前明确不需要的组件

V1 暂不引入：

- Cloudflare Pages；
- Cloudflare D1；
- Cloudflare KV；
- Durable Objects；
- Queues；
- Sandbox；
- Containers。

只有出现明确业务需求后再增加，避免过度设计。

---

## 13. 当前架构基线

当前正式基线：

```text
Cloudflare Workers
+ Workers Static Assets
+ Cloudflare R2
+ Neon PostgreSQL
+ GitHub
```

核心原则：

> 静态内容走边缘，结构化数据进 Neon，大文件进 R2；能在浏览器运行的工具绝不优先放到服务端运行。只有真正需要重型计算时，才引入隔离 Sandbox / Containers。
