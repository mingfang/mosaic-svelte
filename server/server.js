import {handler} from '../build/handler.js'
import express from 'express'
import expressWebsockets from "express-ws"
import {Cache, DuckDB, queryHandler, socketResponse} from "@uwdata/mosaic-duckdb"

/* init */
const { app } = expressWebsockets(express())

/* health check */
app.get('/healthcheck', (req, res) => {
    res.end('ok');
});

/* duckdb */
const db = new DuckDB()
;(async ()=>{
    console.log(await db.query('select version()'))
    // console.log(await db.query('install postgres; load postgres;'))
    // console.log(await db.query('install icu; load icu;'))
    console.log(await db.query('FROM duckdb_extensions();'))
    // console.log(await db.query("ATTACH 'dbname=postgres user=postgres password=postgres host=postgres.postgres-example' AS postgres (TYPE postgres);"))
    console.log(await db.query("PRAGMA database_list;"))
    // console.log(await db.query("select * from postgres.bt_run_view limit 1"))
    // console.log(await db.query("SHOW TABLES;"))
})()

const CACHE_DIR = '.mosaic/cache'
const handleQuery = queryHandler(db, new Cache({dir: CACHE_DIR}))
app.ws("/duckdb-ws", (websocket, request) => {
    const res = socketResponse(websocket)
    websocket.on('message', data => handleQuery(res, data))
})

/* svelte-kit */
app.use(handler)

/* start */
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})