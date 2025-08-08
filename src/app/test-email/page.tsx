'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Bug,
  Settings
} from 'lucide-react';

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    errorCode?: string;
    testType?: string;
    details?: Record<string, unknown>;
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const runEmailTest = async () => {
    setIsRunningTest(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          testEmail: testEmail || 'Givingtreenonprofit@gmail.com' 
        }),
      });

      const result = await response.json();
      setTestResult(result);
      setShowDetails(true);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to run email test',
        details: { originalError: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const testContactForm = async () => {
    setIsRunningTest(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Contact Form Test',
          email: testEmail || 'test@example.com',
          subject: '🧪 Contact Form Test',
          message: 'This is a test message from the contact form to verify it is working correctly.'
        }),
      });

      const result = await response.json();
      setTestResult({
        success: response.ok,
        message: result.message || result.error,
        testType: 'Contact Form',
        details: result
      });
      setShowDetails(true);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Contact form test failed',
        testType: 'Contact Form',
        details: { originalError: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const testDonationForm = async () => {
    setIsRunningTest(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/donations/items/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Donation Form Test',
          email: testEmail || 'test@example.com',
          phone: '555-123-4567',
          items: [{
            name: 'Test Item',
            category: 'Test Category',
            condition: 'excellent',
            description: 'This is a test donation item',
            quantity: 1
          }],
          pickupPreference: 'pickup',
          notes: 'This is a test donation to verify the email system is working.'
        }),
      });

      const result = await response.json();
      setTestResult({
        success: response.ok,
        message: result.message || result.error,
        testType: 'Donation Form',
        details: result
      });
      setShowDetails(true);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Donation form test failed',
        testType: 'Donation Form',
        details: { originalError: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const getErrorHelp = (errorCode: string) => {
    switch (errorCode) {
      case 'AUTH_FAILED':
        return {
          title: 'Authentication Failed',
          help: [
            'Check that your Gmail app password is correct',
            'Make sure 2-factor authentication is enabled on your Gmail account',
            'Verify that the app password was created for "Mail"',
            'Check that GMAIL_USER and GMAIL_APP_PASSWORD are set in Vercel'
          ]
        };
      case 'NETWORK_ERROR':
        return {
          title: 'Network Error',
          help: [
            'Check your internet connection',
            'Verify that Gmail SMTP servers are accessible',
            'Try again in a few minutes'
          ]
        };
      default:
        return {
          title: 'Email Configuration Issue',
          help: [
            'Check the EMAIL_SETUP.md guide',
            'Verify environment variables are set correctly',
            'Make sure Gmail app password is configured'
          ]
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-white hover:text-green-200 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <Bug className="h-16 w-16 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl font-bold mb-4">Email System Test</h1>
            <p className="text-xl text-green-100">
              Debug and test your email configuration
            </p>
          </div>
        </div>
      </div>

      {/* Test Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Test Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Email Tests</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email Address (optional)
                </label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Leave empty to use Givingtreenonprofit@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={runEmailTest}
                  disabled={isRunningTest}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isRunningTest ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      Test Email Configuration
                    </>
                  )}
                </button>

                <button
                  onClick={testContactForm}
                  disabled={isRunningTest}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isRunningTest ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Contact Form'
                  )}
                </button>

                <button
                  onClick={testDonationForm}
                  disabled={isRunningTest}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isRunningTest ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Donation Form'
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Results</h2>
            
            {!testResult && !isRunningTest && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Run a test to see results here</p>
              </div>
            )}

            {testResult && (
              <div className="space-y-4">
                {/* Status */}
                <div className={`flex items-center p-4 rounded-lg ${
                  testResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResult.success ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-800">Success!</p>
                        <p className="text-green-700">{testResult.message}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                        <p className="font-semibold text-red-800">Failed</p>
                        <p className="text-red-700">{testResult.error}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Error Help */}
                {!testResult.success && testResult.errorCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          {getErrorHelp(testResult.errorCode).title}
                        </h4>
                        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                          {getErrorHelp(testResult.errorCode).help.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details */}
                {showDetails && testResult.details && (
                  <div>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-blue-600 hover:text-blue-700 font-medium mb-2"
                    >
                      {showDetails ? 'Hide' : 'Show'} Details
                    </button>
                    {showDetails && (
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                        {JSON.stringify(testResult.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Email Delivery Troubleshooting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">📧 Email Delivery Troubleshooting</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Emails "Sent Successfully" but Not Received?</h4>
            <p className="text-yellow-700 text-sm">
              If the test shows success but you don&apos;t receive emails, follow these steps:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🔍 Check These Locations</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">1.</span>
                  <div>
                    <p className="font-medium">Spam/Junk Folder</p>
                    <p className="text-sm text-gray-600">Most common cause - check your spam folder first</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-500 mr-2">2.</span>
                  <div>
                    <p className="font-medium">Gmail Promotions Tab</p>
                    <p className="text-sm text-gray-600">Check the Promotions tab in Gmail</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">3.</span>
                  <div>
                    <p className="font-medium">All Mail Folder</p>
                    <p className="text-sm text-gray-600">Search in Gmail&apos;s &quot;All Mail&quot; section</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">4.</span>
                  <div>
                    <p className="font-medium">Wait 1-5 Minutes</p>
                    <p className="text-sm text-gray-600">Email delivery can be delayed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">⚙️ Gmail Settings to Check</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-sm">Verify Email Address</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Make sure <code className="bg-gray-200 px-1 rounded">Givingtreenonprofit@gmail.com</code> is correct
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-sm">Check Gmail Filters</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Go to Gmail Settings → Filters and Blocked Addresses
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-sm">Enable External Senders</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Make sure Gmail accepts emails from external sources
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">🔧 Still Not Working?</h5>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Try sending to a different email address (like a personal Gmail)</p>
              <p>• Check the Vercel function logs for any additional error messages</p>
              <p>• Verify your Gmail account can receive emails from external sources</p>
              <p>• Contact your domain administrator if using a custom domain</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Setup Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Email Setup Guide</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Environment Variables</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                <div>GMAIL_USER=Givingtreenonprofit@gmail.com</div>
                <div>GMAIL_APP_PASSWORD=your_app_password</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Common Issues</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• App password not created correctly</li>
                <li>• 2FA not enabled on Gmail</li>
                <li>• Environment variables not set in Vercel</li>
                <li>• Wrong Gmail credentials</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
