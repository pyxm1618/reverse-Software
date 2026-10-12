# Reverse Engineer Anything

Reverse Engineer Anything 是一个软件逆向工程工具、反编译器与动态调试框架的精选开源项目索引与发现平台。

当前版本为 **Web 产品首版（V1）**。

> **提示**：当前版本主要建立 Web 站点基础、页面路由体系与 Neon PostgreSQL 真实数据读取链路，**暂未实现真正的反编译运行时、在线沙盒或自动化逆向分析功能**。

---

## 技术栈

- **框架**：Next.js (App Router, Server Component 优先)
- **语言**：TypeScript (Strict 模式)
- **视图库**：React
- **样式**：Tailwind CSS
- **数据库**：Neon PostgreSQL (Serverless)
- **ORM**：Drizzle ORM (`@neondatabase/serverless`, `drizzle-orm`)

---

## 页面路由 (V1)

- `/`：首页（Hero、Featured 精选项目、分类概览、CTA）
- `/explore`：全部项目列表页（从 Neon 数据库读取全部项目数据）
- `/projects/[slug]`：项目详情页（统一动态路由，展示项目信息、官方网站、开源仓库与许可证）

---

## 环境变量配置

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入您的真实 Neon PostgreSQL 连接串：

```env
DATABASE_URL="postgres://username:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> **注意**：`.env.local` 已在 `.gitignore` 中被严格排除，切勿将包含真实凭据的配置文件提交至 Git。

---

## 数据库命令

1. **生成迁移脚本**：
   ```bash
   npm run db:generate
   ```

2. **执行数据库迁移**（在 Neon 中建表）：
   ```bash
   npm run db:migrate
   ```

3. **导入初始化种子数据**（导入 Ghidra、JADX、Frida、mitmproxy、ILSpy、Radare2 等项目）：
   ```bash
   npm run db:seed
   ```

---

## 本地启动与构建

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动本地开发服务**：
   ```bash
   npm run dev
   ```
   打开 [http://localhost:3000](http://localhost:3000) 即可访问。

3. **类型与代码校验**：
   ```bash
   npm run lint
   npm run typecheck
   ```

4. **生产环境构建**：
   ```bash
   npm run build
   npm run start
   ```
