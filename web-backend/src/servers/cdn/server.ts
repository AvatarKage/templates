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

router.use("/assets", express.static(config.folders.assets));
router.use("/uploads", express.static(config.folders.uploads));

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