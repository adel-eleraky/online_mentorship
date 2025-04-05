export const resetPasswordEmailTemplate = (url, name = "User") => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .email-container {
                background-color: #ffffff;
                max-width: 600px;
                margin: 20px auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                text-align: center;
            }
            .email-header {
                background-color:green;
                color: #ffffff;
                padding: 20px;
                font-size: 24px;
                font-weight: bold;
            }
            .email-body {
                padding: 30px;
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
            }
            .email-body p {
                margin: 15px 0;
            }
            .button {

                display: inline-block;
                background-color: green;
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 24px;
                border-radius: 6px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                transition: background 0.3s ease-in-out;
            }
            .button:hover {
                background-color: rgb(10, 113, 46);
                color: #ffffff;
            }
            .a{
                text-decoration: none;}
            .email-footer {
                background-color: #f8f9fa;
                padding: 20px;
                font-size: 14px;
                color: #6c757d;
                text-align: center;
            }
            .email-footer a {
                color: #dc3545;
                text-decoration: none;
                font-weight: bold;
            }
            .email-footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Password Reset Request
            </div>
            <div class="email-body">
                <p>Dear <strong>${name}</strong>,</p>
                <p>We received a request to reset your password. Please click the button below to proceed.</p>
                <p><a href="${url}" class="button">Reset Password</a></p>
                <p>If you did not request this, please disregard this email.</p>
                <p><strong>Note:</strong> This link will expire in <strong>1 hour</strong> for security reasons.</p>
            </div>
            <div class="email-footer">
                <p>© 2025 Your Company Name. All rights reserved.</p>
                <p>Need help? <a href="mailto:support@yourcompany.com">Contact Support</a></p>
            </div>
        </div>
    </body>
    </html>`;
  };
  