const nodemailer = require("nodemailer");

async function sendResetPasswordEmail(email, resetToken) {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        // Configure your email service provider here
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASSWORD, // Your email password or application-specific password
        },
    });

    // Email content
    const mailOptions = {
        from: "intensity_fitness_studio@gmail.com",
        to: email,
        subject: "Reset Password",
        html: `
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link to reset your password:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendResetPasswordEmail;
