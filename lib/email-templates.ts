export function orderConfirmationEmail(params: {
    customerName: string;
    orderNumber: string;
    productName: string;
    packageType: string;
    total: number;
    cartItems: Array<{ style: string; angles: string[]; price: number }>;
}) {
    const { customerName, orderNumber, productName, packageType, total, cartItems } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E63946 0%, #D62839 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { background: white; padding: 30px; border: 1px solid #eee; }
    .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .item { border-bottom: 1px solid #eee; padding: 15px 0; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 24px; font-weight: bold; color: #E63946; margin-top: 20px; text-align: right; }
    .button { display: inline-block; background: #E63946; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Rush Photo</div>
      <p style="margin: 0; font-size: 18px;">Order Confirmation</p>
    </div>
    
    <div class="content">
      <h2>Thanks${customerName ? `, ${customerName}` : ''}!</h2>
      <p>We've received your order and we're excited to create amazing photos for you.</p>
      
      <div class="order-details">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Package:</strong> ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}</p>
      </div>

      ${cartItems.length > 0 ? `
      <h3>Your Selections:</h3>
      ${cartItems.map(item => `
        <div class="item">
          <strong>${item.style}</strong><br>
          <span style="color: #666;">Angles: ${item.angles.join(', ')}</span>
          <span style="float: right;">$${item.price}</span>
        </div>
      `).join('')}
      ` : ''}

      <div class="total">
        Total: $${total}
      </div>

      <h3>What's Next?</h3>
      <ol>
        <li><strong>Ship Your Product</strong> - We'll send you shipping instructions within 24 hours</li>
        <li><strong>We Shoot</strong> - Professional photography within 2-3 days of receiving your product</li>
        <li><strong>Editing & Retouching</strong> - Expert post-production for magazine-quality results</li>
        <li><strong>Delivery</strong> - Download your high-resolution photos and get your product back</li>
      </ol>

      <center>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/order/${orderNumber}" class="button">Track Your Order</a>
      </center>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <strong>Questions?</strong> Reply to this email or contact us at 
        <a href="mailto:hello@rush.photos">hello@rush.photos</a>
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; 2026 Rush Photo. All rights reserved.</p>
      <p>Professional Product Photography</p>
    </div>
  </div>
</body>
</html>
  `;

    const text = `
RUSH PHOTO - Order Confirmation

Thanks${customerName ? `, ${customerName}` : ''}!

We've received your order and we're excited to create amazing photos for you.

Order Details:
- Order Number: ${orderNumber}
- Product: ${productName}
- Package: ${packageType}
- Total: $${total}

${cartItems.length > 0 ? `
Your Selections:
${cartItems.map(item => `- ${item.style} (${item.angles.join(', ')}): $${item.price}`).join('\n')}
` : ''}

What's Next?
1. Ship Your Product - We'll send you shipping instructions within 24 hours
2. We Shoot - Professional photography within 2-3 days of receiving your product  
3. Editing & Retouching - Expert post-production for magazine-quality results
4. Delivery - Download your high-resolution photos and get your product back

Track your order: ${process.env.NEXT_PUBLIC_SITE_URL}/order/${orderNumber}

Questions? Contact us at hello@rush.photos

© 2026 Rush Photo - Professional Product Photography
  `.trim();

    return { html, text, subject: `Order Confirmed - ${orderNumber}` };
}

export function deliveryNotificationEmail(params: {
    customerName: string;
    orderNumber: string;
    productName: string;
    deliveryUrl: string;
    photoCount: number;
}) {
    const { customerName, orderNumber, productName, deliveryUrl, photoCount } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #34C759 0%, #28A745 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { background: white; padding: 30px; border: 1px solid #eee; }
    .highlight-box { background: #f0f9ff; border-left: 4px solid #3B82F6; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #34C759; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-size: 18px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎉 Rush Photo</div>
      <p style="margin: 0; font-size: 20px;">Your Photos Are Ready!</p>
    </div>
    
    <div class="content">
      <h2>Hi${customerName ? ` ${customerName}` : ''}!</h2>
      <p style="font-size: 18px;">Great news! Your professional product photos are ready for download.</p>
      
      <div class="highlight-box">
        <p style="margin: 0;"><strong>Order:</strong> ${orderNumber}</p>
        <p style="margin: 10px 0 0 0;"><strong>Product:</strong> ${productName}</p>
        <p style="margin: 10px 0 0 0;"><strong>Photos:</strong> ${photoCount} high-resolution images</p>
      </div>

      <center>
        <a href="${deliveryUrl}" class="button">Download Your Photos</a>
      </center>

      <h3>What You're Getting:</h3>
      <ul>
        <li>High-resolution images (300 DPI)</li>
        <li>Professionally retouched and color-corrected</li>
        <li>Ready for e-commerce, social media, or print</li>
        <li>Files available for 90 days</li>
      </ul>

      <h3>Next Steps:</h3>
      <ol>
        <li>Download your photos from the link above</li>
        <li>Your product is being shipped back to you</li>
        <li>Use your photos across all your marketing channels</li>
      </ol>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <strong>Love your photos?</strong> We'd appreciate a review!<br>
        <strong>Need adjustments?</strong> Reply to this email within 7 days for free revisions.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; 2026 Rush Photo. All rights reserved.</p>
      <p>Professional Product Photography</p>
    </div>
  </div>
</body>
</html>
  `;

    const text = `
RUSH PHOTO - Your Photos Are Ready!

Hi${customerName ? ` ${customerName}` : ''}!

Great news! Your professional product photos are ready for download.

Order Details:
- Order Number: ${orderNumber}
- Product: ${productName}
- Photos: ${photoCount} high-resolution images

Download your photos: ${deliveryUrl}

What You're Getting:
- High-resolution images (300 DPI)
- Professionally retouched and color-corrected
- Ready for e-commerce, social media, or print
- Files available for 90 days

Next Steps:
1. Download your photos from the link above
2. Your product is being shipped back to you
3. Use your photos across all your marketing channels

Love your photos? We'd appreciate a review!
Need adjustments? Reply to this email within 7 days for free revisions.

© 2026 Rush Photo - Professional Product Photography
  `.trim();

    return { html, text, subject: `📸 Your Photos Are Ready - ${orderNumber}` };
}
