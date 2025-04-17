# Nextjs Tailwind Blog

## tempalte

https://github.com/timlrx/tailwind-nextjs-starter-blog

## 技术栈

- Next.js
- Tailwind CSS 3.0

## Installation

```bash

npm install
```

```bash
# install tinymce
npm run postinstall
```

## Development

First, run the development server:

```bash
npm start
```

or

```bash
npm run dev

npm run dev -- --port 3001
```

# dev

- /blog

  - getServerSideProps

- /blog/[...slug]
  - getStaticPaths
  - getStaticProps

# build

Node.js 服务器部署（SSR 必需）
✅ 特点：支持全功能（API 路由、SSR）
🚀 适用：自有服务器、Docker 容器

构建独立包：

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
}
```

生成产物：

```bash
npm run build
```

启动服务：

```bash
node .next/standalone/server.js
```
