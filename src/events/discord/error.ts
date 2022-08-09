export const event = {
    once: false,
    name: 'error'
}

export const execute = (err: Error, shardId: number) => {
    console.error(err);
}