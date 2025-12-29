---
outline: deep
---

# 使用指南

vite-plugin-zip-pack 是一个开源的 [Vite](https://cn.vite.dev/) 插件，用于在构建完成后自动将构建输出目录打包成 ZIP 压缩文件。

## 安装

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

## 基础使用

在 `vite.config.js` 或 `vite.config.ts` 中引入并配置插件：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack()
    ]
})
```

运行 `npm run build` 后，插件会在构建完成后自动将 `dist` 目录打包成 `dist.zip` 文件。

## 使用场景

### 场景 1: 基础打包

最简单的使用方式，使用默认配置：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [zipPack()]
})
```

构建完成后会在项目根目录生成 `dist.zip` 文件。

### 场景 2: 自定义输出路径和文件名

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack({
            inDir: './dist',
            outDir: './output',
            outFileName: 'my-app-v1.0.0.zip'
        })
    ]
})
```

### 场景 3: 添加版本号前缀

如果你希望压缩包内的文件都在一个带版本号的目录下：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack({
            pathPrefix: 'my-app-v1.0.0'
        })
    ]
})
```

这样压缩包内的文件结构会是：
```
my-app-v1.0.0/
  ├── index.html
  ├── assets/
  └── ...
```

### 场景 4: 过滤不需要的文件

排除某些文件或目录：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack({
            filter: (fileName, filePath, isDirectory) => {
                // 排除 .map 文件
                if (fileName.endsWith('.map')) {
                    return false
                }
                // 排除测试文件
                if (fileName.includes('.test.')) {
                    return false
                }
                // 排除 node_modules
                if (isDirectory && fileName === 'node_modules') {
                    return false
                }
                return true
            }
        })
    ]
})
```

### 场景 5: 构建后自动上传

使用回调函数在打包完成后执行自定义操作：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'
import { uploadToServer } from './upload'

export default defineConfig({
    plugins: [
        zipPack({
            done: async (filePath) => {
                console.log(`压缩完成: ${filePath}`)
                // 自动上传到服务器
                await uploadToServer(filePath)
            },
            error: (error) => {
                console.error('压缩失败:', error)
                // 发送错误通知
                sendErrorNotification(error)
            }
        })
    ]
})
```

### 场景 6: 禁用日志和哈希输出

如果不需要详细的日志信息：

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack({
            enableLogging: false,
            enableFileHash: false
        })
    ]
})
```

## 与 CI/CD 集成

### GitHub Actions

```yaml
name: Build and Package

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      # 构建完成后会自动生成 dist.zip
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist-zip
          path: dist.zip
```

### GitLab CI

```yaml
build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist.zip
    expire_in: 1 week
```

## 注意事项

1. **插件执行时机**: 插件在 Vite 构建完成后（`closeBundle` 钩子）执行，确保所有文件都已生成。

2. **目录存在性**: 如果 `inDir` 指定的目录不存在，插件会抛出错误。

3. **文件覆盖**: 如果输出目录已存在同名 ZIP 文件，会被自动覆盖。

4. **路径格式**: `pathPrefix` 必须是相对路径，不能是绝对路径。

5. **性能考虑**: 对于大型项目，打包过程可能需要一些时间，建议在 CI/CD 环境中使用。

## 下一步

- 查看 [配置选项详解](./config.md) 了解所有可用配置
- 查看 [常见问题](../troubleshooting.md) 解决遇到的问题
- 查看 [贡献指南](../contributing.md) 参与项目贡献
