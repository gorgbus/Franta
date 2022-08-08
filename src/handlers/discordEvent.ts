import { EClient } from "../types";
import path from "path";
import fs from 'fs';

export default async (client: EClient) => {
    const eventsPath = path.join(__dirname, '../events/discord');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    eventFiles.map(async (file) => {
        const filePath = path.join(eventsPath, file);

        const { execute, event } = await import(filePath);

        if (event.once)
            client.once(event.name, (...args) => execute(...args, client));
        else
            client.on(event.name, (...args) => execute(...args, client));
    });
}