import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
    },
  });
};

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ItemDonationEmailData {
  name: string;
  email: string;
  phone?: string;
  items: Array<{
    name: string;
    category: string;
    condition: string;
    description?: string;
    quantity: number;
  }>;
  pickupPreference: string;
  address?: string;
  preferredDate?: string;
  notes?: string;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'Givingtreenonprofit@gmail.com',
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #2563eb); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #374151; border-bottom: 2px solid #059669; padding-bottom: 10px;">Contact Details</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #059669;">${data.email}</a></p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <h3 style="color: #374151; margin-top: 30px;">Message:</h3>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
            <p style="line-height: 1.6; margin: 0;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; color: #0369a1; font-size: 14px;">
              <strong>Note:</strong> This message was sent through the contact form on The Giving Tree website.
              Please reply directly to ${data.email} to respond to this inquiry.
            </p>
          </div>
        </div>
        
        <div style="background: #374151; color: white; text-align: center; padding: 15px;">
          <p style="margin: 0; font-size: 14px;">The Giving Tree Foundation | Supporting Mackenzie Health</p>
        </div>
      </div>
    `,
    replyTo: data.email,
  };

  await transporter.sendMail(mailOptions);
};

export const sendItemDonationEmail = async (data: ItemDonationEmailData) => {
  const transporter = createTransporter();

  const itemsHtml = data.items.map(item => `
    <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #059669;">
      <h4 style="color: #374151; margin: 0 0 10px 0;">${item.name}</h4>
      <p style="margin: 5px 0;"><strong>Category:</strong> ${item.category}</p>
      <p style="margin: 5px 0;"><strong>Condition:</strong> ${item.condition}</p>
      <p style="margin: 5px 0;"><strong>Quantity:</strong> ${item.quantity}</p>
      ${item.description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${item.description}</p>` : ''}
    </div>
  `).join('');

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'Givingtreenonprofit@gmail.com',
    subject: `New Item Donation Request from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #2563eb); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Item Donation Request</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #374151; border-bottom: 2px solid #059669; padding-bottom: 10px;">Donor Information</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #059669;">${data.email}</a></p>
            ${data.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #059669;">${data.phone}</a></p>` : ''}
          </div>
          
          <h3 style="color: #374151; margin-top: 30px;">Pickup Information</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 8px 0;"><strong>Pickup Preference:</strong> ${data.pickupPreference}</p>
            ${data.address ? `<p style="margin: 8px 0;"><strong>Address:</strong> ${data.address}</p>` : ''}
            ${data.preferredDate ? `<p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${data.preferredDate}</p>` : ''}
          </div>
          
          <h3 style="color: #374151; margin-top: 30px;">Donated Items</h3>
          ${itemsHtml}
          
          ${data.notes ? `
            <h3 style="color: #374151; margin-top: 30px;">Additional Notes</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
              <p style="line-height: 1.6; margin: 0;">${data.notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            <p style="margin: 0; color: #166534; font-size: 14px;">
              <strong>Action Required:</strong> Please contact ${data.name} to coordinate the pickup of these donated items.
              Total items: ${data.items.length}
            </p>
          </div>
        </div>
        
        <div style="background: #374151; color: white; text-align: center; padding: 15px;">
          <p style="margin: 0; font-size: 14px;">The Giving Tree Foundation | Supporting Mackenzie Health</p>
        </div>
      </div>
    `,
    replyTo: data.email,
  };

  await transporter.sendMail(mailOptions);
};
