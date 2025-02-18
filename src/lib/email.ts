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
    
    const result = await resend.emails.send({
      from: 'SnapFood <student-verification@snapfood.al>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    });

    return result;
  } catch (error) {
    console.error('Resend API Error:', error);
    throw error;
  }
}