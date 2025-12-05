# 益智解谜游戏

一款 4×4 滑块拼图，使用原生 HTML、CSS、JavaScript 构建，并通过精简的 Node 静态服务器提供服务。

语言：中文 | English: [README.md](README.md)

## 简介

目标是将数字 1–15 排列整齐，空白位位于右下角，即为完成。

## 特性
- 仅生成可解的随机布局（每局都会校验）
- 步数统计与实时计时
- 最佳用时存于 `localStorage`
- 支持方向键操作
- 响应式布局与可访问性标签

## 技术栈
- 前端：`index.html`、`style.css`、`script.js`（原生 JS）
- 服务端：`server.js`（Node `http` 模块）

## 本地运行

1. 安装 Node.js `>=18`。
2. 启动服务器：
   ```bash
   npm start
   ```
3. 打开浏览器访问 `http://localhost:8000`。

## 操作方式
- 点击与空白相邻的方块即可滑动到空位
- 或使用方向键移动空白位

## 配置项
- `PORT`：服务端口（默认 `8000`）
- `HOST`：绑定地址（默认 `0.0.0.0`）

## 项目结构
- `index.html` —— 页面结构与文案
- `style.css` —— 玻璃质感样式与响应式规则
- `script.js` —— 核心游戏逻辑、计时与最佳用时存储
- `server.js` —— 静态文件服务器，包含路径安全处理
- `package.json` —— 项目信息与 `npm start` 启动脚本

## 常见问题
- 若 `npm start` 打印 `npm warn Unknown env config "http-proxy"`，服务器仍可正常启动。该警告来自历史 npm 环境变量，可忽略；若需要可使用 `npm config delete http-proxy` 删除。

## 许可证
MIT

