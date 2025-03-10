/* prevent server side rendering */
export const ssr = false

export async function load({url }) {
    let ws = url.searchParams.get('ws');
    return { ws };
}