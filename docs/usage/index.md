---
outline: deep
---

# vite-plugin-zip-pack

vite-plugin-zip-pack 是一个开源的 [Vite](https://cn.vite.dev/) 非官方插件。<br/>
安装非常简单，因为它是一个标准的 [Npm](https://www.npmjs.com/) 包。

## 安装

```shell:no-line-numbers
npm install -D @adjfut/vite-plugin-zip-pack
```

## 使用
```ts
// vite.config.js

import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [zipPack()],
})
```

## 开始之前

在你动手写代码之前，建议您首先阅读以下内容：

- [配置](./config.md)

## 参与贡献

我们欢迎广大开发者贡献大家的智慧，让我们共同让它变得更完美。<br/>
您可以在 GitHub 上提交 Pull Request，我们会尽快审核并公布。<br/>
更多信息请参考 [贡献指南](/contributing.md)。
