<script>
    import MosaicClient from './MosaicClient.svelte'

    export let label
    export let column
</script>

<MosaicClient columns={[column]} distinct={true} {...$$restProps} let:client>
    <labe>{label || column}</labe>
    <select on:change={(event) => client.publishSelection(event.target.value)}>
        {#each client?.data || [] as row,i(i)}
            {@const value = row[client.schema[0].column]}
            {@const selected = client?.selection?.value === value}
            <option {value} selected={selected}>{value}</option>
        {/each}
    </select>
</MosaicClient>
