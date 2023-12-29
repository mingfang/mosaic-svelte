<script>
    import * as vg from '@uwdata/vgplot'
    import {Element, Menu, Table} from '$lib'

    let chart, spec
    let brush

    async function init() {
        // creates a new database instance running in-browser
        const wasm = await vg.wasmConnector()
        // configure the coordinator to use DuckDB-WASM
        vg.coordinator().databaseConnector(wasm)

        /* load stocks file */
        vg.coordinator().exec(vg.loadCSV("stocks", `${window.location.protocol}//${window.location.host}/stocks.csv`))

        brush = vg.Selection.crossfilter()

        chart = vg.plot([
            vg.line(vg.from("stocks", {filterBy: brush}), {x: "Date", y: "Close"}),
            vg.intervalX({as: brush}),
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
        }
        spec = await vg.parseSpec(
            json,
            {
                params: [
                    ['brush', brush]
                ]
            }
        )
    }

    const ready = init()
</script>


<div class="layout">
    <h1 style="grid-area: title">Mosaic Stocks: Svelte Components</h1>

    {#await ready}
        <p>Connecting...</p>
    {:then _}
        <div style="grid-area: menu">
            <Menu from="stocks" column="Symbol" value="AAPL" as={brush}/>
        </div>
        <Element style="grid-area: chart" el={chart}></Element>
        <Element style="grid-area: spec; background: lightgray" el={spec}></Element>
        <div style="grid-area: table">
            <Table from="stocks" columns={['*']} limit={10} offset={0}
                   filterBy={brush}
                   paginate={true}
                   rowNumber={true}
            />
        </div>
        <!-- similar table using sql -->
        <div style="grid-area: sql">
            <Table sql="select Symbol, Date, Open, Close, Volume from stocks order by date limit 10"
                   filterBy={brush}
                   paginate={true}
                   rowNumber={true}
            />
        </div>
    {/await}
</div>

<style>
    .layout {
        display: grid;
        grid-template-areas:
            "title title"
            "menu menu"
            "chart spec"
            "table table"
            "sql sql";
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