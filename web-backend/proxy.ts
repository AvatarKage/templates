import https from "https";
import httpProxy from "http-proxy";
import path from "path";
import fs from "fs-extra";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import cron from "node-cron";

import "./src/packages/kage-library/extensions/string.js"
import "./src/packages/kage-library/extensions/object.js"

import { config } from "./src/packages/kage-library/modules/config/readConfig.js";
import { log } from "./src/packages/kage-library/modules/logging/log.js";
import { getLang } from "./src/packages/kage-library/modules/config/getLang.js";
import { shutdownServer } from "./src/packages/kage-library/helpers/shutdownServer.js";
import cleanLogs from "./src/packages/kage-library/modules/logging/cleanLogs.js";

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
        log.proxy.warn(`Missing domain for "${key}" key in config.toml`);
        continue;
    }

    if (!port) {
        log.proxy.warn(`Missing port for "${key}" key in config.toml`);
        continue;
    }

    serverMap[domain.toLowerCase()] = `https://localhost:${port}`;
}

// Certificates
const ssl = {
    cert: fs.readFileSync(
        path.join(config.folders.config, "ssl", `${config.domains.main}.crt`)
    ),
    key: fs.readFileSync(
        path.join(config.folders.config, "ssl", `${config.domains.main}.key`)
    )
};

// HTTPS server
const local = https.createServer(
    ssl,
    (req: IncomingMessage, res: ServerResponse) => {
        if (req.url === "/favicon.ico") {
            res.writeHead(204);
            return res.end();
        }

        const hostname = req.headers.host?.split(":")[0].toLowerCase();
        let target = hostname ? serverMap[hostname] : undefined;
        let lang = getLang();

        if (!target) {
            log.proxy.warn(`Host '${hostname}' is not mapped to a server`);
            
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
                log.proxy.error(`Error for '${hostname}' ${error.message}`);
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
    log.proxy.success(`Proxy online at https://localhost:${config.ports.proxy}`);
});

process.once("SIGTERM", () => shutdownServer()); // Host
process.once("SIGINT", () => shutdownServer()); // Ctrl+C

/* 
————————————————————————————————————————————————————————————————
Clean up logs
———————————————————————————————————————————————————————————————— 
*/

// Runs everyday at midnight
cron.schedule("0 0 * * *", () => {
    log.cron.info("Running daily log cleanup...");
    cleanLogs();
});