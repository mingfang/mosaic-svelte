<script>
    import * as vg from '@uwdata/vgplot'
    import {parseSpec, astToDOM} from '@uwdata/mosaic-spec'
    import {Element} from '$lib'

    let chart, table, menu, element
    let brush

    async function init() {
        // creates a new database instance running in-browser
        const wasm = await vg.wasmConnector()
        // configure the coordinator to use DuckDB-WASM
        vg.coordinator().databaseConnector(wasm)

        /* load stocks file */
        vg.coordinator().exec(vg.loadCSV("stocks", `${window.location.protocol}//${window.location.host}/stocks.csv`))

        brush = vg.Selection.crossfilter()

        menu = vg.menu({from: "stocks", column: "symbol", label: "Symbol", value: 'AAPL', as: brush})

        chart = vg.plot([
            vg.line(vg.from("stocks", {filterBy: brush}), {x: "Date", y: "Close"}),
            vg.intervalX({as: brush}),
            vg.gridX(),
            vg.gridY(),
        ])

        /* parse from spec and use same brush */
        const ast = parseSpec(
            {
            plot: [
                {
                    mark: 'line',
                    data: {
                        from: 'stocks',
                        filterBy: '$brush',
                    },
                    x: 'Date',
                    y: 'Close',
                },
                {
                    mark: 'gridX',
                },
                {
                    mark: 'gridY',
                },
                ],
            }
        )
        const params = new Map()
        params.set('brush', brush)
        element = (await astToDOM(ast, {params})).element

        table = vg.table({from: "stocks", filterBy: brush, height: 250})
    }

    const ready = init()
</script>

<div class="layout">
    <h1 style="grid-area: title">Mosaic Stocks: Native WASM</h1>

    {#await ready}
        <p>Connecting...</p>
    {:then _}
        <Element style="grid-area: menu" el={menu}></Element>
        <Element style="grid-area: chart" el={chart}></Element>
        <Element style="grid-area: spec; background: lightgray" el={element}></Element>
        <Element style="grid-area: table; position: relative" el={table}></Element>
    {/await}
</div>

<style>
    .layout {
        display: grid;
        grid-template-areas:
            "title title"
            "menu menu"
            "chart spec"
            "table table";
        grid-gap: 1em;
        padding: 1em;
    }

    /* hacky styles; don't do this in real life */

    :global(table) {
        width: 100%;
    }

    :global(th) {
        position: sticky;
        top: 0;
        background: lightgray;
    }

    :global(label) {
        padding-right: 4px;
    }
</style>