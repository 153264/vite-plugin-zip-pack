import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'vite-plugin-zip-pack',
    description: '一个为 Vite 设计的打包插件',
    base: '/vite-plugin-zip-pack/',
    lastUpdated: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: 'local'
        },

        footer: {
            message:
                'Released under the <a href="https://github.com/153264/vite-plugin-zip-pack/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2025-present <a href="https://github.com/153264">153264</a>'
        },

        nav: [
            { text: '首页', link: '/' },
            { text: '文档', link: '/usage/' }
        ],

        sidebar: [
            {
                text: '开始使用',
                items: [
                    { text: '立即开始', link: '/usage/' },
                    { text: '配置', link: '/usage/config' },
                    { text: '参与贡献', link: '/contributing' },
                    { text: '常见问题', link: '/troubleshooting' }
                ]
            }
        ],

        socialLinks: [{ icon: 'github', link: 'https://github.com/153264/vite-plugin-zip-pack' }]
    }
});
