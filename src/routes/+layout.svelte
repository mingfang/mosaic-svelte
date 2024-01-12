<div class="nav">
    <a data-sveltekit-reload href="/mosaic">Native Mosaic</a>
    <a data-sveltekit-reload href="/mosaic-svelte">Svelte Mosaic WASM</a>
    <a data-sveltekit-reload href="/mosaic-svelte?ws=WebSocket">Svelte Mosaic WebSocket</a>
</div>

<slot/>

<style>
    .nav {
        display: grid;
        grid-template-columns: repeat(3, minmax(min-content, max-content));
        grid-gap: 1em;
        padding: .5em 1em .5em 1em;
        background: steelblue;
    }

    .nav a {
        color: white;
        cursor: pointer;
        text-decoration: none;
    }

    .nav a:hover {
        text-decoration: underline;
    }
</style>