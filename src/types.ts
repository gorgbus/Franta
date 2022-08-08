import { Manager } from "erela.js";
import { Client, CommandInteraction, InteractionDataOptions } from "eris";

export type commandCallback = (client: EClient, interaction: CommandInteraction) => Promise<void>;

export interface EClient extends Client {
    manager: Manager;
    commands: Map<string, commandCallback>;
}

export type subcommand = InteractionDataOptions & {
    options: InteractionDataOptions[];
}