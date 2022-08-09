export const event = {
    once: false,
    name: 'connect'
}

export const execute = () => {
    console.log(`Connected at ${new Date()}`);
}