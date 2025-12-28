---
outline: deep
---

# 配置

下面是一个完整的配置样例：

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
