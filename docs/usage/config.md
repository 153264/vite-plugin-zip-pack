---
outline: deep
---

# 配置选项

vite-plugin-zip-pack 提供了丰富的配置选项，让你可以根据项目需求进行灵活配置。

## 配置类型定义

```ts
interface PackOptions {
    inDir?: string
    outDir?: string
    outFileName?: string
    pathPrefix?: string
    filter?: (fileName: string, filePath: string, isDirectory: boolean) => boolean
    done?: (filePath: string) => void
    error?: (error: Error) => void
    enableLogging?: boolean
    enableFileHash?: boolean
}
```

## 配置选项详解

### inDir

- **类型**: `string`
- **默认值**: `'./dist'`
- **说明**: 需要打包的目录路径，相对于项目根目录

```ts
zipPack({
    inDir: './dist'  // 打包 dist 目录
})
```

```ts
zipPack({
    inDir: './build'  // 打包 build 目录
})
```

### outDir

- **类型**: `string`
- **默认值**: `'./'`
- **说明**: 输出压缩包的目录路径，相对于项目根目录。如果目录不存在，会自动创建。

```ts
zipPack({
    outDir: './output'  // 输出到 output 目录
})
```

```ts
zipPack({
    outDir: './archives'  // 输出到 archives 目录
})
```

### outFileName

- **类型**: `string`
- **默认值**: `'dist.zip'`
- **说明**: 输出压缩包的文件名，可以包含路径分隔符

```ts
zipPack({
    outFileName: 'my-app.zip'
})
```

```ts
zipPack({
    outFileName: 'my-app-v1.0.0.zip'  // 带版本号
})
```

```ts
zipPack({
    outFileName: 'releases/app.zip'  // 可以包含子目录
})
```

### pathPrefix

- **类型**: `string`
- **默认值**: `''`
- **说明**: 压缩包内的目录前缀。所有文件会被放在这个前缀目录下。。

::: warning
**必须是相对路径**
:::

```ts
zipPack({
    pathPrefix: 'my-app'  // 压缩包内文件位于 my-app/ 目录下
})
```

```ts
zipPack({
    pathPrefix: 'my-app-v1.0.0'  // 带版本号的前缀
})
```

**错误示例**:
```ts
// ❌ 不能使用绝对路径
zipPack({
    pathPrefix: '/my-app'  // 会抛出错误
})

// ✅ 使用相对路径
zipPack({
    pathPrefix: 'my-app'  // 正确
})
```

### filter

- **类型**: `(fileName: string, filePath: string, isDirectory: boolean) => boolean`
- **默认值**: `undefined`（不过滤，包含所有文件）
- **说明**: 文件过滤函数。返回 `true` 表示包含该文件/目录，返回 `false` 表示排除。

**参数说明**:
- `fileName`: 文件或目录的名称
- `filePath`: 文件或目录的完整路径
- `isDirectory`: 是否为目录

```ts
zipPack({
    filter: (fileName, filePath, isDirectory) => {
        // 排除 .map 文件
        if (fileName.endsWith('.map')) {
            return false
        }
        return true
    }
})
```

```ts
zipPack({
    filter: (fileName, filePath, isDirectory) => {
        // 排除测试文件和目录
        if (fileName.includes('.test.') || fileName.includes('.spec.')) {
            return false
        }
        // 排除 node_modules
        if (isDirectory && fileName === 'node_modules') {
            return false
        }
        // 只包含特定类型的文件
        if (!isDirectory) {
            const ext = fileName.split('.').pop()
            return ['html', 'js', 'css', 'json'].includes(ext || '')
        }
        return true
    }
})
```

### done

- **类型**: `(filePath: string) => void`
- **默认值**: `undefined`
- **说明**: 压缩完成后的回调函数。参数是生成的 ZIP 文件的完整路径。

```ts
zipPack({
    done: (filePath) => {
        console.log(`压缩完成: ${filePath}`)
    }
})
```

```ts
zipPack({
    done: async (filePath) => {
        // 可以执行异步操作，如上传到服务器
        await uploadToServer(filePath)
        // 发送通知
        sendNotification('构建完成')
    }
})
```

### error

- **类型**: `(error: Error) => void`
- **默认值**: `undefined`
- **说明**: 压缩过程中发生错误时的回调函数。

```ts
zipPack({
    error: (error) => {
        console.error('压缩失败:', error)
        // 发送错误通知
        sendErrorNotification(error.message)
    }
})
```

### enableLogging

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否输出详细的构建日志。设置为 `false` 可以静默运行。

```ts
zipPack({
    enableLogging: true  // 输出日志
})
```

```ts
zipPack({
    enableLogging: false  // 不输出日志（静默模式）
})
```

**日志输出示例**:
```
Zip packing - "/path/to/dist" folder :
  - Preparing files.
  - Creating zip archive.
  - Done.
  - Created zip archive.
 Zip info 
  - Path: /path/to/dist.zip
  - Size: 1.23 MB
  - Md5: abc123...
  - Sha256: def456...
```

### enableFileHash

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否计算并输出文件的 MD5 和 SHA256 哈希值。设置为 `false` 可以加快打包速度（对于大文件）。

```ts
zipPack({
    enableFileHash: true  // 输出文件哈希值
})
```

```ts
zipPack({
    enableFileHash: false  // 不计算哈希值（更快）
})
```

## 完整配置示例

```ts
import zipPack from '@adjfut/vite-plugin-zip-pack'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        zipPack({
            // 输入目录
            inDir: './dist',
            
            // 输出目录和文件名
            outDir: './output',
            outFileName: 'my-app-v1.0.0.zip',
            
            // 压缩包内路径前缀
            pathPrefix: 'my-app-v1.0.0',
            
            // 文件过滤
            filter: (fileName, filePath, isDirectory) => {
                // 排除 .map 文件
                if (fileName.endsWith('.map')) {
                    return false
                }
                return true
            },
            
            // 完成回调
            done: (filePath) => {
                console.log(`✅ 构建完成: ${filePath}`)
            },
            
            // 错误回调
            error: (error) => {
                console.error('❌ 构建失败:', error)
            },
            
            // 日志和哈希
            enableLogging: true,
            enableFileHash: true
        })
    ]
})
```

## 配置最佳实践

1. **使用环境变量**: 在 CI/CD 环境中，可以使用环境变量动态设置配置：

```ts
zipPack({
    outFileName: process.env.ZIP_NAME || 'dist.zip',
    pathPrefix: process.env.VERSION || ''
})
```

2. **版本管理**: 结合 package.json 的版本号：

```ts
import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

zipPack({
    outFileName: `${pkg.name}-${pkg.version}.zip`,
    pathPrefix: `${pkg.name}-${pkg.version}`
})
```
