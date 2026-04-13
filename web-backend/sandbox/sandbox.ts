import "../src/packages/kage-library/extensions/string.js"
import "../src/packages/kage-library/extensions/object.js"

import Snowflake from "../src/packages/kage-library/classes/snowflake.js";
import { config } from "../src/packages/kage-library/modules/config/readConfig.js";
import formatNumber from "../src/packages/kage-library/helpers/formatNumber.js";
import URL from "../src/packages/kage-library/classes/url.js";
import { toMs } from "../src/packages/kage-library/helpers/misc.js";
import Database from "../src/packages/kage-library/classes/database.js";
import Identifier from "../src/packages/kage-library/classes/identifier.js";
import { log } from "../src/packages/kage-library/modules/logging/log.js";
import toArray from "../src/packages/kage-library/helpers/toArray.js";
import Metadata from "../src/packages/kage-library/classes/metadata.js";
import parseDuration from "../src/packages/kage-library/helpers/parseDuration.js";

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

log.id.success(shortlink);
log.id.info(id.get(shortlink));

const md = new Metadata(db.metadata);
log.crawler.success(await md.get(url.href));

// Better if in a cron
log.crawler.success(md.clearCache(parseDuration("1d")));