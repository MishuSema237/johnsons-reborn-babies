import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./email-template";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailParams) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Joanna\'s Reborns'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            attachments: attachments || [
                {
                    filename: 'logo.jpg',
                    path: process.cwd() + '/public/assets/owners-logo/Joannas Reborns Logo.jpg',
                    cid: 'logo'
                }
            ]
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

export async function sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    // Email to Admin
    const adminContent = `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `;

    await sendEmail({
        to: adminEmail as string,
        subject: `New Contact Message: ${data.subject}`,
        html: generateEmailTemplate(adminContent),
    });

    // Auto-reply to User
    const userContent = `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${data.name},</p>
      <p>We have received your message regarding "${data.subject}". We will get back to you as soon as possible.</p>
      <br>
      <p>Best regards,</p>
      <p>Joanna's Reborns Team</p>
    `;

    await sendEmail({
        to: data.email,
        subject: "We received your message - Joanna's Reborns",
        html: generateEmailTemplate(userContent),
    });
}

export async function sendOrderConfirmationEmail(order: any) {
    // Email to Customer
    const customerContent = `
      <h1>Order Confirmed!</h1>
      <p>Hi ${order.customer.name},</p>
      <p>Thank you for your order. Your order reference is <strong>${order.orderReference}</strong>.</p>
      <p>We will review your order and send you payment details shortly.</p>
      <h3>Order Summary:</h3>
      <ul>
        ${order.items.map((item: any) => `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
      </ul>
      <p><strong>Total: $${order.payment.totalAmount.toFixed(2)}</strong></p>
      <br>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order._id}" class="button">View Order Details</a>
      <br><br>
      <p>Best regards,</p>
      <p>Joanna's Reborns Team</p>
    `;

    await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmation - ${order.orderReference}`,
        html: generateEmailTemplate(customerContent),
    });
}

export async function sendOrderNotificationToAdmin(order: any) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    const adminContent = `
      <h2>New Order Received</h2>
      <p><strong>Reference:</strong> ${order.orderReference}</p>
      <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.email})</p>
      <p><strong>Total:</strong> $${order.payment.totalAmount.toFixed(2)}</p>
      <br>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order._id}" class="button">View Order in Admin</a>
    `;

    await sendEmail({
        to: adminEmail as string,
        subject: `New Order Received - ${order.orderReference}`,
        html: generateEmailTemplate(adminContent),
    });
}

export async function sendOrderUpdateEmail(to: string, subject: string, message: string, attachments?: any[]) {
    const updateContent = `
      <div style="font-family: sans-serif; color: #333;">
        ${message.replace(/\n/g, "<br>")}
        <br><br>
        <hr>
        <p style="font-size: 12px; color: #888;">Joanna's Reborns</p>
      </div>
    `;

    await sendEmail({
        to,
        subject,
        html: generateEmailTemplate(updateContent),
        attachments: [
            {
                filename: 'logo.jpg',
                path: process.cwd() + '/public/assets/owners-logo/Joannas Reborns Logo.jpg',
                cid: 'logo'
            },
            ...(attachments || [])
        ]
    });
}
