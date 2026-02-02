// Rush Photos - Email Templates
// All emails sent from: hello@rush.photos

const BRAND_COLOR = "#E63946";
const BRAND_COLOR_DARK = "#D62839";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rush.photos";

// Base email wrapper with consistent branding
function emailWrapper(content: string, preheader?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheader ? `<meta name="x-apple-disable-message-reformatting"><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><title></title><span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }

    .header {
      background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_DARK} 100%);
      padding: 32px 24px;
      text-align: center;
    }

    .logo {
      display: inline-block;
    }

    .logo-text {
      font-size: 28px;
      color: #ffffff;
      text-decoration: none;
    }

    .logo-rush {
      font-weight: 900;
    }

    .logo-photos {
      font-weight: 600;
      font-size: 24px;
    }

    .content {
      padding: 40px 32px;
    }

    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 16px 0;
    }

    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 24px 0 12px 0;
    }

    p {
      color: #4b5563;
      margin: 0 0 16px 0;
      font-size: 16px;
    }

    .highlight-box {
      background: #fef2f2;
      border-left: 4px solid ${BRAND_COLOR};
      padding: 20px 24px;
      margin: 24px 0;
      border-radius: 0 12px 12px 0;
    }

    .info-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 24px;
      margin: 24px 0;
      border-radius: 16px;
    }

    .success-box {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 20px 24px;
      margin: 24px 0;
      border-radius: 0 12px 12px 0;
    }

    .btn {
      display: inline-block;
      background: ${BRAND_COLOR};
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      transition: background 0.2s;
    }

    .btn:hover {
      background: ${BRAND_COLOR_DARK};
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151 !important;
    }

    .btn-success {
      background: #10b981;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 32px 0;
    }

    .footer {
      background: #111827;
      padding: 32px;
      text-align: center;
    }

    .footer-logo {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 16px;
    }

    .footer p {
      color: #9ca3af;
      font-size: 14px;
      margin: 8px 0;
    }

    .footer a {
      color: #9ca3af;
      text-decoration: none;
    }

    .footer a:hover {
      color: #ffffff;
    }

    .social-links {
      margin: 20px 0;
    }

    .social-links a {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      margin: 0 6px;
      line-height: 36px;
      color: #9ca3af;
      text-decoration: none;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .price-total {
      font-size: 24px;
      font-weight: 800;
      color: ${BRAND_COLOR};
      text-align: right;
      margin-top: 16px;
    }

    .step {
      display: flex;
      margin: 16px 0;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: ${BRAND_COLOR};
      color: #ffffff;
      border-radius: 50%;
      text-align: center;
      line-height: 32px;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
      margin-right: 16px;
    }

    .step-content {
      flex: 1;
    }

    .step-title {
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .step-desc {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }

    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 20px;
      }
      h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div style="background-color: #f3f4f6; padding: 40px 16px;">
    <div class="email-container" style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div class="header">
        <a href="${SITE_URL}" class="logo">
          <span class="logo-text">
            <span class="logo-rush">rush</span><span class="logo-photos">photos</span>
          </span>
        </a>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <div class="footer-logo">
          <span style="font-weight: 900;">rush</span><span style="font-weight: 600;">photos</span>
        </div>
        <p>Professional Product Photography</p>
        <p>Hawthorne, NJ</p>
        <div class="divider" style="background: rgba(255,255,255,0.1); margin: 20px 0;"></div>
        <p style="font-size: 12px;">
          <a href="${SITE_URL}/privacy">Privacy Policy</a> &nbsp;|&nbsp;
          <a href="${SITE_URL}/terms">Terms of Service</a> &nbsp;|&nbsp;
          <a href="mailto:hello@rush.photos">Contact Us</a>
        </p>
        <p style="font-size: 12px; margin-top: 16px;">&copy; ${new Date().getFullYear()} Rush Studios. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Welcome Email - New User Signup
export function welcomeEmail(params: {
  customerName: string;
  email: string;
}) {
  const { customerName, email } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1>Welcome to Rush Photos! 🎉</h1>
    <p style="font-size: 18px; color: #374151;">Hi ${firstName},</p>
    <p>Thanks for joining Rush Photos! We're thrilled to have you on board. You're now part of a community that values stunning product photography.</p>

    <div class="info-box">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Your account email:</p>
      <p style="margin: 8px 0 0 0; font-weight: 700; color: #111827;">${email}</p>
    </div>

    <h2>What You Can Do Now</h2>

    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <p class="step-title">Start Your First Order</p>
        <p class="step-desc">Choose from E-commerce, Lifestyle, or Full Package photography</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <p class="step-title">Ship Your Products</p>
        <p class="step-desc">We'll send you instructions - products are fully insured</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <p class="step-title">Get Stunning Photos</p>
        <p class="step-desc">Professional photos delivered in 3-5 business days</p>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${SITE_URL}/order" class="btn">Start Your First Order</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Questions? Just reply to this email or contact us at<br>
      <a href="mailto:hello@rush.photos" style="color: ${BRAND_COLOR}; font-weight: 600;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Welcome to Rush Photos!

Hi ${firstName},

Thanks for joining Rush Photos! We're thrilled to have you on board.

Your account email: ${email}

What You Can Do Now:
1. Start Your First Order - Choose from E-commerce, Lifestyle, or Full Package photography
2. Ship Your Products - We'll send you instructions - products are fully insured
3. Get Stunning Photos - Professional photos delivered in 3-5 business days

Start your first order: ${SITE_URL}/order

Questions? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Welcome to Rush Photos - Let's create stunning product photos together!"),
    text,
    subject: "Welcome to Rush Photos! 🎉",
  };
}

// Order Confirmation Email
export function orderConfirmationEmail(params: {
  customerName: string;
  orderNumber: string;
  productName: string;
  packageType: string;
  total: number;
  cartItems: Array<{ style: string; angles: string[]; price: number }>;
}) {
  const { customerName, orderNumber, productName, packageType, total, cartItems } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const packageLabel = packageType === 'ecommerce' ? 'E-Commerce' :
                       packageType === 'lifestyle' ? 'Lifestyle' :
                       packageType === 'fullpackage' ? 'Full Package' : packageType;

  const itemsHtml = cartItems.length > 0 ? cartItems.map(item => `
    <div class="order-item">
      <div>
        <p style="margin: 0; font-weight: 600; color: #111827;">${item.style}</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Angles: ${item.angles.join(', ')}</p>
      </div>
      <p style="margin: 0; font-weight: 700; color: #111827;">$${item.price}</p>
    </div>
  `).join('') : '';

  const content = `
    <h1>Order Confirmed! ✅</h1>
    <p style="font-size: 18px; color: #374151;">Thanks for your order, ${firstName}!</p>
    <p>We've received your order and we're excited to create amazing photos for your products.</p>

    <div class="highlight-box">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Number</p>
      <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; color: ${BRAND_COLOR}; letter-spacing: 1px;">${orderNumber}</p>
    </div>

    <div class="info-box">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
        <span style="color: #6b7280;">Product</span>
        <span style="font-weight: 600; color: #111827;">${productName}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #6b7280;">Package</span>
        <span style="font-weight: 600; color: #111827;">${packageLabel}</span>
      </div>
    </div>

    ${cartItems.length > 0 ? `
    <h2>Your Selections</h2>
    <div class="info-box" style="padding: 0;">
      <div style="padding: 16px 24px;">
        ${itemsHtml}
      </div>
    </div>
    ` : ''}

    <div class="price-total">Total: $${total}</div>

    <div class="divider"></div>

    <h2>What's Next?</h2>

    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <p class="step-title">Shipping Instructions Coming Soon</p>
        <p class="step-desc">We'll email you detailed shipping instructions within 24 hours</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <p class="step-title">Ship Your Products</p>
        <p class="step-desc">Send your products to our studio - fully insured during transit</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <p class="step-title">Professional Photo Shoot</p>
        <p class="step-desc">We'll photograph your products within 2-3 days of receiving them</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <p class="step-title">Download & Receive</p>
        <p class="step-desc">Get your photos + we'll ship your products back to you</p>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${SITE_URL}/dashboard/orders" class="btn">View Order Status</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Questions about your order? Reply to this email or contact us at<br>
      <a href="mailto:hello@rush.photos" style="color: ${BRAND_COLOR}; font-weight: 600;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Order Confirmed!

Thanks for your order, ${firstName}!

Order Number: ${orderNumber}
Product: ${productName}
Package: ${packageLabel}
${cartItems.length > 0 ? `
Your Selections:
${cartItems.map(item => `- ${item.style} (${item.angles.join(', ')}): $${item.price}`).join('\n')}
` : ''}
Total: $${total}

What's Next?
1. Shipping Instructions Coming Soon - We'll email you within 24 hours
2. Ship Your Products - Products are fully insured during transit
3. Professional Photo Shoot - Within 2-3 days of receiving your products
4. Download & Receive - Get your photos + we'll ship your products back

View your order: ${SITE_URL}/dashboard/orders

Questions? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, `Order ${orderNumber} confirmed - We're excited to photograph your products!`),
    text,
    subject: `Order Confirmed - ${orderNumber}`,
  };
}

// Delivery Notification Email
export function deliveryNotificationEmail(params: {
  customerName: string;
  orderNumber: string;
  productName: string;
  deliveryUrl: string;
  photoCount: number;
}) {
  const { customerName, orderNumber, productName, deliveryUrl, photoCount } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">🎉</span>
    </div>

    <h1 style="text-align: center;">Your Photos Are Ready!</h1>
    <p style="font-size: 18px; color: #374151; text-align: center;">Hi ${firstName}, great news!</p>
    <p style="text-align: center;">Your professional product photos have been edited, retouched, and are ready for download.</p>

    <div class="success-box">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: #065f46;">Order Number</span>
        <span style="font-weight: 700; color: #065f46;">${orderNumber}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: #065f46;">Product</span>
        <span style="font-weight: 700; color: #065f46;">${productName}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #065f46;">Photos Ready</span>
        <span style="font-weight: 700; color: #065f46;">${photoCount} high-resolution images</span>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${deliveryUrl}" class="btn btn-success" style="font-size: 18px; padding: 18px 40px;">Download Your Photos</a>
    </div>

    <div class="info-box">
      <h2 style="margin-top: 0;">What You're Getting</h2>
      <ul style="color: #4b5563; padding-left: 20px;">
        <li>High-resolution images (300 DPI, print-ready)</li>
        <li>Professionally retouched and color-corrected</li>
        <li>Optimized for e-commerce, social media, and print</li>
        <li>Multiple formats included (JPEG, PNG)</li>
        <li>Files available for download for 90 days</li>
      </ul>
    </div>

    <h2>Your Product Return</h2>
    <p>Your products are being shipped back to you! You'll receive a separate email with tracking information once they're on their way.</p>

    <div class="divider"></div>

    <div style="background: #fef3c7; border-radius: 12px; padding: 20px; text-align: center;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #92400e;">Love your photos?</p>
      <p style="margin: 0; color: #92400e; font-size: 14px;">We'd love to hear your feedback! Need any adjustments? Reply within 7 days for free revisions.</p>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Questions? Reply to this email or contact us at<br>
      <a href="mailto:hello@rush.photos" style="color: ${BRAND_COLOR}; font-weight: 600;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Your Photos Are Ready!

Hi ${firstName}, great news!

Your professional product photos are ready for download.

Order: ${orderNumber}
Product: ${productName}
Photos: ${photoCount} high-resolution images

Download your photos: ${deliveryUrl}

What You're Getting:
- High-resolution images (300 DPI, print-ready)
- Professionally retouched and color-corrected
- Optimized for e-commerce, social media, and print
- Multiple formats included
- Files available for 90 days

Your products are being shipped back to you. You'll receive tracking info soon.

Love your photos? We'd love to hear your feedback!
Need adjustments? Reply within 7 days for free revisions.

Questions? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Your professional product photos are ready for download!"),
    text,
    subject: `🎉 Your Photos Are Ready - ${orderNumber}`,
  };
}

// Contact Form Submission - To Customer
export function contactConfirmationEmail(params: {
  customerName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { customerName, email, subject, message } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1>We Got Your Message! 📬</h1>
    <p style="font-size: 18px; color: #374151;">Hi ${firstName},</p>
    <p>Thank you for reaching out to Rush Photos! We've received your message and our team will get back to you within 24 hours.</p>

    <div class="info-box">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Your message:</p>
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #111827;">${subject}</p>
      <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${message}</p>
    </div>

    <p>In the meantime, you might find these helpful:</p>

    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 24px 0;">
      <a href="${SITE_URL}/faq" class="btn btn-secondary" style="flex: 1; min-width: 140px;">View FAQ</a>
      <a href="${SITE_URL}/process" class="btn btn-secondary" style="flex: 1; min-width: 140px;">How It Works</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Need urgent assistance? Call us at<br>
      <a href="tel:+19734279393" style="color: ${BRAND_COLOR}; font-weight: 600;">+1 (973) 427-9393</a>
    </p>
  `;

  const text = `
We Got Your Message!

Hi ${firstName},

Thank you for reaching out to Rush Photos! We've received your message and our team will get back to you within 24 hours.

Your message:
Subject: ${subject}
${message}

In the meantime, check out:
- FAQ: ${SITE_URL}/faq
- How It Works: ${SITE_URL}/process

Need urgent assistance? Call us at +1 (973) 427-9393

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Thanks for contacting Rush Photos - We'll respond within 24 hours!"),
    text,
    subject: "We Got Your Message - Rush Photos",
  };
}

// Contact Form Submission - To Admin (hello@rush.photos)
export function contactNotificationEmail(params: {
  customerName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { customerName, email, phone, subject, message } = params;

  const content = `
    <h1>New Contact Form Submission 📩</h1>
    <p>You have a new message from the Rush Photos website.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Contact Details</h2>
      <div style="margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Name</p>
        <p style="margin: 4px 0 0 0; font-weight: 600; color: #111827;">${customerName}</p>
      </div>
      <div style="margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Email</p>
        <p style="margin: 4px 0 0 0; font-weight: 600; color: #111827;"><a href="mailto:${email}" style="color: ${BRAND_COLOR};">${email}</a></p>
      </div>
      ${phone ? `
      <div style="margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Phone</p>
        <p style="margin: 4px 0 0 0; font-weight: 600; color: #111827;"><a href="tel:${phone}" style="color: ${BRAND_COLOR};">${phone}</a></p>
      </div>
      ` : ''}
    </div>

    <div class="highlight-box">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Subject</p>
      <p style="margin: 0 0 16px 0; font-weight: 700; color: #111827;">${subject}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Message</p>
      <p style="margin: 0; color: #374151; white-space: pre-wrap;">${message}</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn">Reply to ${customerName}</a>
    </div>
  `;

  const text = `
New Contact Form Submission

Name: ${customerName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Subject: ${subject}

Message:
${message}

Reply to this customer: mailto:${email}
  `.trim();

  return {
    html: emailWrapper(content),
    text,
    subject: `New Contact: ${subject}`,
  };
}

// Shipping Instructions Email
export function shippingInstructionsEmail(params: {
  customerName: string;
  orderNumber: string;
  productName: string;
}) {
  const { customerName, orderNumber, productName } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1>Shipping Instructions 📦</h1>
    <p style="font-size: 18px; color: #374151;">Hi ${firstName},</p>
    <p>It's time to send your products to our studio! Here's everything you need to know.</p>

    <div class="highlight-box">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Number</p>
      <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: ${BRAND_COLOR};">${orderNumber}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">Product: ${productName}</p>
    </div>

    <div class="info-box" style="background: #fef2f2;">
      <h2 style="margin-top: 0; color: #991b1b;">📍 Ship To:</h2>
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
        Rush Photo Studio<br>
        Attn: Order ${orderNumber}<br>
        123 Studio Lane<br>
        Hawthorne, NJ 07506
      </p>
    </div>

    <h2>Shipping Tips</h2>

    <div class="step">
      <div class="step-number">✓</div>
      <div class="step-content">
        <p class="step-title">Package Securely</p>
        <p class="step-desc">Use bubble wrap or packing paper to protect your products</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">✓</div>
      <div class="step-content">
        <p class="step-title">Include Order Number</p>
        <p class="step-desc">Write "${orderNumber}" on the outside of your package</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">✓</div>
      <div class="step-content">
        <p class="step-title">Use Any Carrier</p>
        <p class="step-desc">FedEx, UPS, USPS - whatever works best for you</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">✓</div>
      <div class="step-content">
        <p class="step-title">Get Tracking</p>
        <p class="step-desc">Keep your tracking number to monitor delivery</p>
      </div>
    </div>

    <div class="success-box" style="margin-top: 24px;">
      <p style="margin: 0; font-weight: 700; color: #065f46;">🛡️ Your products are fully insured</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #065f46;">From the moment they arrive at our studio until they're back in your hands.</p>
    </div>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Questions about shipping? Reply to this email or contact us at<br>
      <a href="mailto:hello@rush.photos" style="color: ${BRAND_COLOR}; font-weight: 600;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Shipping Instructions

Hi ${firstName},

It's time to send your products to our studio!

Order Number: ${orderNumber}
Product: ${productName}

SHIP TO:
Rush Photo Studio
Attn: Order ${orderNumber}
123 Studio Lane
Hawthorne, NJ 07506

Shipping Tips:
✓ Package Securely - Use bubble wrap or packing paper
✓ Include Order Number - Write "${orderNumber}" on the outside
✓ Use Any Carrier - FedEx, UPS, USPS all work
✓ Get Tracking - Keep your tracking number

Your products are fully insured from arrival to return!

Questions? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, `Shipping instructions for order ${orderNumber} - Send your products to our studio!`),
    text,
    subject: `Shipping Instructions - ${orderNumber}`,
  };
}
