import parser from 'js-sql-parser'
import {desc} from '@uwdata/mosaic-sql'

export function parseSql(sql) {
    const ast = parser.parse(sql)
    // console.log(ast)

    const distinct = ast.value.distinctOpt != null
    const columns = ast.value.selectItems.value.map(value => value.alias || value.value)
    const from = ast.value.from.value[0].value.value.value
    const orderBy = ast.value.orderBy?.value.map(value => {
        if (value.sortOpt && 'desc' === value.sortOpt.toLowerCase()) {
            return desc(value.value.value)
        } else {
            return value.value.value
        }
    })
    const limit = +ast.value.limit?.value[ast.value.limit.offsetMode ? 1 : 0]
    const offset = +ast.value.limit?.value[ast.value.limit.offsetMode ? 0 : 1] || 0

    return {
        from,
        distinct,
        columns,
        orderBy,
        limit,
        offset
    }
}
