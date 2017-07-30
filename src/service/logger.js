/**
 * 记录日志 ：logger 插件会生成状态快照，所以仅在开发环境使用。
 */
import createLogger from 'vuex/dist/logger'

const logger = createLogger({
    collapsed: false, // 自动展开记录的 mutation
    transformer(state) {
        // 在开始记录之前转换状态
        // 例如，只返回指定的子树
        return state.subTree
    },
    mutationTransformer(mutation) {
        // mutation 按照 { type, payload } 格式记录
        // 我们可以按任意方式格式化
        return mutation.type
    }
})

export default logger
