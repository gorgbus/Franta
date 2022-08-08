import { Node } from "erela.js"
import { EClient } from "../../types";

export const event = {
    name: 'nodeConnect'
}

export const execute = (node: Node) => {
    console.log(`Node ${node.options.identifier} connected`);
}