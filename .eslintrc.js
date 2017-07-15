// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        "indent": [2, 4, {
            // case 用一个缩进
            "SwitchCase": 1,
            // 变量声明用一个缩进
            "VariableDeclarator": 1,
            "outerIIFEBody": 1,
            "MemberExpression": 1,
            "FunctionDeclaration": {
                "body": 1,
                "parameters": 2
            },
            "FunctionExpression": {
                "body": 1,
                "parameters": 2
            },
            "CallExpression": {
                "arguments": 1
            }
        }], // 缩进设置为 4 个空格
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        //函数定义时括号前面要不要有空格
        "space-before-function-paren": 0,
        //多余的分号
        "no-extra-semi": 1
    }
}
