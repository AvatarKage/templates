import { discord } from "../../main.js";

export default function registerMessageCreate() {
    discord.on("messageCreate", async (message) => {
        // Call something here
    });
}