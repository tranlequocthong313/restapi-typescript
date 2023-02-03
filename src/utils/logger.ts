import pino from 'pino';
import pretty from 'pino-pretty';
import { format } from 'date-fns';
import fs from 'fs/promises';

const logger = pino(pretty());

export function logIntoFile(msg: string, filename: string) {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
    const contentLog = `${dateTime}-----${msg}\n`;
    fs.appendFile(filename, contentLog).catch(err => logger.error(err));
};

export default logger;
