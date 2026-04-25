import https from 'https';
import express, { Router } from "express";
import cookieParser from "cookie-parser";

import { config } from "../../../src/config/readConfig.js";
import { log } from "../../../src/modules/logging/log.js";
import { shutdownServer } from "../../../src/helpers/shutdownServer.js";
import { corsMiddleware } from '../../middlewares/cors.middleware.js';
import { maintenanceMiddleware } from '../../middlewares/maintenance.middleware.js';
import WebClient from "../../../src/classes/webClient.js";
import Database from "../../../src/classes/database.js";
import Snowflake from "../../../src/classes/snowflake.js";
import userRoutes from './routes/user.routes.js';

/* 
————————————————————————————————————————————————————————————————
Connect databases
———————————————————————————————————————————————————————————————— 
*/

export const db = {
    metadata: new Database("data/databases/metadata.sqlite")
};

db.metadata.transaction((query) => {
    if (!query("SELECT * FROM metadata LIMIT 1").success) { query(`${config.folders.sql}/metadata.sql`); };
});

/* 
————————————————————————————————————————————————————————————————
Create instances 
———————————————————————————————————————————————————————————————— 
*/

const app = express();
app.set('json spaces', 2);

const router = Router();

export const snowflake = new Snowflake(config.generation.epoch);
export const wc = new WebClient(db.metadata);

/* 
————————————————————————————————————————————————————————————————
Middlewares
———————————————————————————————————————————————————————————————— 
*/

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(maintenanceMiddleware);
app.use('/', router);

/* 
————————————————————————————————————————————————————————————————
Routes
———————————————————————————————————————————————————————————————— 
*/

router.use('/users', userRoutes);

/* 
————————————————————————————————————————————————————————————————
Start server
———————————————————————————————————————————————————————————————— 
*/

export const server = https.createServer(config.ssl, app);

const port = config.ports.api
server.listen(port, "0.0.0.0", () => {
    log.server.info(`Server online at https://localhost:${port}`);
});

process.once("SIGTERM", () => shutdownServer());
process.once("SIGINT", () => shutdownServer());