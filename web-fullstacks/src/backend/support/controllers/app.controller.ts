import type { Request, Response } from "express"
import path from "path"
import fs from "fs"

import { config } from "../../../../app.config.js"
import { vite } from "../server.js"
import getReqUrl from "../../_common/helpers/getReqUrl.js"
import { log } from "../server.js"

export const renderApp = async (req: Request, res: Response) => {
    const clientConfig = {
        useNerdFonts: config.useNerdFonts,
        theme: config.theme,
        metadata: config.metadata,
        domains: config.domains
    }

    try {
        const htmlPath = path.join(
            config.folders.root,
            "src",
            "frontend",
            "support.html"
        )

        let html = fs.readFileSync(htmlPath, "utf-8")

        html = html.replace(
            "__CLIENT_CONFIG__",
            JSON.stringify(clientConfig)
        )

        if (vite) {
            html = await vite.transformIndexHtml(getReqUrl(req), html)
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(html)
    } catch (error: unknown) {
        log.client.error(error).save()
        res.status(500).end("Internal Server Error")
    }
}