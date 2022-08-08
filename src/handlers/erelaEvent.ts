import { Manager } from "erela.js";
import path from "path";
import fs from 'fs';
import { EClient } from "../types";

export default async (manager: Manager, client: EClient) => {
    const eventsPath = path.join(__dirname, '../events/erela');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    eventFiles.map(async (file) => {
        const filePath = path.join(eventsPath, file);

        const { execute, event } = await import(filePath);

        manager.on(event.name, (...args) => execute(...args, client));
    });
}