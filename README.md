# vite-plugin-zip-pack

📦 一个为 [Vite](https://github.com/vitejs/vite) 设计的打包插件，用于在构建完成后自动将构建输出目录打包成 ZIP 压缩文件。

[![Lint Status](https://github.com/153264/vite-plugin-zip-pack/workflows/Lint/badge.svg)](https://github.com/153264/vite-plugin-zip-pack/actions)
[![Test Status](https://github.com/153264/vite-plugin-zip-pack/workflows/Test/badge.svg)](https://github.com/153264/vite-plugin-zip-pack/actions)
[![npm](https://img.shields.io/npm/v/@adjfut/vite-plugin-zip-pack)](https://www.npmjs.com/package/@adjfut/vite-plugin-zip-pack)
[![License](https://img.shields.io/npm/l/@adjfut/vite-plugin-zip-pack)](LICENSE)

## ✨ 功能特性

- 🎯 **类型安全** - 完整的 TypeScript 类型定义
- ⚙️ **灵活配置** - 丰富的配置选项，满足各种使用场景
- 🔒 **文件签名** - 支持输出文件的 MD5 和 SHA256 哈希值
- 📝 **详细日志** - 清晰的构建日志输出
- 🎨 **自定义过滤** - 支持自定义文件过滤规则
- 🚀 **零配置** - 开箱即用，默认配置即可满足大部分需求

## 📦 安装

使用 npm:

```bash
npm install -D @adjfut/vite-plugin-zip-pack
```

使用 pnpm:

```bash
pnpm add -D @adjfut/vite-plugin-zip-pack
```

使用 yarn:

```bash
yarn add -D @adjfut/vite-plugin-zip-pack
```

## 🚀 快速开始

### 基础使用

在 `vite.config.js` 或 `vite.config.ts` 中引入并配置插件：

```ts
import { defineConfig } from 'vite';
import zipPack from '@adjfut/vite-plugin-zip-pack';

export default defineConfig({
    plugins: [zipPack()]
});
```

运行构建命令后，插件会自动将 `dist` 目录打包成 `dist.zip` 文件。

### 自定义配置

```ts
import { defineConfig } from 'vite';
import zipPack from '@adjfut/vite-plugin-zip-pack';

export default defineConfig({
    plugins: [
        zipPack({
            inDir: './dist',
            outDir: './output',
            outFileName: 'my-app.zip',
            pathPrefix: 'my-app',
            enableFileHash: true,
            enableLogging: true
        })
    ]
});
```

## 📖 配置选项

| 选项          | 类型                                                            | 默认值       | 说明                 |
| ------------- | --------------------------------------------------------------- | ------------ | -------------------- |
| `inDir`       | `string`                                                        | `'./dist'`   | 需要打包的目录路径   |
| `outDir`      | `string`                                                        | `'./'`       | 输出压缩包的目录路径 |
| `outFileName` | `string`                                                        | `'dist.zip'` | 输出压缩包的文件名   |
| `pathPrefix`  | `string`                                                        | `''`         | 压缩包内的目录前缀   |
| `filter`      | `function(fileName: string,filePath: string,isDirectory: boolean)` | `undefined`  | 文件过滤函数         |
| `done`        | `function(file: File)`                                           | `undefined`  | 压缩完成回调         |
| `error`       | `function(error: Error)`                                         | `undefined`  | 压缩异常回调         |
| `logLevel`    | `boolean` \| `['info','fileHash','error']`                      | `true`       | 是否输出日志         |

### 配置示例

#### 文件过滤

```ts
zipPack({
    filter: (fileName, filePath, isDirectory) => {
        // 排除 .map 文件
        if (fileName.endsWith('.map')) {
            return false;
        }
        // 排除 node_modules 目录
        if (isDirectory && fileName === 'node_modules') {
            return false;
        }
        return true;
    }
});
```

#### 自定义回调

```ts
zipPack({
    done: (file) => {
        console.log(`压缩完成: ${file.toString()}`);
        // 可以在这里执行上传、通知等操作
    },
    error: (error) => {
        console.error('压缩失败:', error);
        // 错误处理逻辑
    }
});
```

#### 添加路径前缀

```ts
zipPack({
    pathPrefix: 'my-app-v1.0.0'
    // 压缩包内的文件将位于 my-app-v1.0.0/ 目录下
});
```

## 📚 更多文档

- [完整文档](https://153264.github.io/vite-plugin-zip-pack/)
- [配置选项详解](https://153264.github.io/vite-plugin-zip-pack/usage/config)
- [常见问题](https://153264.github.io/vite-plugin-zip-pack/troubleshooting)
- [贡献指南](https://153264.github.io/vite-plugin-zip-pack/contributing)

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](docs/contributing.md) 了解详细信息。

## 📄 License

[MIT](LICENSE)

## 🔗 相关链接

- [GitHub](https://github.com/153264/vite-plugin-zip-pack)
- [npm](https://www.npmjs.com/package/@adjfut/vite-plugin-zip-pack)
- [问题反馈](https://github.com/153264/vite-plugin-zip-pack/issues)
