<script>
    import MosaicClient from '$lib/mosaic/MosaicClient.svelte'

    export let paginate = false
    export let rowNumber = false

    let prevScrollTop = -1;

    async function scroll(e, client) {
        console.log('scroll')
        const {pending, loaded} = client;
        const {scrollHeight, scrollTop, clientHeight} = e.target;
        const back = scrollTop < prevScrollTop;
        prevScrollTop = scrollTop;
        console.log('scroll', 'back', back, 'pending', pending, 'loaded', loaded)
        // if (back || pending || loaded) return;
        if (scrollHeight - scrollTop < 2 * clientHeight) {
            client.pending = true;
            client.requestData(client.offset + client.limit);
        }
    }
</script>

<MosaicClient {...$$restProps} let:client>
    <!--
        on:scroll|passive={async (e)=> scroll(e, client)}
    -->
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


