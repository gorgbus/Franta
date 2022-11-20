import path from "path";
import fs from "fs";
import { EClient } from "../types";
import { Kazagumo } from "kazagumo";

export default async (manager: Kazagumo, client: EClient) => {
    loadEvents(manager, client, "player");
    loadEvents(manager, client, "node");
}

const loadEvents = (manager: Kazagumo, client: EClient, type: string) => {
    const eventsPath = path.join(__dirname, `../events/${type}`);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    eventFiles.map(async (file) => {
        const filePath = path.join(eventsPath, file);

        const { execute } = await import(filePath);

        (type === "player") ? manager.on(file.slice(0, -3) as any, (...args) => execute(...args, client)) : manager.shoukaku.on(file.slice(0, -3) as any, (...args) => execute(...args, client));
    });
}