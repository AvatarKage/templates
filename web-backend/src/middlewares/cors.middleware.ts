import cors from "cors";

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const ok = /^https:\/\/([a-z0-9-]+\.)*example\.com$/.test(origin);
        callback(null, ok);
    },
    credentials: true
})