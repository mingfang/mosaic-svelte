<script>
    export let target

    /** @type {import('svelte/action').Action}  */
    export function plot(node, {el}) {
        if (el) {
            node.replaceChildren(el)
        } else {
            node.replaceChildren('Loading...')
        }
    }

</script>

{#key target}
    <div style="display: contents" use:plot={{el: target}}></div>
{/key}
