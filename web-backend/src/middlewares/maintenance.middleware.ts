import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/readConfig.js';
import { getLang } from '../config/getLang.js';
import { isCurrentlyScheduledMaintenance } from '../config/configWatcher.js';

export const maintenanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let lang = getLang();

    if (config.maintenance.isEnabled) {
        return res.send(
            isCurrentlyScheduledMaintenance() ? 
                lang.maintenance.scheduled.reason : 
                lang.maintenance.reason
        );
    } else {
        next();
    } 
};