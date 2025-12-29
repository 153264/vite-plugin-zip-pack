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
    done?: (file: File) => void
    error?: (error: Error) => void
    logLevel?: LogLevel[] | boolean
}

type LogLevel = 'info' | 'fileHash' | 'error'
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

- **类型**: `(file: File) => void`
- **默认值**: `undefined`
- **说明**: 压缩完成后的回调函数。参数是生成的 ZIP 文件的 `File` 对象，提供了丰富的文件信息和方法。

**File 对象方法**:
- `toString()`: 返回文件的完整路径
- `formatSize()`: 返回格式化的文件大小（如 "1.23 MB"）
- `md5()`: 返回文件的 MD5 哈希值
- `sha256()`: 返回文件的 SHA256 哈希值
- `stat()`: 返回文件的统计信息（Node.js Stats 对象）

```ts
zipPack({
    done: async (file) => {
        console.log(`压缩完成: ${file.toString()}`)
        console.log(`文件大小: ${await file.formatSize()}`)
        console.log(`MD5: ${await file.md5()}`)
        console.log(`SHA256: ${await file.sha256()}`)
    }
})
```

### File 对象

`done` 回调函数接收的 `File` 对象提供了丰富的文件信息和方法，方便你获取和处理生成的 ZIP 文件。

**File 类方法**:

#### toString()

- **返回类型**: `string`
- **说明**: 返回 ZIP 文件的完整路径

```ts
const toString = file.toString()
// 例如: "/path/to/project/dist.zip"
```

#### formatSize()

- **返回类型**: `Promise<string>`
- **说明**: 返回格式化的文件大小（如 "1.23 MB"、"456.78 KB"）

```ts
const size = await file.formatSize()
// 例如: "1.23 MB"
```

#### md5()

- **返回类型**: `Promise<string>`
- **说明**: 返回文件的 MD5 哈希值

```ts
const md5 = await file.md5()
// 例如: "5d41402abc4b2a76b9719d911017c592"
```

#### sha256()

- **返回类型**: `Promise<string>`
- **说明**: 返回文件的 SHA256 哈希值

```ts
const sha256 = await file.sha256()
// 例如: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
```

#### stat()

- **返回类型**: `Promise<Stats>`
- **说明**: 返回文件的统计信息（Node.js Stats 对象），包含文件大小、创建时间、修改时间等信息

```ts
const stats = await file.stat()
console.log(stats.size)        // 文件大小（字节）
console.log(stats.mtime)       // 修改时间
console.log(stats.birthtime)   // 创建时间
```

**完整示例**:

```ts
zipPack({
    done: async (file) => {
        // 获取文件路径
        const path = file.toString()
        
        // 获取格式化的文件大小
        const size = await file.formatSize()
        
        // 获取文件哈希值（用于校验文件完整性）
        const md5 = await file.md5()
        const sha256 = await file.sha256()
        
        // 获取文件统计信息
        const stats = await file.stat()
        
        console.log('文件信息:', {
            path,
            size,
            md5,
            sha256,
            bytes: stats.size,
            modified: stats.mtime
        })
        
        // 可以用于文件校验、上传等操作
        await verifyFileIntegrity(md5, sha256)
        await uploadToCDN(path)
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

### logLevel

- **类型**: `LogLevel[] | boolean`
- **默认值**: `true`
- **说明**: 控制日志输出级别。可以设置为布尔值或日志级别数组。

**日志级别**:
- `'info'`: 输出基本信息（打包进度、文件路径、文件大小等）
- `'fileHash'`: 输出文件哈希值（MD5、SHA256）
- `'error'`: 输出错误信息

```ts
zipPack({
    logLevel: true  // 输出所有日志（等同于 ['info', 'fileHash', 'error']）
})
```

```ts
zipPack({
    logLevel: false  // 不输出任何日志（静默模式）
})
```

```ts
zipPack({
    logLevel: ['info', 'error']  // 只输出信息和错误，不输出文件哈希
})
```

```ts
zipPack({
    logLevel: ['info']  // 只输出基本信息，不输出文件哈希和错误
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

::: tip
如果只需要快速打包而不需要查看日志，可以设置 `logLevel: false` 来提升性能。
:::

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
            done: async (file) => {
                console.log(`✅ 构建完成: ${file.toString()}`)
                console.log(`文件大小: ${await file.formatSize()}`)
            },
            
            // 错误回调
            error: (error) => {
                console.error('❌ 构建失败:', error)
            },
            
            // 日志级别
            logLevel: ['info', 'fileHash', 'error']
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
