<script>
    import MosaicClient from './MosaicClient.svelte'
    import {formatDate, formatLocaleAuto, formatLocaleNumber} from './util/format.js'

    export let paginate = false
    export let rowNumber = false

    let formats, aligns;

    function formatof(base = {}, schema, locale) {
        if (!formats) {
            formats = schema.map(({column, type}) => {
                if (column in base) {
                    return base[column];
                } else {
                    switch (type) {
                        case 'number':
                            return formatLocaleNumber(locale);
                        case 'date':
                            return formatDate;
                        default:
                            return formatLocaleAuto(locale);
                    }
                }
            });
        }
        return formats
    }

    function alignof(base = {}, schema) {
        if (!aligns) {
            aligns = schema.map(({column, type}) => {
                if (column in base) {
                    return base[column];
                } else if (type === 'number') {
                    return 'right';
                } else if (type === 'date') {
                    return 'right';
                } else {
                    return 'left';
                }
            });
        }
        return aligns
    }
</script>

<MosaicClient {...$$restProps} let:client>
    <table>
        <thead>
        {#if rowNumber}
            <th></th>
        {/if}
        {#each client?.schema || [] as schema,i(i)}
            <th>{schema.column}</th>
        {/each}
        </thead>
        <tbody>
        {#each client?.data || [] as row,i(i)}
            <tr>
                {#if rowNumber}
                    <td>{i + 1 + client.offset}</td>
                {/if}
                {#each client.schema as schema,i(i)}
                    {@const align = alignof({}, client.schema)[i]}
                    {@const format = formatof({}, client.schema)[i]}
                    <td style="text-align: {align}">
                        {format(row[schema.column])}
                    </td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>

    {#if paginate}
        <div class="paginate">
            <a on:click={()=> client.requestData(0)}>First</a>
            <a on:click={()=> client.requestData(client.offset - client.limit)}>Prev</a>
            <a on:click={()=> client.requestData(client.offset + client.limit)}>Next</a>
        </div>
    {/if}
</MosaicClient>

<style>
    .paginate {
        display: grid;
        grid-template-columns: repeat(3, minmax(min-content, max-content));
        grid-gap: 1em;
        margin-top: .5em;
    }

    .paginate a {
        cursor: pointer;
    }
</style>


