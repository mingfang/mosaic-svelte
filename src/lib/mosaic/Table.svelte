<script>
    import MosaicClient from './MosaicClient.svelte'

    export let paginate = false
    export let rowNumber = false
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
                    <td>{row[schema.column]}</td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>

    {#if paginate}
        <div class="paginate">
            <a on:click={()=> client.requestData(0)}>First</a>
            <a on:click={()=> client.requestData(client.offset - client.limit)}>Prev</a>
            <a on:click|preventDefault={()=> client.requestData(client.offset + client.limit)}>Next</a>
        </div>
    {/if}
</MosaicClient>

<style>
    .paginate {
        display: grid;
        grid-template-columns: auto auto 1fr;
        grid-gap: 1em
    }
</style>


