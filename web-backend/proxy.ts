import https from "https";
import httpProxy from "http-proxy";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import cron from "node-cron";

import { config } from "./src/config/readConfig.js";
import { log } from "./src/modules/logging/log.js";
import { getLang } from "./src/config/getLang.js";
import { shutdownServer } from "./src/helpers/shutdownServer.js";
import cleanLogs from "./src/modules/logging/cleanLogs.js";
import { startConfigWatcher } from "./src/config/configWatcher.js";
import backupData from "./src/helpers/backupData.js";

/* 
————————————————————————————————————————————————————————————————
Setup server
———————————————————————————————————————————————————————————————— 
*/

const proxy = httpProxy.createProxyServer({
    ws: true,
    secure: config.isProduction
});

// Map domains to ports
const serverMap: Record<string, string> = {};

for (const [key, domain] of Object.entries(config.domains)) {
    const port = config.ports[key as keyof typeof config.ports];

    if (!domain) {
        log.proxy.warn(`Missing domain for "${key}" key in config.toml`).save();
        continue;
    }

    if (!port) {
        log.proxy.warn(`Missing port for "${key}" key in config.toml`).save();
        continue;
    }

    serverMap[domain.toLowerCase()] = `https://localhost:${port}`;
}

// HTTPS server
const local = https.createServer(
    config.ssl,
    (req: IncomingMessage, res: ServerResponse) => {
        if (req.url!.startsWith("/favicon.ico")) {
            res.writeHead(302, {
                Location: `${config.urls.cdn}/assets${config.metadata.assets.icon}`
            });
            return res.end();
        }

        const hostname = req.headers.host?.split(":")[0].toLowerCase();
        let target = hostname ? serverMap[hostname] : undefined;
        let lang = getLang();

        if (!target) {
            log.proxy.warn(`Host '${hostname}' is not mapped to a server`).save();
            
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.writeHead(502);
            return res.end(lang.messages.badGateway);
        }

        proxy.web(
            req,
            res,
            {
                target,
                secure: config.isProduction,
                changeOrigin: false,
                headers: {
                    // @ts-ignore
                    host: hostname 
                }
            },
            (error: Error) => {
                log.proxy.error(`Error for '${hostname}':`, error).save();
                res.writeHead(502);
                res.end(lang.messages.badGateway);
            }
        );
    }
);

// WebSocket handling
local.on(
    "upgrade",
    (req: IncomingMessage, socket: Socket, head: Buffer) => {
        const hostname = req.headers.host?.split(":")[0].toLowerCase();
        const target = hostname ? serverMap[hostname] : undefined;
        
        if (!target) {
            socket.destroy();
            return;
        }

        proxy.ws(req, socket, head, {
            target,
            secure: config.isProduction,
            headers: {
                // @ts-ignore
                host: hostname
            }
        });
    }
);

/* 
————————————————————————————————————————————————————————————————
Start server
———————————————————————————————————————————————————————————————— 
*/

local.listen(config.ports.proxy, () => {
    log.proxy.info(`Proxy online at https://localhost:${config.ports.proxy}`);
});

process.once("SIGTERM", () => shutdownServer()); // Host
process.once("SIGINT", () => shutdownServer()); // Ctrl+C

/* 
————————————————————————————————————————————————————————————————
Scheduled events
———————————————————————————————————————————————————————————————— 
*/

// Clean up logs everyday at midnight
cron.schedule("0 0 * * *", () => {
    log.cron.info("Running daily tasks...");
    cleanLogs();
    backupData();
});

// Checks timed-controlled config events every minute
startConfigWatcher();