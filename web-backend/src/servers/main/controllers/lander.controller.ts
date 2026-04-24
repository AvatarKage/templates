import type { Request, Response } from 'express';

export const sendWelcomeMessage = (req: Request, res: Response) => {
    res.send('Welcome to the web-backend template!');
};