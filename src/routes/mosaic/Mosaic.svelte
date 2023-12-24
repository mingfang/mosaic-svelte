<!-- Normally this component lives in the $lib directory. Kept here for simplicity. -->
<script>
    export let el

    /** @type {import('svelte/action').Action}  */
    export function plot(node, param) {
        if (param.el) {
            node.replaceChildren(param.el)
        } else {
            node.replaceChildren('Loading...')
        }
    }
</script>

{#key el}
    <div style="display: contents" use:plot={{el}}></div>
{/key}
