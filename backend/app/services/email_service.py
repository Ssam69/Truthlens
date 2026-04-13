import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from ..core.config import settings

class EmailService:
    def __init__(self):
        self.configuration = sib_api_v3_sdk.Configuration()
        self.configuration.api_key['api-key'] = settings.BREVO_API_KEY
        self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(self.configuration))

    async def send_otp_email(self, email: str, otp: str):
        """Send OTP code to user via Brevo."""
        subject = "Your TruthLens Verification Code"
        sender = {"name": "TruthLens Team", "email": "no-reply@truthlens.com"}
        to = [{"email": email}]
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #6d28d9; text-align: center;">TruthLens Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for signing up for TruthLens. Please use the following 6-digit code to verify your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #6d28d9; border: 2px dashed #6d28d9; padding: 10px 20px; border-radius: 5px;">
                            {otp}
                        </span>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777; text-align: center;">
                        &copy; 2026 TruthLens. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """
        
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            html_content=html_content,
            sender=sender,
            subject=subject
        )

        try:
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            print(f"OTP Email sent successfully to {email}")
            return True
        except ApiException as e:
            print(f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
            return False

email_service = EmailService()
