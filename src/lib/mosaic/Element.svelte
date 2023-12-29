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
    <div {...$$restProps} use:plot={{el}}></div>
{/key}
