import { ApplicationCommandStructure, Client, CommandInteraction, InteractionDataOptions } from "eris";
import { Kazagumo } from "kazagumo/dist/Kazagumo";

export type commandCallback = (client: EClient, interaction: CommandInteraction) => Promise<void>;

export interface EClient extends Client {
    manager: Kazagumo;
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