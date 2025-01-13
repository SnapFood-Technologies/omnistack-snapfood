import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Using service role key for backend
);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/snapfood',
  facebook: 'https://facebook.com/snapfood',
  instagram: 'https://instagram.com/snapfood',
  tiktok: 'https://tiktok.com/@snapfood'
};

const EMAIL_TEMPLATES = {
  STUDENT_VERIFICATION_APPROVED: {
    file: 'email-templates/student-approved.html',
    subject: 'Your Student Card has been Approved! 🎉',
    variables: {
      logoUrl: `${BASE_URL}/assets/snapfood/snapfood-email-logo.png`,
      twitterUrl: SOCIAL_LINKS.twitter,
      facebookUrl: SOCIAL_LINKS.facebook,
      instagramUrl: SOCIAL_LINKS.instagram,
      tiktokUrl: SOCIAL_LINKS.tiktok,
      twitterIconUrl: `${BASE_URL}/assets/snapfood/twitter.svg`,
      facebookIconUrl: `${BASE_URL}/assets/snapfood/facebook.svg`,
      instagramIconUrl: `${BASE_URL}/assets/snapfood/instagram.svg`,
      tiktokIconUrl: `${BASE_URL}/assets/snapfood/tiktok.svg`,
      illustrationUrl: `${BASE_URL}/assets/snapfood/approved-student-banner.png`
    }
  },
  STUDENT_VERIFICATION_DECLINED: {
    file: 'email-templates/student-declined.html',
    subject: 'Student Card Verification Update',
    variables: {
      logoUrl: `${BASE_URL}/assets/snapfood/snapfood-email-logo.png`,
      twitterUrl: SOCIAL_LINKS.twitter,
      facebookUrl: SOCIAL_LINKS.facebook,
      instagramUrl: SOCIAL_LINKS.instagram,
      tiktokUrl: SOCIAL_LINKS.tiktok,
      twitterIconUrl: `${BASE_URL}/assets/snapfood/social-x.png`,
      facebookIconUrl: `${BASE_URL}/assets/snapfood/social-fb.png`,
      instagramIconUrl: `${BASE_URL}/assets/snapfood/social-insta.png`,
      tiktokIconUrl: `${BASE_URL}/assets/snapfood/social-tiktok.png`,
      illustrationUrl: `${BASE_URL}/assets/snapfood/declined-student-banner.png`
    }
  }
} as const;

// Function to fetch template from Supabase Storage
async function getTemplate(templatePath: string) {
  try {
    const { data, error } = await supabase
      .storage
      .from('templates') // Your bucket name
      .download(templatePath);
    
    if (error) {
      throw error;
    }

    return await data.text();
  } catch (error) {
    console.error('Error fetching template:', error);
    throw new Error(`Failed to fetch template: ${error.message}`);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request:', body);

    const { status, email, fullName, declineReason } = body;

    const emailType = status === 'APPROVED' 
      ? 'STUDENT_VERIFICATION_APPROVED' 
      : 'STUDENT_VERIFICATION_DECLINED';

    const template = EMAIL_TEMPLATES[emailType];

    if (!template) {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // Fetch template from Supabase Storage
    const htmlContent = await getTemplate(template.file);

    // Replace all variables including images and social links
    const allVariables = {
      ...template.variables,
      userName: fullName,
      declineReason: declineReason || ''
    };

    // Replace all variables in the template
    const processedHtml = Object.entries(allVariables).reduce(
      (html, [key, value]) => html.replace(new RegExp(`{{${key}}}`, 'g'), value),
      htmlContent
    );

    console.log('Sending email with content:', {
      to: email,
      subject: template.subject,
      htmlLength: processedHtml.length
    });

    // Send email
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: processedHtml
    });

    console.log('Email sent:', result);

    return NextResponse.json({ 
      success: true,
      emailId: result.id
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to send email',
      details: error
    }, { status: 500 });
  }
}