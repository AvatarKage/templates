import path from 'path';
import https from 'https';
import express, { Router } from "express";
import cookieParser from "cookie-parser";

import { config } from "../../../src/config/readConfig.js";
import { log } from "../../../src/modules/logging/log.js";
import { shutdownServer } from "../../../src/helpers/shutdownServer.js";
import { corsMiddleware } from '../../middlewares/cors.middleware.js';
import { maintenanceMiddleware } from '../../middlewares/maintenance.middleware.js';

/* 
————————————————————————————————————————————————————————————————
Create instances 
———————————————————————————————————————————————————————————————— 
*/

const app = express();
app.set('json spaces', 2);

const router = Router();

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

app.use("/assets", express.static(config.folders.assets, 
    { immutable: true, maxAge: "30d" }
));

app.use("/uploads", express.static(path.join(config.folders.data, "uploads"),
    { maxAge: "7d" }
));

/* 
————————————————————————————————————————————————————————————————
Start server
———————————————————————————————————————————————————————————————— 
*/

export const server = https.createServer(config.ssl, app);

const port = config.ports.cdn
server.listen(port, "0.0.0.0", () => {
    log.server.info(`Server online at https://localhost:${port}`);
});

process.once("SIGTERM", () => shutdownServer());
process.once("SIGINT", () => shutdownServer());