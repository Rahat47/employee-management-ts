import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connectToDB() {
    const dbUri = config.get<string>('dbUri');
    const dbPassword = config.get<string>('dbPassword');

    const connectionString = dbUri.replace('<password>', dbPassword);

    try {
        await mongoose.connect(connectionString);
        logger.info('We are connected to the database');
    } catch (error) {
        process.exit(1);
    }
}

export default connectToDB;
