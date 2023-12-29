<div class="nav">
    <a href="/mosaic">Native Mosaic Components</a>
    <a href="/mosaic-svelte">Svelte Mosaic Components</a>
</div>

<slot/>

<style>
    .nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(min-content, max-content));
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