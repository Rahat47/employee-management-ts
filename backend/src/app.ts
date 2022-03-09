require('dotenv').config();
import express from 'express';
import config from 'config';
import cors from 'cors';
import connectToDB from './utils/connectToDB';
import logger from './utils/logger';
import router from './routes';

const PORT = config.get<number>('port');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);

    await connectToDB();
});
