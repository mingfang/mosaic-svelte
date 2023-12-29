<div class="nav">
    <a href="/mosaic">Native Mosaic Components</a>
    <a href="/mosaic-svelte">Svelte Mosaic Components</a>
</div>

<slot/>

<style>
    .nav {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(25ch, 1fr));
        grid-gap: 1em;
    }

    .nav a {
        cursor: pointer;
    }

    .nav a:hover {
        font-weight: bold;
    }
</style>