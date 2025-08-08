import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Starting email test...');
    
    // Check environment variables first
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    
    console.log('📧 Gmail User:', gmailUser ? 'Set ✓' : 'Missing ✗');
    console.log('🔐 Gmail Password:', gmailPassword ? 'Set ✓' : 'Missing ✗');
    
    if (!gmailUser || !gmailPassword) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration missing',
        details: {
          gmailUser: !!gmailUser,
          gmailPassword: !!gmailPassword
        }
      }, { status: 500 });
    }

    const { testEmail } = await request.json();
    
    // Create test email data
    const testEmailData = {
      name: 'Email Test System',
      email: testEmail || 'test@example.com',
      subject: '🧪 Email Configuration Test',
      message: `This is a test email sent at ${new Date().toISOString()} to verify your email configuration is working correctly.

If you received this email, your Gmail SMTP setup is working properly!

Configuration Details:
- Gmail User: ${gmailUser}
- Timestamp: ${new Date().toLocaleString()}
- Environment: ${process.env.NODE_ENV || 'development'}

Next steps:
1. Check if contact form emails are working
2. Test item donation emails
3. Verify all email templates are displaying correctly

This test was sent from your Giving Tree website email system.`
    };

    console.log('📤 Attempting to send test email...');
    console.log('📧 To:', gmailUser);
    console.log('👤 From:', testEmailData.email);
    console.log('🔐 Testing Gmail authentication...');
    
    // Attempt to send the email
    const emailResult = await sendContactEmail(testEmailData);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Email details:', {
      to: gmailUser,
      from: testEmailData.email,
      subject: testEmailData.subject,
      messageId: emailResult?.messageId || 'unknown'
    });
    
    return NextResponse.json({
      success: true,
      message: '✅ Gmail authentication successful! Email sent to Gmail servers. If not received, check delivery troubleshooting below.',
      details: {
        authenticationStatus: 'SUCCESS - Gmail credentials are working correctly',
        to: gmailUser,
        from: testEmailData.email,
        subject: testEmailData.subject,
        messageId: emailResult?.messageId || 'unknown',
        timestamp: new Date().toISOString(),
        deliveryNote: 'Email was successfully sent to Gmail. If not received, this is a delivery/filtering issue, not an authentication problem.',
        troubleshooting: {
          checkSpam: 'Check your spam/junk folder - most common cause',
          checkEmail: `Verify ${gmailUser} is the correct email address`,
          waitTime: 'Emails can take 1-5 minutes to arrive',
          gmailFilters: 'Check Gmail Settings → Filters and Blocked Addresses',
          gmailTabs: 'Check Promotions/Updates tabs in Gmail'
        }
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    let errorMessage = 'Unknown email error';
    let errorCode = 'UNKNOWN';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Categorize common email errors
      if (error.message.includes('Invalid login') || error.message.includes('authentication') || error.message.includes('Username and Password not accepted')) {
        errorCode = 'AUTH_FAILED';
        errorMessage = 'Gmail authentication failed. Your username or app password is incorrect.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorCode = 'NETWORK_ERROR';
        errorMessage = 'Network error. Cannot reach Gmail servers.';
      } else if (error.message.includes('ETIMEDOUT')) {
        errorCode = 'TIMEOUT';
        errorMessage = 'Connection timeout. Check your internet connection.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorCode = 'CONNECTION_REFUSED';
        errorMessage = 'Connection refused by Gmail servers.';
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorCode,
      details: {
        originalError: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
