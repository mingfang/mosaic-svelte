<script>
    import * as vg from "@uwdata/vgplot"
    import Mosaic from "./Mosiac.svelte"

    let chart, table, menu, spec

    /* init */
    (async () => {
        // configure the coordinator to use DuckDB-WASM
        // creates a new database instance running in-browser
        const wasm = await vg.wasmConnector()
        vg.coordinator().databaseConnector(wasm)

        /* load stocks file */
        vg.coordinator().exec(vg.loadCSV("stocks", `${window.location.protocol}///${window.location.host}/stocks.csv`))

        const $brush = vg.Selection.crossfilter()

        menu = vg.menu({from: "stocks", column: "symbol", label: "Symbol", as: $brush})

        chart = vg.plot([
            vg.line(vg.from("stocks", {filterBy: $brush}), {x: "Date", y: "Close"}),
            vg.intervalX({as: $brush}),
            vg.gridX(),
            vg.gridY(),
        ])

        /* parse from spec and use same brush */
        const json = {
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
            ]
        };
        spec = await vg.parseSpec(
            json,
            {
                params: [
                    ['brush', $brush]
                ]
            }
        )

        table = vg.table({from: "stocks", filterBy: $brush, height: 250})

    })()

</script>

<div class="layout">

    <h1 style="grid-area: title">Mosaic Stocks</h1>

    <div style="grid-area: menu">
        <Mosaic target={menu}></Mosaic>
    </div>

    <div style="grid-area: chart">
        <Mosaic target={chart}></Mosaic>
    </div>

    <div style="grid-area: spec; background: lightgray">
        <Mosaic target={spec}></Mosaic>
    </div>

    <div style="grid-area: table; position: relative">
        <Mosaic target={table}></Mosaic>
    </div>
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
        padding-left: 1em;
        padding-right: 1em;
    }

    :global(th) {
        position: sticky;
        top: 0;
        background: lightgray;
    }

    :global(label){
        padding-right: 4px;
    }

</style>