<script>
    import {coordinator, isParam, isSelection, MosaicClient} from '@uwdata/mosaic-core'
    import {column, eq, literal, Query} from '@uwdata/mosaic-sql';
    import {onMount} from "svelte";
    import {parseSql} from "./sql-parser.js";

    export let value = undefined

    /* initial selection */
    $: if (value && me) {
        me.publishSelection(value)
    }

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
            super(filterBy);
            this.selection = as;

            if (sql) {
                const parsed = parseSql(sql)
                this.from = parsed.from;
                this.columns = parsed.columns;
                this.orderBy = parsed.orderBy
                //this.desc = desc //todo
                this.limit = parsed.limit
                this.offset = parsed.offset
                this.distinct = parsed.distinct
            } else {
                this.from = from;
                this.columns = columns;
                this.orderBy = orderBy
                this.desc = desc
                this.limit = +limit
                this.offset = +offset
                this.distinct = distinct
            }
        }

        publishSelection(value) {
            // console.log('publishSelection value=', value)
            const {selection, columns} = this;
            if(!selection) return
            if (isSelection(selection)) {
                selection.update({
                    source: this,
                    schema: {type: 'point'},
                    value,
                    predicate: value ? eq(columns[0], literal(value)) : null
                });
            } else if (isParam(selection)) {
                selection.update(value);
            }
        }

        requestData(offset = 0) {
            // console.log('requestData offset=', offset)
            this.offset = offset >= 0 ? offset : 0;

            // request next data batch
            const query = this.query(this.filterBy?.predicate(this));
            this.requestQuery(query);

            // prefetch subsequent data batch
            coordinator().prefetch(query.clone().offset(offset + this.limit));
        }

        /* inherited */

        fields() {
            // console.log('fields', this.columns.map(name => column(this.from, name)))
            return this.columns.map(name => column(this.from, name));
        }

        fieldInfo(info) {
            // console.log('fieldInfo', info)
            this.schema = info;
            return this;
        }

        query(filter = []) {
            // console.log('query', filter)
            const {from, schema, distinct, orderBy, limit, offset} = this;
            return Query
                .from(from)
                .select(schema.map(s => s.column))
                .distinct(distinct)
                .where(filter)
                .orderby(orderBy)
                .limit(limit)
                .offset(offset)
        }

        queryResult(data) {
            // console.log('queryResult', data)
            this.data = data;
            return this;
        }

        update() {
            const {data, limit} = this
            this.hasMore = data.numRows <= limit
            updateTime = Date.now()
            // console.log('update', 'rows', data.numRows, 'hasMore', this.hasMore, 'offset', this.offset, 'limit', limit)
            return this;
        }
    }

    /* trigger repaint */
    let updateTime;

    let me;
    onMount(async () => {
        me = new Me($$restProps)
        await coordinator().connect(me);
        return () => coordinator().disconnect(me)
    })
</script>

{#key updateTime}
    <slot client={me}></slot>
{/key}