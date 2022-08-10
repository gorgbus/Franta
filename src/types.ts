import { Manager } from "erela.js";
import { ApplicationCommandStructure, Client, CommandInteraction, InteractionDataOptions } from "eris";

export type commandCallback = (client: EClient, interaction: CommandInteraction) => Promise<void>;

export interface EClient extends Client {
    manager: Manager;
    commands: Map<string, { permission?: bigint; execute: commandCallback }>;
}

export type subcommand = InteractionDataOptions & {
    options: InteractionDataOptions[];
}

export type command = { 
    default: { 
        command: ApplicationCommandStructure;
        execute: commandCallback;
        permission?: bigint; 
    } 
}