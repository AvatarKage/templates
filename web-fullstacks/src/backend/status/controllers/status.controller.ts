import type { Request, Response } from 'express';

import WebClient from '../../_common/classes/webclient.js';
import { config } from '../../../../app.config.js';

export const statusController = async (req: Request, res: Response) => {
    const wc = new WebClient(config.crawler);

    // Do not ping the status server
    const api = await wc.ping(`https://${config.domains.api}`);
    const cdn = await wc.ping(`https://${config.domains.cdn}`);
    const main = await wc.ping(`https://${config.domains.main}`);

    res.json({ 
        api, 
        cdn, 
        main 
    });
};