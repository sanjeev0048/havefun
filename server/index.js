const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Contact API
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: 'havfuntrampolinepark@gmail.com',
        subject: `New Contact Message from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}
        `,
        html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
        replyTo: email
    };

    try {
        if (process.env.SMTP_PASS === 'your_app_password_here') {
            console.warn('Contact message received but email could not be sent: SMTP_PASS is still the placeholder.');
            return res.status(200).json({ 
                success: true, 
                message: 'Message received! (Note: Email not sent because SMTP is not configured in .env)' 
            });
        }
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending contact mail:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Check server logs or .env configuration.',
            error: error.message 
        });
    }
});

// Waiver API
app.post('/api/waiver', async (req, res) => {
    const { name, email, phone, participants, signed } = req.body;

    const participantsList = participants.map(p => `<li>${p.name} (DOB: ${p.dob})</li>`).join('');

    const mailOptions = {
        from: `"HavFun Booking" <${process.env.SMTP_USER}>`,
        to: 'havfuntrampolinepark@gmail.com',
        subject: `New Ticket Booking & Waiver Signed by ${name}`,
        text: `
            Main Signatory: ${name}
            Email: ${email}
            Phone: ${phone}
            Participants: ${participants.map(p => `${p.name} (${p.dob})`).join(', ')}
            Status: Sealed/Signed
        `,
        html: `
            <h3>New Ticket Booking & Waiver Signed</h3>
            <p><strong>Main Signatory:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <h4>Participants:</h4>
            <ul>${participantsList}</ul>
            <p><strong>Status:</strong> Sealed and Signed</p>
        `,
        replyTo: email
    };

    try {
        if (process.env.SMTP_PASS === 'your_app_password_here') {
            console.warn('Waiver signed but email could not be sent: SMTP_PASS is still the placeholder.');
            return res.status(200).json({ 
                success: true, 
                message: 'Waiver signed! (Note: Email not sent because SMTP is not configured in .env)' 
            });
        }
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Waiver archived successfully!' });
    } catch (error) {
        console.error('Error sending waiver mail:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Check server logs or .env configuration.',
            error: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
