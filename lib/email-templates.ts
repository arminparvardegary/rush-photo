// Rush Photos - Email Templates
// All emails sent from: hello@rush.photos

const BRAND_COLOR = "#E63946";
const BRAND_COLOR_DARK = "#D62839";
const BRAND_COLOR_LIGHT = "#FEF2F2";
const SUCCESS_COLOR = "#10B981";
const WARNING_COLOR = "#F59E0B";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rush.photos";

// SVG Icons (inline for email compatibility)
const ICONS = {
  checkCircle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#10B981"/>
    <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  package: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 9.4L7.5 4.2M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44178 20 6.26501L13 2.26501C12.696 2.08824 12.3511 1.99512 12 1.99512C11.6489 1.99512 11.304 2.08824 11 2.26501L4 6.26501C3.69626 6.44178 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9999C3.44398 17.3045 3.69626 17.5582 4 17.735L11 21.735C11.304 21.9118 11.6489 22.0049 12 22.0049C12.3511 22.0049 12.696 21.9118 13 21.735L20 17.735C20.3037 17.5582 20.556 17.3045 20.7315 16.9999C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.27002 6.95996L12 12.01L20.73 6.95996" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 22.08V12" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  camera: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="${BRAND_COLOR}" stroke-width="2"/>
  </svg>`,
  truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 16V3H1V16H16ZM16 16H23V11L20 8H16V16ZM8 19.5C8 20.8807 6.88071 22 5.5 22C4.11929 22 3 20.8807 3 19.5C3 18.1193 4.11929 17 5.5 17C6.88071 17 8 18.1193 8 19.5ZM21 19.5C21 20.8807 19.8807 22 18.5 22C17.1193 22 16 20.8807 16 19.5C16 18.1193 17.1193 17 18.5 17C19.8807 17 21 18.1193 21 19.5Z" stroke="${SUCCESS_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  download: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="${SUCCESS_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  mail: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  user: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="${SUCCESS_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="${SUCCESS_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="${BRAND_COLOR}" stroke-width="2"/>
    <path d="M12 6V12L16 14" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  star: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>`,
  image: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="${BRAND_COLOR}" stroke-width="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="${BRAND_COLOR}"/>
    <path d="M21 15L16 10L5 21" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  sparkles: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="${BRAND_COLOR_LIGHT}" stroke="${BRAND_COLOR}" stroke-width="2"/>
    <path d="M24 14L26.47 21.53L34 24L26.47 26.47L24 34L21.53 26.47L14 24L21.53 21.53L24 14Z" fill="${BRAND_COLOR}"/>
    <circle cx="32" cy="16" r="2" fill="${BRAND_COLOR}"/>
    <circle cx="16" cy="32" r="1.5" fill="${BRAND_COLOR}"/>
  </svg>`,
  celebration: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="${SUCCESS_COLOR}" fill-opacity="0.1"/>
    <circle cx="32" cy="32" r="20" fill="${SUCCESS_COLOR}" fill-opacity="0.2"/>
    <path d="M26 32L30 36L38 28" stroke="${SUCCESS_COLOR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="16" cy="20" r="3" fill="${WARNING_COLOR}"/>
    <circle cx="48" cy="24" r="2" fill="${BRAND_COLOR}"/>
    <circle cx="44" cy="44" r="2.5" fill="${WARNING_COLOR}"/>
    <circle cx="20" cy="44" r="2" fill="${BRAND_COLOR}"/>
  </svg>`,
};

// Base email wrapper with consistent branding
function emailWrapper(content: string, preheader?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  ${preheader ? `<meta name="x-apple-disable-message-reformatting"><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><title>Rush Photos</title><span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : '<title>Rush Photos</title>'}
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#1f2937;background-color:#f3f4f6;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_COLOR} 0%,${BRAND_COLOR_DARK} 100%);padding:40px 32px;text-align:center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;">
                      <span style="font-size:32px;color:#ffffff;font-weight:900;letter-spacing:-0.5px;">rush</span><span style="font-size:28px;color:#ffffff;font-weight:600;">photos</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <span style="font-size:14px;color:rgba(255,255,255,0.85);font-weight:500;">Professional Product Photography</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:48px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111827;padding:40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <span style="font-size:24px;color:#ffffff;font-weight:900;">rush</span><span style="font-size:20px;color:#ffffff;font-weight:600;">photos</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:0 12px;">
                          <a href="${SITE_URL}" style="color:#9ca3af;font-size:14px;text-decoration:none;">Website</a>
                        </td>
                        <td style="color:#4b5563;">|</td>
                        <td style="padding:0 12px;">
                          <a href="${SITE_URL}/faq" style="color:#9ca3af;font-size:14px;text-decoration:none;">FAQ</a>
                        </td>
                        <td style="color:#4b5563;">|</td>
                        <td style="padding:0 12px;">
                          <a href="mailto:hello@rush.photos" style="color:#9ca3af;font-size:14px;text-decoration:none;">Contact</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="border-top:1px solid #374151;padding-top:24px;">
                    <p style="margin:0 0 8px 0;color:#6b7280;font-size:13px;">Hawthorne, NJ | hello@rush.photos</p>
                    <p style="margin:0;color:#4b5563;font-size:12px;">
                      <a href="${SITE_URL}/privacy" style="color:#6b7280;text-decoration:none;">Privacy</a>
                      <span style="color:#374151;margin:0 8px;">·</span>
                      <a href="${SITE_URL}/terms" style="color:#6b7280;text-decoration:none;">Terms</a>
                    </p>
                    <p style="margin:16px 0 0 0;color:#4b5563;font-size:11px;">&copy; ${new Date().getFullYear()} Rush Studios. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Helper for creating styled boxes
function infoBox(content: string, bgColor = "#f9fafb", borderColor = "#e5e7eb") {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:${bgColor};border:1px solid ${borderColor};border-radius:16px;padding:24px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

function highlightBox(content: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:${BRAND_COLOR_LIGHT};border-left:4px solid ${BRAND_COLOR};border-radius:0 16px 16px 0;padding:24px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

function successBox(content: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="background:#ECFDF5;border-left:4px solid ${SUCCESS_COLOR};border-radius:0 16px 16px 0;padding:24px;">
          ${content}
        </td>
      </tr>
    </table>
  `;
}

function primaryButton(text: string, url: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto;">
      <tr>
        <td align="center" style="background:${BRAND_COLOR};border-radius:12px;">
          <a href="${url}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:12px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function successButton(text: string, url: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto;">
      <tr>
        <td align="center" style="background:${SUCCESS_COLOR};border-radius:12px;">
          <a href="${url}" style="display:inline-block;padding:18px 48px;color:#ffffff;font-size:18px;font-weight:700;text-decoration:none;border-radius:12px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function stepItem(number: string, title: string, description: string, icon?: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;">
      <tr>
        <td width="48" valign="top" style="padding-right:16px;">
          <div style="width:40px;height:40px;background:${BRAND_COLOR};border-radius:12px;text-align:center;line-height:40px;color:#ffffff;font-weight:700;font-size:16px;">
            ${number}
          </div>
        </td>
        <td valign="top">
          <p style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:#111827;">${title}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">${description}</p>
        </td>
      </tr>
    </table>
  `;
}

function iconWithText(icon: string, text: string, color = "#111827") {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td width="32" valign="middle" style="padding-right:12px;">
          ${icon}
        </td>
        <td valign="middle" style="color:${color};font-size:14px;">
          ${text}
        </td>
      </tr>
    </table>
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
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          ${ICONS.sparkles}
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:800;color:#111827;">Welcome to Rush Photos!</h1>
          <p style="margin:0 0 32px 0;font-size:18px;color:#6b7280;">Hi ${firstName}, we're excited to have you join us!</p>
        </td>
      </tr>
    </table>

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="40" valign="top" style="padding-right:16px;">
            ${ICONS.mail}
          </td>
          <td>
            <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Your Account</p>
            <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#111827;">${email}</p>
          </td>
        </tr>
      </table>
    `)}

    <h2 style="margin:40px 0 24px 0;font-size:20px;font-weight:700;color:#111827;">How It Works</h2>

    ${stepItem("1", "Place Your Order", "Choose from E-commerce, Lifestyle, or Full Package photography options")}
    ${stepItem("2", "Ship Your Products", "Send your products to our studio - they're fully insured")}
    ${stepItem("3", "We Work Our Magic", "Professional photography with expert retouching")}
    ${stepItem("4", "Download & Enjoy", "Get your stunning photos in 3-5 business days")}

    ${primaryButton("Start Your First Order", `${SITE_URL}/order`)}

    ${successBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="32" valign="top" style="padding-right:12px;">
            ${ICONS.shield}
          </td>
          <td>
            <p style="margin:0;font-size:15px;font-weight:600;color:#065f46;">100% Satisfaction Guarantee</p>
            <p style="margin:4px 0 0 0;font-size:14px;color:#047857;">Not happy? Get unlimited revisions or your money back.</p>
          </td>
        </tr>
      </table>
    `)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Questions? We're here to help!<br>
            <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">hello@rush.photos</a>
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = `
Welcome to Rush Photos!

Hi ${firstName}, we're excited to have you join us!

Your account: ${email}

How It Works:
1. Place Your Order - Choose from E-commerce, Lifestyle, or Full Package
2. Ship Your Products - Fully insured during transit
3. We Work Our Magic - Professional photography with expert retouching
4. Download & Enjoy - Get your photos in 3-5 business days

Start your first order: ${SITE_URL}/order

100% Satisfaction Guarantee - Not happy? Get unlimited revisions or your money back.

Questions? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Welcome to Rush Photos - Let's create stunning product photos together!"),
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
      <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${item.style}</p>
        <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">${item.angles.length} angle${item.angles.length > 1 ? 's' : ''}: ${item.angles.join(', ')}</p>
      </td>
      <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
        <span style="font-size:15px;font-weight:700;color:#111827;">$${item.price}</span>
      </td>
    </tr>
  `).join('') : '';

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          ${ICONS.celebration}
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:800;color:#111827;">Order Confirmed!</h1>
          <p style="margin:0 0 32px 0;font-size:18px;color:#6b7280;">Thanks for your order, ${firstName}!</p>
        </td>
      </tr>
    </table>

    ${highlightBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Order Number</p>
            <p style="margin:8px 0 0 0;font-size:28px;font-weight:800;color:${BRAND_COLOR};letter-spacing:1px;">${orderNumber}</p>
          </td>
        </tr>
      </table>
    `)}

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom:12px;">
            <span style="font-size:13px;color:#6b7280;">Product</span>
            <span style="float:right;font-size:15px;font-weight:600;color:#111827;">${productName}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-size:13px;color:#6b7280;">Package</span>
            <span style="float:right;font-size:15px;font-weight:600;color:#111827;">${packageLabel}</span>
          </td>
        </tr>
      </table>
    `)}

    ${cartItems.length > 0 ? `
    <h2 style="margin:32px 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Your Selections</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;border-radius:16px;padding:8px 24px;">
      ${itemsHtml}
      <tr>
        <td style="padding:20px 0 8px 0;">
          <span style="font-size:15px;font-weight:600;color:#111827;">Total</span>
        </td>
        <td style="padding:20px 0 8px 0;text-align:right;">
          <span style="font-size:24px;font-weight:800;color:${BRAND_COLOR};">$${total}</span>
        </td>
      </tr>
    </table>
    ` : `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td align="right">
          <span style="font-size:14px;color:#6b7280;">Total:</span>
          <span style="font-size:28px;font-weight:800;color:${BRAND_COLOR};margin-left:12px;">$${total}</span>
        </td>
      </tr>
    </table>
    `}

    <h2 style="margin:48px 0 24px 0;font-size:20px;font-weight:700;color:#111827;">What Happens Next?</h2>

    ${stepItem("1", "Shipping Instructions", "We'll email you detailed shipping instructions within 24 hours")}
    ${stepItem("2", "Ship Your Products", "Send your products to our studio - fully insured")}
    ${stepItem("3", "Photo Shoot", "We'll photograph your products within 2-3 days of receiving them")}
    ${stepItem("4", "Delivery", "Download your photos + we'll ship your products back")}

    ${primaryButton("View Order Status", `${SITE_URL}/dashboard/orders`)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Questions about your order?<br>
            <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">hello@rush.photos</a>
          </p>
        </td>
      </tr>
    </table>
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

What Happens Next?
1. Shipping Instructions - We'll email you within 24 hours
2. Ship Your Products - Fully insured during transit
3. Photo Shoot - Within 2-3 days of receiving your products
4. Delivery - Download your photos + we'll ship your products back

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
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <div style="width:80px;height:80px;background:linear-gradient(135deg,${SUCCESS_COLOR} 0%,#059669 100%);border-radius:50%;display:inline-block;text-align:center;line-height:80px;">
            <span style="font-size:40px;">✨</span>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:800;color:#111827;">Your Photos Are Ready!</h1>
          <p style="margin:0 0 32px 0;font-size:18px;color:#6b7280;">Hi ${firstName}, great news!</p>
        </td>
      </tr>
    </table>

    ${successBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom:12px;">
            <span style="font-size:13px;color:#065f46;">Order</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#065f46;">${orderNumber}</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:12px;">
            <span style="font-size:13px;color:#065f46;">Product</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#065f46;">${productName}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-size:13px;color:#065f46;">Photos Ready</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#065f46;">${photoCount} high-res images</span>
          </td>
        </tr>
      </table>
    `)}

    ${successButton("Download Your Photos", deliveryUrl)}

    ${infoBox(`
      <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#111827;">What You're Getting</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:8px 0;">
            ${iconWithText(ICONS.checkCircle, "High-resolution images (300 DPI, print-ready)", "#047857")}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            ${iconWithText(ICONS.checkCircle, "Professionally retouched and color-corrected", "#047857")}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            ${iconWithText(ICONS.checkCircle, "Optimized for e-commerce, social media, and print", "#047857")}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            ${iconWithText(ICONS.checkCircle, "Multiple formats (JPEG, PNG)", "#047857")}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            ${iconWithText(ICONS.clock, "Files available for 90 days", "#6b7280")}
          </td>
        </tr>
      </table>
    `)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:32px 0;">
      <tr>
        <td width="40" valign="top" style="padding-right:16px;">
          ${ICONS.truck}
        </td>
        <td>
          <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#111827;">Your Products Are On Their Way</h3>
          <p style="margin:0;font-size:14px;color:#6b7280;">We're shipping your products back to you. You'll receive tracking information in a separate email.</p>
        </td>
      </tr>
    </table>

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="40" valign="top" style="padding-right:16px;">
            ${ICONS.star}
          </td>
          <td>
            <p style="margin:0;font-size:15px;font-weight:700;color:#92400e;">Love Your Photos?</p>
            <p style="margin:4px 0 0 0;font-size:14px;color:#b45309;">We'd love to hear your feedback! Need any adjustments? Reply within 7 days for free revisions.</p>
          </td>
        </tr>
      </table>
    `, "#FEF3C7", "#FCD34D")}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Questions? Reply to this email or contact us at<br>
            <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">hello@rush.photos</a>
          </p>
        </td>
      </tr>
    </table>
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
- Multiple formats (JPEG, PNG)
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
    subject: `Your Photos Are Ready - ${orderNumber}`,
  };
}

// Contact Form Submission - To Customer
export function contactConfirmationEmail(params: {
  customerName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { customerName, subject, message } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <div style="width:64px;height:64px;background:${BRAND_COLOR_LIGHT};border-radius:50%;display:inline-block;text-align:center;line-height:64px;">
            ${ICONS.mail}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:800;color:#111827;">We Got Your Message!</h1>
          <p style="margin:0 0 32px 0;font-size:16px;color:#6b7280;">Hi ${firstName}, thanks for reaching out!</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px 0;font-size:16px;color:#4b5563;text-align:center;">
      We've received your message and our team will get back to you within <strong>24 hours</strong>.
    </p>

    ${infoBox(`
      <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Your Message</p>
      <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#111827;">${subject}</p>
      <p style="margin:0;font-size:14px;color:#4b5563;white-space:pre-wrap;line-height:1.6;">${message}</p>
    `)}

    <h3 style="margin:32px 0 16px 0;font-size:16px;font-weight:700;color:#111827;text-align:center;">While You Wait</h3>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td width="50%" style="padding:8px;">
          <a href="${SITE_URL}/faq" style="display:block;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;text-decoration:none;text-align:center;">
            <span style="font-size:14px;font-weight:600;color:#111827;">View FAQ</span>
          </a>
        </td>
        <td width="50%" style="padding:8px;">
          <a href="${SITE_URL}/process" style="display:block;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;text-decoration:none;text-align:center;">
            <span style="font-size:14px;font-weight:600;color:#111827;">How It Works</span>
          </a>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Need urgent help? Call us at<br>
            <a href="tel:+19734279393" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">+1 (973) 427-9393</a>
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = `
We Got Your Message!

Hi ${firstName}, thanks for reaching out!

We've received your message and our team will get back to you within 24 hours.

Your Message:
Subject: ${subject}
${message}

While you wait, check out:
- FAQ: ${SITE_URL}/faq
- How It Works: ${SITE_URL}/process

Need urgent help? Call us at +1 (973) 427-9393

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Thanks for contacting Rush Photos - We'll respond within 24 hours!"),
    text,
    subject: "We Got Your Message - Rush Photos",
  };
}

// Contact Form Submission - To Admin
export function contactNotificationEmail(params: {
  customerName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { customerName, email, phone, subject, message } = params;

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:800;color:#111827;">New Contact Form Submission</h1>
          <p style="margin:0 0 32px 0;font-size:16px;color:#6b7280;">You have a new message from the website.</p>
        </td>
      </tr>
    </table>

    ${infoBox(`
      <h3 style="margin:0 0 20px 0;font-size:16px;font-weight:700;color:#111827;">Contact Details</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:8px 0;">
            <span style="font-size:13px;color:#6b7280;">Name</span><br>
            <span style="font-size:15px;font-weight:600;color:#111827;">${customerName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="font-size:13px;color:#6b7280;">Email</span><br>
            <a href="mailto:${email}" style="font-size:15px;font-weight:600;color:${BRAND_COLOR};text-decoration:none;">${email}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding:8px 0;">
            <span style="font-size:13px;color:#6b7280;">Phone</span><br>
            <a href="tel:${phone}" style="font-size:15px;font-weight:600;color:${BRAND_COLOR};text-decoration:none;">${phone}</a>
          </td>
        </tr>
        ` : ''}
      </table>
    `)}

    ${highlightBox(`
      <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Subject</p>
      <p style="margin:0 0 20px 0;font-size:18px;font-weight:700;color:#111827;">${subject}</p>
      <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <p style="margin:0;font-size:15px;color:#374151;white-space:pre-wrap;line-height:1.6;">${message}</p>
    `)}

    ${primaryButton(`Reply to ${customerName.split(' ')[0]}`, `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`)}
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
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <div style="width:64px;height:64px;background:${BRAND_COLOR_LIGHT};border-radius:50%;display:inline-block;text-align:center;line-height:64px;">
            ${ICONS.package}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:800;color:#111827;">Shipping Instructions</h1>
          <p style="margin:0 0 32px 0;font-size:16px;color:#6b7280;">Hi ${firstName}, it's time to send your products!</p>
        </td>
      </tr>
    </table>

    ${highlightBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Order Number</p>
            <p style="margin:4px 0 0 0;font-size:24px;font-weight:800;color:${BRAND_COLOR};">${orderNumber}</p>
            <p style="margin:8px 0 0 0;font-size:14px;color:#6b7280;">Product: ${productName}</p>
          </td>
        </tr>
      </table>
    `)}

    ${infoBox(`
      <h3 style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#991b1b;">📍 Ship To:</h3>
      <p style="margin:0;font-size:18px;font-weight:600;color:#111827;line-height:1.6;">
        Rush Photo Studio<br>
        Attn: Order ${orderNumber}<br>
        123 Studio Lane<br>
        Hawthorne, NJ 07506
      </p>
    `, "#FEF2F2", "#FECACA")}

    <h2 style="margin:40px 0 24px 0;font-size:20px;font-weight:700;color:#111827;">Shipping Checklist</h2>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding:12px 0;">
          ${iconWithText(ICONS.checkCircle, "<strong>Package securely</strong> - Use bubble wrap or packing paper", "#047857")}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          ${iconWithText(ICONS.checkCircle, `<strong>Include order number</strong> - Write "${orderNumber}" on the box`, "#047857")}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          ${iconWithText(ICONS.checkCircle, "<strong>Use any carrier</strong> - FedEx, UPS, USPS all work", "#047857")}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          ${iconWithText(ICONS.checkCircle, "<strong>Get tracking</strong> - Keep your tracking number handy", "#047857")}
        </td>
      </tr>
    </table>

    ${successBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="40" valign="top" style="padding-right:12px;">
            ${ICONS.shield}
          </td>
          <td>
            <p style="margin:0;font-size:15px;font-weight:700;color:#065f46;">Your Products Are Fully Insured</p>
            <p style="margin:4px 0 0 0;font-size:14px;color:#047857;">From arrival at our studio until they're back in your hands.</p>
          </td>
        </tr>
      </table>
    `)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Questions about shipping?<br>
            <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">hello@rush.photos</a>
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = `
Shipping Instructions

Hi ${firstName}, it's time to send your products!

Order Number: ${orderNumber}
Product: ${productName}

SHIP TO:
Rush Photo Studio
Attn: Order ${orderNumber}
123 Studio Lane
Hawthorne, NJ 07506

Shipping Checklist:
✓ Package securely - Use bubble wrap or packing paper
✓ Include order number - Write "${orderNumber}" on the box
✓ Use any carrier - FedEx, UPS, USPS all work
✓ Get tracking - Keep your tracking number handy

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

// Password Reset Email
export function passwordResetEmail(params: {
  customerName: string;
  resetUrl: string;
}) {
  const { customerName, resetUrl } = params;
  const firstName = customerName?.split(' ')[0] || 'there';

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <div style="width:64px;height:64px;background:${BRAND_COLOR_LIGHT};border-radius:50%;display:inline-block;text-align:center;line-height:64px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="${BRAND_COLOR}" stroke-width="2"/>
              <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="${BRAND_COLOR}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:800;color:#111827;">Reset Your Password</h1>
          <p style="margin:0 0 32px 0;font-size:16px;color:#6b7280;">Hi ${firstName}, we received a password reset request.</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 32px 0;font-size:16px;color:#4b5563;text-align:center;">
      Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.
    </p>

    ${primaryButton("Reset Password", resetUrl)}

    ${infoBox(`
      <p style="margin:0;font-size:14px;color:#6b7280;text-align:center;">
        If you didn't request this, you can safely ignore this email.<br>
        Your password will remain unchanged.
      </p>
    `)}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:32px;">
      <tr>
        <td align="center">
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Need help?<br>
            <a href="mailto:hello@rush.photos" style="color:${BRAND_COLOR};font-weight:600;text-decoration:none;">hello@rush.photos</a>
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = `
Reset Your Password

Hi ${firstName}, we received a password reset request.

Click the link below to reset your password (expires in 1 hour):
${resetUrl}

If you didn't request this, you can safely ignore this email.

Need help? Contact us at hello@rush.photos

© ${new Date().getFullYear()} Rush Studios
  `.trim();

  return {
    html: emailWrapper(content, "Reset your Rush Photos password"),
    text,
    subject: "Reset Your Password - Rush Photos",
  };
}
