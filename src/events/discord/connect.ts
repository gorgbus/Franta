export const event = {
    once: false,
    name: 'connect'
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

    console.log(`Connected at ${timezone.format(new Date())}`);
}