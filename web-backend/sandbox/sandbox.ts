import Snowflake from "../src/classes/snowflake.js";
import { config } from "../src/config/readConfig.js";
import formatNumber from "../src/helpers/formatNumber.js";
import URL from "../src/classes/url.js";
import { toMs } from "../src/helpers/misc.js";
import Database from "../src/classes/database.js";
import Identifier from "../src/classes/identifier.js";
import { log } from "../src/modules/logging/log.js";
import toArray from "../src/helpers/toArray.js";
import WebClient from "../src/classes/webClient.js";
import parseDuration from "../src/helpers/parseDuration.js";

export const snowflake = new Snowflake(config.generation.epoch);

log.snowflake.info(snowflake.decode("36566882404270080"));
log.number.info(toArray(formatNumber(8946518965)));

const url = new URL("http://www.test.co.uk/test?q=78541#top");
url.updateQuery("q", "confirmed");
url.updateQuery("a", "bro");
url.updateHash("cc");
url.updateDomain("example.com");
url.updateSubdomain("");
url.updatePath("premium");
url.updateProtocol("https");

log.url.info(url);

log.number.info(toMs(1));

export const db = {
    audits: new Database("data/audits.sqlite"),
    contributors: new Database("data/contributors.sqlite"),
    metadata: new Database("data/metadata.sqlite")
};

// Populate databases on first run
db.audits.transaction((query) => {
    if (!query("SELECT * FROM identifiers LIMIT 1").success) { query(`${config.folders.sql}/audits/identifiers.sql`); };
});

db.contributors.transaction((query) => {
    if (!query("SELECT * FROM contributors LIMIT 1").success) { query(`${config.folders.sql}/contributors.sql`); };
});

db.metadata.transaction((query) => {
    if (!query("SELECT * FROM metadata LIMIT 1").success) { query(`${config.folders.sql}/metadata.sql`); };
});

log.db.debug(db.contributors.query("SELECT * FROM contributors"));

export const id = new Identifier(db.audits);
const shortlink = id.generate("SHORTLINK");

log.id.info(shortlink);
log.id.info(id.get(shortlink));

const wc = new WebClient(db.metadata);
log.crawler.info(await wc.getMetadata(url.href));

// Better if in a cron
log.crawler.info(wc.clearCache(parseDuration("1d")));