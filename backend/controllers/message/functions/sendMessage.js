// controllers/message/functions/sendMessage.js
import Message from '../../../models/message.model.js';
import { transporter } from '../helpers/emailHelper.js';

// @desc    Send a contact message and save it to the database
// @route   POST /api/messages/send
// @access  Public
export const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Save the message to the database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        // Define the email content
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,
            to: process.env.TO_EMAIL, // The email that receives the notification
            subject: `New Contact Form Submission from ${name}`,
            html: `<p>You have a new message from <strong>${name}</strong> (${email}):</p>
                   <p style="border-left: 2px solid #ccc; padding-left: 1em;">${message}</p>`,
        };

        // Send the email using the centralized transporter
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error in sendMessage controller:', error);
        res.status(500).json({ success: false, message: 'Server error. Failed to send message.' });
    }
};