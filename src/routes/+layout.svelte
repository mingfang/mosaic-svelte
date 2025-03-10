<div class="nav">
    <a data-sveltekit-reload href="/mosaic">Native Mosaic</a>
    <a data-sveltekit-reload href="/mosaic-svelte">Svelte Mosaic WASM</a>
    <a data-sveltekit-reload href="/mosaic-svelte?ws=WebSocket">Svelte Mosaic WebSocket</a>
    <span></span>
    <a href="https://uwdata.github.io/mosaic/">Mosaic Site</a>
    <a href="https://github.com/mingfang/mosaic-svelte">Source Code</a>
</div>

<slot/>

<style>
    .nav {
        display: grid;
        grid-template-columns: repeat(3, minmax(min-content, max-content)) 1fr repeat(2, minmax(min-content, max-content));
        grid-gap: 2em;
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