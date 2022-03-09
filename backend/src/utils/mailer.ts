import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import logger from './logger';

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

// createTestCreds();

type Smtp = {
    user: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
};

const smtp = config.get<Smtp>('smtp');
const transporter = nodemailer.createTransport({
    ...smtp,
    auth: {
        user: smtp.user,
        pass: smtp.pass,
    },
});

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            logger.error(err, 'Error sending email');
            return;
        }
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
}

export default sendEmail;
