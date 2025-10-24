// backend/utils/sendEmail.js

import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Create a transporter using your environment variables
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // For Gmail, you might need to configure TLS
        tls: {
            rejectUnauthorized: false
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;