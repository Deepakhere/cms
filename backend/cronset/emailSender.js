import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deepakhere24@gmail.com',
        pass: 'rkiztanovcxokwyi'
    }
});

export default transporter;