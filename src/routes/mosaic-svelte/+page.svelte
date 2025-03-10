<script>
    import * as vg from '@uwdata/vgplot'
    import {astToDOM, parseSpec} from '@uwdata/mosaic-spec'
    import {Element, Menu, Table} from '$lib'
    import {page} from '$app/stores';
    import {codemirror, withCodemirrorInstance} from '@neocodemirror/svelte'
    import {sql} from '@codemirror/lang-sql'

    const {ws} = $page.data

    let chart, element
    let brush
    const cmInstance = withCodemirrorInstance()

    async function init() {
        if (ws) {
            const socket = vg.socketConnector(`wss://${window.location.host}/duckdb-ws`)
            vg.coordinator().databaseConnector(socket)
        } else {
            // creates a new database instance running in-browser
            const wasm = await vg.wasmConnector()
            // configure the coordinator to use DuckDB-WASM
            vg.coordinator().databaseConnector(wasm)
        }

        /* load stocks file */
        const url = ws ? `http://localhost:3000/stocks.csv` : `${window.location.protocol}//${window.location.host}/stocks.csv`
        vg.coordinator().exec(vg.loadCSV("stocks", url))

        brush = vg.Selection.crossfilter()

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
    }

    const ready = init()

    let sqlText = 'SELECT Symbol, Date, Open, Close, Volume\n FROM stocks\n ORDER BY date\n LIMIT 10'
    let filterBy = true
    $: repaint = {filterBy, sqlText}
</script>


<div class="layout">
    <h1 style="grid-area: title">Mosaic Stocks: Svelte {ws || 'WASM'}</h1>

    {#await ready}
        <p>Connecting...</p>
    {:then _}
        <div style="grid-area: menu">
            <Menu from="stocks" column="Symbol" value="AAPL" as={brush}/>
        </div>
        <Element style="grid-area: chart" el={chart}></Element>
        <Element style="grid-area: spec; background: lightgray" el={element}></Element>
        <!--
                <div style="grid-area: table">
                    <Table from="stocks" columns={['*']} limit={10} offset={0}
                           filterBy={brush}
                           paginate={true}
                           rowNumber={true}
                    />
                </div>
        -->
        <!-- similar table using sql -->
        <div style="grid-area: sql">
            <h4>Edit and run the SQL below</h4>
            <div use:codemirror={{
                value: sqlText,
                lang: sql(),
                setup: "basic",
                instanceStore: cmInstance
            }}/>
            <button on:click={()=> sqlText = $cmInstance.value}>Run</button>
            <label>
                <input type="checkbox" bind:checked={filterBy}/>
                Filter By Symbol
            </label>
            {#key repaint}
                <Table sql={sqlText}
                       filterBy={filterBy ? brush : null}
                       paginate={true}
                       rowNumber={true}
                />
            {/key}
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

    button {
        margin: 0.5em;
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