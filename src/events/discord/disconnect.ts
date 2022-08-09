export const event = {
    once: false,
    name: 'disconnect'
}

export const execute = () => {
    const timezone = new Intl.DateTimeFormat('cs', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h24'
    });

    console.log(`Disconnected at ${timezone.format(new Date())}`);
}