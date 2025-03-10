<script>
    import {coordinator, isParam, isSelection, MosaicClient} from '@uwdata/mosaic-core'
    import {column, eq, literal, Query} from '@uwdata/mosaic-sql'
    import {parseSql} from "./util/sql-parser.js"
    import {onMount} from "svelte"

    export let value = undefined

    /* initial selection */
    $: if (value && me) {
        me.publishSelection(value)
    }

    /* trigger repaint */
    let repaint = {}

    class Me extends MosaicClient {
        constructor({
                        sql,
                        from,
                        distinct = false,
                        columns = ['*'],
                        orderBy,
                        desc = false,
                        limit = 100,
                        offset = 0,
                        as,
                        filterBy,
                    } = {}) {
            super(filterBy)
            this.selection = as
            this.limit = +limit
            this.offset = +offset

            if (sql) {
                this.updateSql(sql);
            } else {
                this.from = from
                this.columns = columns
                this.orderBy = orderBy
                this.desc = desc
                this.distinct = distinct
            }
        }

        updateSql(sql) {
            this.sql = sql
            const parsed = parseSql(sql)
            this.from = parsed.from
            this.columns = parsed.columns
            this.orderBy = parsed.orderBy
            this.limit = parsed.limit || this.limit
            this.offset = parsed.offset || this.offset
            this.distinct = parsed.distinct
        }

        publishSelection(value) {
            const {selection, columns} = this
            if (!selection) return
            if (isSelection(selection)) {
                selection.update({
                    source: this,
                    schema: {type: 'point'},
                    value,
                    predicate: value ? eq(columns[0], literal(value)) : null
                })
            } else if (isParam(selection)) {
                selection.update(value)
            }
        }

        requestData(offset = 0) {
            this.offset = offset >= 0 ? offset : 0

            // request next data batch
            const query = this.query(this.filterBy?.predicate(this))
            this.requestQuery(query)

            // prefetch subsequent data batch
            coordinator().prefetch(query.clone().offset(offset + this.limit))
        }

        /* inherited */

        fields() {
            return this.columns.map(name => column(this.from, name))
        }

        fieldInfo(info) {
            this.schema = info
            return this
        }

        query(filter = []) {
            const {from, schema, distinct, orderBy, limit, offset} = this
            return Query
                .from(from)
                .select(schema ? schema.map(s => s.column) : '*')
                .distinct(distinct)
                .where(filter)
                .orderby(orderBy)
                .limit(limit)
                .offset(offset)
        }

        queryResult(data) {
            // console.log('queryResult', data)
            this.data = data
            return this
        }

        update() {
            const {data, limit} = this
            this.hasMore = data.numRows <= limit
            repaint = repaint
            return this
        }
    }

    let me
    onMount(async () => {
        me = new Me($$restProps)
        await coordinator().connect(me)
        return () => coordinator().disconnect(me)
    })
</script>

{#key repaint}
    <slot client={me}></slot>
{/key}