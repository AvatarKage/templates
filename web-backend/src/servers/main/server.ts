import https from 'https';
import express, { Router } from "express";
import cookieParser from "cookie-parser";

import { config } from "../../../src/config/readConfig.js";
import { log } from "../../../src/modules/logging/log.js";
import { shutdownServer } from "../../../src/helpers/shutdownServer.js";
import { corsMiddleware } from '../../middlewares/cors.middleware.js';
import { maintenanceMiddleware } from '../../middlewares/maintenance.middleware.js';
import landerRoute from './routes/lander.route.js';

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

router.use('/', landerRoute);

/* 
————————————————————————————————————————————————————————————————
Start server
———————————————————————————————————————————————————————————————— 
*/

export const server = https.createServer(config.ssl, app);

const port = config.ports.main
server.listen(port, "0.0.0.0", () => {
    log.server.info(`Server online at https://localhost:${port}`);
});

process.once("SIGTERM", () => shutdownServer());
process.once("SIGINT", () => shutdownServer());