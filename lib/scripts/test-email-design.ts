import { sendContactEmail } from "../email";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testEmail() {
    console.log("Sending test email...");
    try {
        await sendContactEmail({
            name: "Test User",
            email: process.env.ADMIN_EMAIL || "test@example.com",
            subject: "Test Email Design",
            message: "This is a test message to verify the new email template design with the pink brand color and logo.",
        });
        console.log("Test email sent successfully!");
    } catch (error) {
        console.error("Failed to send test email:", error);
    }
}

testEmail();
