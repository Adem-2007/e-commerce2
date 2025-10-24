// controllers/message/functions/replyToMessage.js
import Message from '../../../models/message.model.js';
import { transporter } from '../helpers/emailHelper.js';

// @desc    Send a reply to a message and save it
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
export const replyToMessage = async (req, res) => {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
        return res.status(400).json({ success: false, message: 'Reply content cannot be empty.' });
    }

    try {
        const originalMessage = await Message.findById(req.params.id);
        if (!originalMessage) {
            return res.status(404).json({ success: false, message: 'Original message not found.' });
        }

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,
            to: originalMessage.email,
            subject: `Re: Your message to ${process.env.EMAIL_FROM}`,
            html: `
                <p>Hello ${originalMessage.name},</p>
                <p>Thank you for your message. Here is our response:</p>
                <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em; font-style: italic;">
                    ${reply}
                </blockquote>
                <p>Best regards,</p>
                <p><strong>${process.env.EMAIL_FROM}</strong></p>
                <hr style="margin-top: 20px; margin-bottom: 20px;">
                <p style="font-size: 0.9em; color: #666;">
                    <strong>Original message from you on ${new Date(originalMessage.createdAt).toDateString()}:</strong><br>
                    <em>"${originalMessage.message}"</em>
                </p>
            `,
        };

        // Send the reply email
        await transporter.sendMail(mailOptions);

        // Update the message in the database
        originalMessage.reply = reply;
        originalMessage.repliedAt = new Date();
        const updatedMessage = await originalMessage.save();

        res.status(200).json({ success: true, message: 'Reply sent successfully!', data: updatedMessage });

    } catch (error) {
        console.error('Error in replyToMessage controller:', error);
        res.status(500).json({ success: false, message: 'Server error. Failed to send reply.' });
    }
};