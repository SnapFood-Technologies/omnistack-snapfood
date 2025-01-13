// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(emailData: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    console.log('Attempting to send email to:', emailData.to);
    
    const result = await resend.emails.send({
      from: 'SnapFood <onboarding@resend.dev>', // Use verified domain or default resend domain
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    });

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Resend API Error:', error);
    throw error;
  }
}