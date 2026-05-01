import Logger from "../../../_common/classes/logger.js";
import WsClient from "../../_common/classes/wsClient.js";

/* 
————————————————————————————————————————————————————————————————
Create instances 
———————————————————————————————————————————————————————————————— 
*/

export const log = new Logger({
    useNerdFonts: window.config.useNerdFonts
});

// Create new websocket client
window.ws = new WsClient(log, `wss://${window.config.domains.main}`);

// Tell the server client is loaded and ready
window.ws.send({ status: "ready" });