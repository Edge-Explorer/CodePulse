from fastapi import APIRouter, HTTPException, status
from src.schemas.contact import ContactForm
from src.core.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("", status_code=status.HTTP_200_OK)
async def send_contact_email(form: ContactForm):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SMTP credentials not configured."
        )
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USER
        msg['To'] = settings.SMTP_USER  # Sending the message to your own email
        msg['Reply-To'] = form.email
        msg['Subject'] = f"CodePulse Inquiry: {form.subject}"

        body = f"""
        New message from CodePulse Contact Form:
        
        From: {form.name} ({form.email})
        Subject: {form.subject}
        
        Message:
        {form.message}
        """
        msg.attach(MIMEText(body, 'plain'))

        # Send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        return {"message": "Email sent successfully."}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )
