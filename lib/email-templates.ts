// Rush Photos - Email Templates
// All emails sent from: hello@rush.photos

const BRAND_COLOR = "#E63946";
const BRAND_COLOR_DARK = "#D62839";
const SUCCESS_COLOR = "#10B981";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rush.photos";

// Clean, minimal email wrapper
function emailWrapper(content: string, preheader?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Rush Photos</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f2937;background-color:#f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background:${BRAND_COLOR};width:40px;height:40px;border-radius:10px;text-align:center;vertical-align:middle;">
                      <span style="color:#fff;font-size:18px;font-weight:800;">R</span>
                    </td>
                    <td style="padding-left:12px;">
                      <span style="font-size:22px;font-weight:800;color:#111827;letter-spacing:-0.5px;">rush</span>
                      <span style="font-size:22px;font-weight:500;color:#6b7280;letter-spacing:-0.5px;margin-left:2px;">photos</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:40px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;">
                <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:none;">Website</a>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="${SITE_URL}/faq" style="color:#9ca3af;text-decoration:none;">FAQ</a>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="mailto:hello@rush.photos" style="color:#9ca3af;text-decoration:none;">Contact</a>
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                © ${new Date().getFullYear()} Rush Photos · Hawthorne, NJ
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Simple button component
function button(text: string, url: string, color = BRAND_COLOR) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Info box component
function infoBox(content: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:#f9fafb;border-radius:12px;padding:20px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

// Highlight box component
function highlightBox(content: string, borderColor = BRAND_COLOR) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:#fef2f2;border-left:3px solid ${borderColor};border-radius:0 12px 12px 0;padding:20px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

// Success box component
function successBox(content: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:#ecfdf5;border-left:3px solid ${SUCCESS_COLOR};border-radius:0 12px 12px 0;padding:20px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

// Step item component
function stepItem(number: string, title: string, description: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;">
      <tr>
        <td width="36" valign="top" style="padding-right:14px;">
          <div style="width:28px;height:28px;background:${BRAND_COLOR};border-radius:8px;text-align:center;line-height:28px;color:#ffffff;font-weight:700;font-size:13px;">
            ${number}
          </div>
        </td>
        <td valign="top">
          <p style="margin:0 0 2px 0;font-size:15px;font-weight:600;color:#111827;">${title}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;">${description}</p>
        </td>
      </tr>
    </table>
  `;
}

// Check item component
function checkItem(text: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:10px 0;">
      <tr>
        <td width="24" valign="top" style="padding-right:10px;">
          <span style="color:${SUCCESS_COLOR};font-size:16px;">✓</span>
        </td>
        <td valign="top">
          <span style="font-size:14px;color:#374151;">${text}</span>
        </td>
      </tr>
    </table>
  `;
}

// Welcome Email
export function welcomeEmail(params: {
  customerName: string;
  email: string;
}) {
  const { customerName, email } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;text-align:center;">
      Welcome to Rush Photos!
    </h1>
    <p style="margin:0 0 28px 0;font-size:16px;color:#6b7280;text-align:center;">
      Hi ${firstName}, we're excited to have you.
    </p>

    ${infoBox(`
      <p style="margin:0;font-size:13px;color:#6b7280;">Your account</p>
      <p style="margin:4px 0 0 0;font-size:15px;font-weight:600;color:#111827;">${email}</p>
    `)}

    <p style="margin:32px 0 20px 0;font-size:15px;font-weight:600;color:#111827;">How it works:</p>

    ${stepItem("1", "Place your order", "Choose your package and customize options")}
    ${stepItem("2", "Ship your products", "Send them to our studio - fully insured")}
    ${stepItem("3", "Get your photos", "Download in 3-5 business days")}

    ${button("Start Your First Order", `${SITE_URL}/order`)}

    ${successBox(`
      <p style="margin:0;font-size:14px;color:#065f46;">
        <strong>100% Satisfaction Guarantee</strong><br>
        Not happy? Get free revisions or your money back.
      </p>
    `)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Questions? <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};text-decoration:none;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Welcome to Rush Photos!

Hi ${firstName}, we're excited to have you.

Your account: ${email}

How it works:
1. Place your order - Choose your package and customize options
2. Ship your products - Send them to our studio - fully insured
3. Get your photos - Download in 3-5 business days

Start your first order: ${SITE_URL}/order

100% Satisfaction Guarantee - Not happy? Get free revisions or your money back.

Questions? hello@rush.photos
  `.trim();

  return {
    html: emailWrapper(content, "Welcome to Rush Photos - Let's create stunning product photos!"),
    text,
    subject: "Welcome to Rush Photos!",
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
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
        <p style="margin:0;font-size:14px;font-weight:500;color:#111827;">${item.style}</p>
        <p style="margin:2px 0 0 0;font-size:13px;color:#9ca3af;">${item.angles.join(', ')}</p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;color:#111827;">
        $${item.price}
      </td>
    </tr>
  `).join('') : '';

  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:56px;height:56px;background:#ecfdf5;border-radius:50%;line-height:56px;margin-bottom:16px;">
        <span style="font-size:28px;">✓</span>
      </div>
      <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;">
        Order Confirmed!
      </h1>
      <p style="margin:0;font-size:16px;color:#6b7280;">
        Thanks for your order, ${firstName}
      </p>
    </div>

    ${highlightBox(`
      <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Order Number</p>
      <p style="margin:6px 0 0 0;font-size:22px;font-weight:700;color:${BRAND_COLOR};letter-spacing:1px;">${orderNumber}</p>
    `)}

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size:13px;color:#6b7280;">Product</td>
          <td style="text-align:right;font-size:14px;font-weight:500;color:#111827;">${productName}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-top:8px;">Package</td>
          <td style="text-align:right;font-size:14px;font-weight:500;color:#111827;padding-top:8px;">${packageLabel}</td>
        </tr>
      </table>
    `)}

    ${cartItems.length > 0 ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      ${itemsHtml}
      <tr>
        <td style="padding:16px 0 0 0;font-size:15px;font-weight:600;color:#111827;">Total</td>
        <td style="padding:16px 0 0 0;text-align:right;font-size:20px;font-weight:700;color:${BRAND_COLOR};">$${total}</td>
      </tr>
    </table>
    ` : `
    <p style="margin:24px 0;text-align:right;font-size:20px;font-weight:700;color:${BRAND_COLOR};">Total: $${total}</p>
    `}

    <p style="margin:32px 0 20px 0;font-size:15px;font-weight:600;color:#111827;">What's next?</p>

    ${stepItem("1", "Check your email", "Shipping instructions coming within 24 hours")}
    ${stepItem("2", "Ship your products", "Send to our studio - fully insured")}
    ${stepItem("3", "We photograph", "Professional shoot within 2-3 days")}
    ${stepItem("4", "Download photos", "Plus we ship your products back")}

    ${button("View Order Status", `${SITE_URL}/dashboard/orders`)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Questions? <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};text-decoration:none;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Order Confirmed!

Thanks for your order, ${firstName}!

Order Number: ${orderNumber}
Product: ${productName}
Package: ${packageLabel}
${cartItems.length > 0 ? cartItems.map(item => `- ${item.style}: $${item.price}`).join('\n') : ''}
Total: $${total}

What's next?
1. Check your email - Shipping instructions within 24 hours
2. Ship your products - Fully insured
3. We photograph - Within 2-3 days
4. Download photos - Plus we ship your products back

View order: ${SITE_URL}/dashboard/orders

Questions? hello@rush.photos
  `.trim();

  return {
    html: emailWrapper(content, `Order ${orderNumber} confirmed!`),
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
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:56px;height:56px;background:#ecfdf5;border-radius:50%;line-height:56px;margin-bottom:16px;">
        <span style="font-size:28px;">✨</span>
      </div>
      <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;">
        Your Photos Are Ready!
      </h1>
      <p style="margin:0;font-size:16px;color:#6b7280;">
        Hi ${firstName}, great news!
      </p>
    </div>

    ${successBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size:13px;color:#065f46;">Order</td>
          <td style="text-align:right;font-size:14px;font-weight:600;color:#065f46;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#065f46;padding-top:6px;">Product</td>
          <td style="text-align:right;font-size:14px;font-weight:600;color:#065f46;padding-top:6px;">${productName}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#065f46;padding-top:6px;">Photos</td>
          <td style="text-align:right;font-size:14px;font-weight:600;color:#065f46;padding-top:6px;">${photoCount} images</td>
        </tr>
      </table>
    `)}

    ${button("Download Your Photos", deliveryUrl, SUCCESS_COLOR)}

    <p style="margin:28px 0 16px 0;font-size:15px;font-weight:600;color:#111827;">What you're getting:</p>

    ${checkItem("High-resolution images (300 DPI)")}
    ${checkItem("Professionally retouched")}
    ${checkItem("Web & print-ready formats")}
    ${checkItem("Available for 90 days")}

    ${infoBox(`
      <p style="margin:0;font-size:14px;color:#374151;">
        <strong>Your products are on their way!</strong><br>
        <span style="color:#6b7280;">You'll receive tracking info in a separate email.</span>
      </p>
    `)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Need adjustments? Reply within 7 days for free revisions.
    </p>
  `;

  const text = `
Your Photos Are Ready!

Hi ${firstName}, great news!

Order: ${orderNumber}
Product: ${productName}
Photos: ${photoCount} images

Download your photos: ${deliveryUrl}

What you're getting:
- High-resolution images (300 DPI)
- Professionally retouched
- Web & print-ready formats
- Available for 90 days

Your products are being shipped back to you.

Need adjustments? Reply within 7 days for free revisions.
  `.trim();

  return {
    html: emailWrapper(content, "Your professional product photos are ready!"),
    text,
    subject: `Your Photos Are Ready - ${orderNumber}`,
  };
}

// Contact Form - Customer Confirmation
export function contactConfirmationEmail(params: {
  customerName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { customerName, subject, message } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;text-align:center;">
      We Got Your Message!
    </h1>
    <p style="margin:0 0 28px 0;font-size:16px;color:#6b7280;text-align:center;">
      Hi ${firstName}, thanks for reaching out.
    </p>

    <p style="margin:0 0 24px 0;font-size:15px;color:#374151;text-align:center;">
      Our team will get back to you within <strong>24 hours</strong>.
    </p>

    ${infoBox(`
      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Subject</p>
      <p style="margin:0 0 16px 0;font-size:15px;font-weight:500;color:#111827;">${subject}</p>
      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Your message</p>
      <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;">${message}</p>
    `)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Need urgent help? Call <a href="tel:+19734279393" style="color:${BRAND_COLOR};text-decoration:none;">+1 (973) 427-9393</a>
    </p>
  `;

  const text = `
We Got Your Message!

Hi ${firstName}, thanks for reaching out.

Our team will get back to you within 24 hours.

Subject: ${subject}
Your message:
${message}

Need urgent help? Call +1 (973) 427-9393
  `.trim();

  return {
    html: emailWrapper(content, "Thanks for contacting Rush Photos!"),
    text,
    subject: "We Got Your Message - Rush Photos",
  };
}

// Contact Form - Admin Notification
export function contactNotificationEmail(params: {
  customerName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { customerName, email, phone, subject, message } = params;

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#111827;">
      New Contact Form
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;">
      You have a new message from the website.
    </p>

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Name</td>
          <td style="text-align:right;font-size:14px;font-weight:500;color:#111827;padding-bottom:8px;">${customerName}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Email</td>
          <td style="text-align:right;padding-bottom:8px;">
            <a href="mailto:${email}" style="font-size:14px;font-weight:500;color:${BRAND_COLOR};text-decoration:none;">${email}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="font-size:13px;color:#6b7280;">Phone</td>
          <td style="text-align:right;">
            <a href="tel:${phone}" style="font-size:14px;font-weight:500;color:${BRAND_COLOR};text-decoration:none;">${phone}</a>
          </td>
        </tr>
        ` : ''}
      </table>
    `)}

    ${highlightBox(`
      <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;text-transform:uppercase;">Subject</p>
      <p style="margin:0 0 16px 0;font-size:16px;font-weight:600;color:#111827;">${subject}</p>
      <p style="margin:0 0 4px 0;font-size:12px;color:#6b7280;text-transform:uppercase;">Message</p>
      <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;">${message}</p>
    `)}

    ${button(`Reply to ${customerName.split(' ')[0]}`, `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`)}
  `;

  const text = `
New Contact Form Submission

Name: ${customerName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Subject: ${subject}

Message:
${message}
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
    <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;text-align:center;">
      Shipping Instructions
    </h1>
    <p style="margin:0 0 28px 0;font-size:16px;color:#6b7280;text-align:center;">
      Hi ${firstName}, time to send your products!
    </p>

    ${highlightBox(`
      <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;">Order Number</p>
      <p style="margin:4px 0 0 0;font-size:20px;font-weight:700;color:${BRAND_COLOR};">${orderNumber}</p>
      <p style="margin:6px 0 0 0;font-size:14px;color:#6b7280;">Product: ${productName}</p>
    `)}

    <div style="background:#fef2f2;border:2px dashed ${BRAND_COLOR};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 4px 0;font-size:13px;color:#991b1b;font-weight:600;">SHIP TO:</p>
      <p style="margin:0;font-size:16px;font-weight:600;color:#111827;line-height:1.6;">
        Rush Photo Studio<br>
        Attn: Order ${orderNumber}<br>
        1122 Goffle Rd<br>
        Hawthorne, NJ 07506
      </p>
    </div>

    <p style="margin:28px 0 16px 0;font-size:15px;font-weight:600;color:#111827;">Checklist:</p>

    ${checkItem("<strong>Package securely</strong> - Use bubble wrap")}
    ${checkItem(`<strong>Write order number</strong> - "${orderNumber}" on box`)}
    ${checkItem("<strong>Any carrier works</strong> - FedEx, UPS, USPS")}
    ${checkItem("<strong>Keep tracking number</strong> - For your records")}

    ${successBox(`
      <p style="margin:0;font-size:14px;color:#065f46;">
        <strong>Fully Insured</strong><br>
        Your products are protected from arrival to return.
      </p>
    `)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Questions? <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};text-decoration:none;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Shipping Instructions

Hi ${firstName}, time to send your products!

Order Number: ${orderNumber}
Product: ${productName}

SHIP TO:
Rush Photo Studio
Attn: Order ${orderNumber}
1122 Goffle Rd
Hawthorne, NJ 07506

Checklist:
- Package securely - Use bubble wrap
- Write order number - "${orderNumber}" on box
- Any carrier works - FedEx, UPS, USPS
- Keep tracking number - For your records

Your products are fully insured from arrival to return!

Questions? hello@rush.photos
  `.trim();

  return {
    html: emailWrapper(content, `Shipping instructions for order ${orderNumber}`),
    text,
    subject: `Shipping Instructions - ${orderNumber}`,
  };
}

// Password Reset Email
export function passwordResetEmail(params: {
  customerName: string;
  resetUrl: string;
}) {
  const { customerName, resetUrl } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:700;color:#111827;text-align:center;">
      Reset Your Password
    </h1>
    <p style="margin:0 0 28px 0;font-size:16px;color:#6b7280;text-align:center;">
      Hi ${firstName}, we received your request.
    </p>

    <p style="margin:0 0 24px 0;font-size:15px;color:#374151;text-align:center;">
      Click below to reset your password.<br>
      This link expires in <strong>1 hour</strong>.
    </p>

    ${button("Reset Password", resetUrl)}

    ${infoBox(`
      <p style="margin:0;font-size:14px;color:#6b7280;text-align:center;">
        Didn't request this? You can safely ignore this email.
      </p>
    `)}

    <p style="margin:28px 0 0 0;font-size:14px;color:#9ca3af;text-align:center;">
      Need help? <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};text-decoration:none;">hello@rush.photos</a>
    </p>
  `;

  const text = `
Reset Your Password

Hi ${firstName}, we received your request.

Click the link below to reset your password (expires in 1 hour):
${resetUrl}

Didn't request this? You can safely ignore this email.

Need help? hello@rush.photos
  `.trim();

  return {
    html: emailWrapper(content, "Reset your Rush Photos password"),
    text,
    subject: "Reset Your Password - Rush Photos",
  };
}
