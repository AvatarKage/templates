import { Client, Events, GatewayIntentBits, ActivityType, Message } from "discord.js";
import cron from "node-cron";

import { 
    Database,
    Logger,
    Snowflake,
    WebClient,
    backupService
} from "kage-library";

import { config } from "./app.config.js"
import getEnv from "./src/helpers/getEnv.js"
import terminateApp from "./src/helpers/terminateApp.js"
import registerSlashCommands from "./src/hooks/registerSlashCommands.hook.js";
import registerMessageCreate from "./src/hooks/registerMessageCreate.hook.js";

/* 
————————————————————————————————————————————————————————————————
Connect databases
———————————————————————————————————————————————————————————————— 
*/

export const db = {
    metadata: new Database("data/databases/metadata.sqlite")
};

db.metadata.transaction((query) => {
    if (!query("SELECT * FROM metadata LIMIT 1").success) { query(`${config.folders.sql}/metadata.sql`); };
});

/* 
————————————————————————————————————————————————————————————————
Create instances 
———————————————————————————————————————————————————————————————— 
*/

export const discord = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ] 
});

export const log = new Logger({
    path: "/logs",
    useNerdFonts: config.useNerdFonts,
    saveAllToFile: config.debug.logger.main
});

export const snowflake = new Snowflake(config.generation.epoch);
export const wc = new WebClient({
    crawler: config.crawler,
    database: db.metadata,
    useSecureSSL: config.isProduction
});

/* 
————————————————————————————————————————————————————————————————
Client
———————————————————————————————————————————————————————————————— 
*/

discord.once(Events.ClientReady, async (client) => {
    if (config.isProduction) { 
        // Mark Discord bot hosting servers (e.g, BisectHosting) as ONLINE
        log.network.info("successfully finished startup"); // Must be all lowercase
    }
    
    log.discord.info(`Client logged in as ${client.user.tag}`);

    // Register hooks
    await registerSlashCommands();
    registerMessageCreate();

    // Update status
    client.user.setActivity(
        config.isProduction ? config.client.activity : config.metadata.version.full, 
        { type: ActivityType[config.client.status] }
    );
});

discord.login(getEnv(config.isProduction ? "DISCORD_BOT_TOKEN" : "DISCORD_DEV_BOT_TOKEN"));

process.once("SIGTERM", () => terminateApp(log, db)); // Host
process.once("SIGINT", () => terminateApp(log, db)); // Ctrl+C

/* 
————————————————————————————————————————————————————————————————
Scheduled events
———————————————————————————————————————————————————————————————— 
*/

// Run everyday at midnight
cron.schedule("0 0 * * *", () => {
    log.cron.info("Running daily tasks...");
    log.cleanLogs();
    backupService(config.folders.data, config.folders.backups);
});