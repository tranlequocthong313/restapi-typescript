import app from './src/app';
import config from './config';
import { logger } from './src/utils';
import { connectToDB } from './src/databases';

const PORT: number = config.SERVER.PORT;
app.listen(PORT, () => {
    logger.info(`Sever is running on port:::${PORT}`);

    connectToDB();
});

