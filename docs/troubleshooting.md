---
outline: deep
---

# 常见问题

本文档收集了使用 vite-plugin-zip-pack 时可能遇到的常见问题及其解决方案。

## 构建相关问题

### Q: 构建时提示 "folder does not exist" 错误

**问题描述**: 
```
Error: - "./dist" folder does not exist!
```

**原因**: 指定的 `inDir` 目录不存在。

**解决方案**:
1. 确保 Vite 构建已经完成，生成了输出目录
2. 检查 `inDir` 配置的路径是否正确
3. 确保插件在 `apply: 'build'` 模式下运行（默认已配置）

```ts
// 确保构建输出目录存在
export default defineConfig({
    build: {
        outDir: 'dist'  // 确保与 inDir 一致
    },
    plugins: [
        zipPack({
            inDir: './dist'  // 检查路径是否正确
        })
    ]
})
```

### Q: 压缩包没有生成

**可能原因**:
1. 构建过程中出现错误
2. 插件配置不正确
3. 输出目录权限问题

**解决方案**:
1. 检查构建日志，确保 Vite 构建成功
2. 确认插件已正确添加到 plugins 数组
3. 检查输出目录的写入权限
4. 启用日志查看详细信息：

```ts
zipPack({
    enableLogging: true,  // 查看详细日志
    error: (error) => {
        console.error('压缩错误:', error)  // 查看错误信息
    }
})
```

### Q: 压缩包生成但文件不完整

**可能原因**:
1. 文件被 filter 函数过滤掉了
2. 构建输出不完整

**解决方案**:
1. 检查 filter 函数逻辑：

```ts
zipPack({
    filter: (fileName, filePath, isDirectory) => {
        console.log('处理文件:', fileName, isDirectory)  // 调试日志
        return true  // 临时返回 true 查看所有文件
    }
})
```

2. 检查构建输出目录，确认所有文件都已生成

## 配置相关问题

### Q: pathPrefix 使用绝对路径报错

**问题描述**:
```
Error: "/my-app" pathPrefix must be a relative path
```

**原因**: `pathPrefix` 必须是相对路径，不能是绝对路径。

**解决方案**:
```ts
// ❌ 错误
zipPack({
    pathPrefix: '/my-app'
})

// ✅ 正确
zipPack({
    pathPrefix: 'my-app'
})
```

### Q: 如何排除特定文件或目录？

**解决方案**: 使用 `filter` 函数：

```ts
zipPack({
    filter: (fileName, filePath, isDirectory) => {
        // 排除 .map 文件
        if (fileName.endsWith('.map')) {
            return false
        }
        
        // 排除特定目录
        if (isDirectory && ['node_modules', '.git'].includes(fileName)) {
            return false
        }
        
        // 排除特定文件
        if (fileName === '.DS_Store' || fileName === 'Thumbs.db') {
            return false
        }
        
        return true
    }
})
```

### Q: 如何根据环境变量动态配置？

**解决方案**:
```ts
zipPack({
    outFileName: process.env.NODE_ENV === 'production' 
        ? 'app-prod.zip' 
        : 'app-dev.zip',
    enableLogging: process.env.CI !== 'true'  // CI 环境静默
})
```

## 性能相关问题

### Q: 打包速度很慢

**可能原因**:
1. 文件数量过多
2. 启用了文件哈希计算
3. 包含了大文件

**解决方案**:
1. 使用 filter 排除不必要的文件
2. 在不需要哈希值时禁用它：

```ts
zipPack({
    enableFileHash: false  // 加快打包速度
})
```

3. 排除大文件或使用更严格的过滤规则

### Q: 内存占用过高

**可能原因**: 打包的文件过大或文件数量过多。

**解决方案**:
1. 使用 filter 减少打包文件数量
2. 分批处理或使用流式处理（如果项目支持）
3. 检查是否有不必要的文件被包含

## 集成相关问题

### Q: 如何在 CI/CD 中使用？

**GitHub Actions 示例**:
```yaml
- name: Build
  run: npm run build
  # 构建完成后会自动生成 dist.zip

- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: dist-zip
    path: dist.zip
```

**注意事项**:
- 确保 Node.js 版本兼容
- 检查文件权限
- 使用环境变量控制日志输出

### Q: 如何与自动化部署集成？

**解决方案**: 使用 `done` 回调：

```ts
zipPack({
    done: async (filePath) => {
        // 上传到服务器
        await uploadToServer(filePath)
        
        // 或发送到 CDN
        await uploadToCDN(filePath)
        
        // 或发送通知
        await sendNotification(`构建完成: ${filePath}`)
    }
})
```

## 其他问题

### Q: 压缩包内的文件结构不正确

**可能原因**: `pathPrefix` 配置或文件路径处理问题。

**解决方案**:
1. 检查 `pathPrefix` 配置
2. 查看压缩包内容确认结构
3. 使用相对路径避免路径问题

### Q: 如何禁用插件？

**解决方案**: 使用条件判断：

```ts
plugins: [
    ...(process.env.ENABLE_ZIP === 'true' ? [zipPack()] : [])
]
```

## 获取帮助

如果以上解决方案无法解决你的问题，可以：

1. 查看 [GitHub Issues](https://github.com/153264/vite-plugin-zip-pack/issues) 搜索类似问题
2. 提交新的 Issue，包含：
   - 错误信息
   - 配置代码
   - 环境信息（Node.js 版本、Vite 版本等）
   - 复现步骤
3. 查看 [完整文档](/usage/) 了解更多信息
