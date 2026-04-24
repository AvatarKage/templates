import type { Request, Response } from 'express';

import WebClient from '../../../classes/webClient.js';
import { config } from '../../../config/readConfig.js';

export const statusController = async (req: Request, res: Response) => {
    const wc = new WebClient();

    // Do not ping the status server
    const api = await wc.ping(config.urls.api);
    const cdn = await wc.ping(config.urls.cdn);
    const main = await wc.ping(config.urls.main);

    res.json({ 
        api, 
        cdn, 
        main 
    });
};