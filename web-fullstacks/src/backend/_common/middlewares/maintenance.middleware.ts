import type { Request, Response, NextFunction } from 'express';

import { config } from '../../../../app.config.js';
import I18nService from '../services/i18n.service.js';

export const maintenanceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const i18n = await I18nService.load(
        { 
            localesPath: "/public/locales", 
            locale: "en", 
            defaultLocale: config.metadata.locale 
        }
    );

    if (config.maintenance.isEnabled) {
        return res.send(i18n.t("maintenance.reason"));
    } else {
        next();
    } 
};

