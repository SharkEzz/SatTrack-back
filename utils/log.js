import chalk from 'chalk';

const getDateTime = () => {
    return (new Date()).toLocaleTimeString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
};

const writeMessage = (message, chalkColor) => {
    console.log(chalkColor(`[${getDateTime()}] ${message}`));
};

const log = {
    success: (message) => {
        writeMessage(`SUCCESS: ${message}`, chalk.green);
    },

    error: (message) => {
        writeMessage(`ERROR: ${message}`, chalk.red);
    },

    info: (message) => {
        writeMessage(`INFO: ${message}`, chalk.blueBright);
    },

    log: (message) => {
        writeMessage(`LOG: ${message}`, chalk.white);
    },

    warning: (message) => {
        writeMessage(`WARNING: ${message}`, chalk.yellow);
    },
}

export default log;
