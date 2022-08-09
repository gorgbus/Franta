export const event = {
    once: false,
    name: 'disconnect'
}

export const execute = () => {
    console.log(`Disconnected at ${new Date()}`);
}