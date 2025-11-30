export function generateEmailTemplate(content: string) {
    const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/owners-logo/Joannas%20Reborns%20Logo.jpg`;
    const primaryColor = "#f08ba8";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Joanna's Reborns</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background-color: #ffffff;
          border-bottom: 3px solid ${primaryColor};
        }
        .logo {
          width: 120px;
          height: auto;
          border-radius: 50%;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
          line-height: 1.6;
          font-size: 16px;
        }
        h1, h2, h3 {
          color: #1a1a1a;
          margin-top: 0;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        a {
          color: ${primaryColor};
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #888888;
        }
        .button {
          display: inline-block;
          background-color: ${primaryColor};
          color: #ffffff !important;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            border-radius: 0;
          }
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px 0;">
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Joanna's Reborns" class="logo">
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Joanna's Reborns. All rights reserved.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}">Visit Website</a> | 
              <a href="mailto:info@joannasreborns.com">Contact Us</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
