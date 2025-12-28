import antfu from '@antfu/eslint-config'

export default antfu({
    type: 'lib',
    stylistic: false,
    rules: {
        'no-console': 'off',
        'node/handle-callback-err': 'off',
        'ts/ban-ts-comment': 'off'
    },
})
