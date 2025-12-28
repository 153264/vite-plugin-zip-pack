# [vite-plugin-zip-pack](https://153264.github.io/vite-plugin-zip-pack/)

📦 一个为 [Vite](https://github.com/vitejs/vite) 设计的打包插件。

<!-- [![Lint Status](https://github.com/153264/vite-plugin-zip-pack/workflows/Lint/badge.svg)](https://github.com/153264/vite-plugin-zip-pack/actions)
[![Latest Stable Version](https://poser.pugx.org/153264/vite-plugin-zip-pack/v/stable.svg)](https://packagist.org/packages/153264/vite-plugin-zip-pack)
[![Latest Unstable Version](https://poser.pugx.org/153264/vite-plugin-zip-pack/v/unstable.svg)](https://packagist.org/packages/153264/vite-plugin-zip-pack)
[![Total Downloads](https://poser.pugx.org/153264/vite-plugin-zip-pack/downloads)](https://packagist.org/packages/153264/vite-plugin-zip-pack) -->

<!-- [![npm](https://img.shields.io/npm/v/@153264/vite-plugin-zip-pack)](https://www.npmjs.com/package/@153264/vite-plugin-zip-pack) -->

[![License](https://poser.pugx.org/153264/vite-plugin-zip-pack/license)](https://packagist.org/packages/153264/vite-plugin-zip-pack)

## 功能特性

- 类型安全
- 灵活的配置选项
- 支持文件签名

## 安装

```bash
npm install -D @153264/vite-plugin-zip-pack
```

## 使用示例

```ts
// vite.config.js

import zipPack from '@153264/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [zipPack()]
})
```

## 配置

```ts
const options = {
    /**
     * 需要打包的目录
     * @default `./dist`
     */
    inDir: './dist',
    /**
     * 输出压缩包的目录
     * @default `./`
     */
    outDir: './',
    /**
     * 输出压缩包的名字
     * @default `dist.zip`
     */
    outFileName: 'dist.zip',
    /**
     * 压缩包目录前缀
     * @default ``
     */
    pathPrefix: '',
    /**
     * 文件过滤
     */
    filter: (fileName: string, filePath: string, isDirectory: boolean): boolean => true,
    /**
     * 压缩完成
     */
    done: (filePath: string): void => {},
    /**
     * 压缩异常
     */
    error: (error: Error): void => {},
    /**
     * 是否输出日志
     * @default true
     */
    enableLogging: true,
    /**
     * 是否输出文件Hash
     * @default true
     */
    enableFileHash: true
}
```

## 文档和链接

[官网](https://153264.github.io/vite-plugin-zip-pack/) · [更新策略](https://github.com/153264/vite-plugin-zip-pack/security/policy)

## License

MIT
