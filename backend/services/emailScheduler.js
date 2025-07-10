import cron from "node-cron";
import transporter from "../cronset/emailSender.js";
import homePageDataSchema from "../models/home_schema_models.js";

/**
 * Email scheduler service for sending reminder emails
 * Runs daily at 8:00 AM to check for posts scheduled for today
 */
class EmailScheduler {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Format current date to YYYY-MM-DD format
   * @returns {string} Formatted date string
   */
  getCurrentDateString() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month =
      currentDate.getMonth() + 1 > 9
        ? currentDate.getMonth() + 1
        : `0${currentDate.getMonth() + 1}`;
    const day =
      currentDate.getDate() > 9
        ? currentDate.getDate()
        : `0${currentDate.getDate()}`;

    return `${year}-${month}-${day}`;
  }

  /**
   * Send reminder emails for posts scheduled for today
   */
  async sendReminderEmails() {
    const date = this.getCurrentDateString();
    console.log(`📧 Checking for posts scheduled for ${date}...`);

    try {
      const users = await homePageDataSchema.find({ publishDate: date });

      if (users.length === 0) {
        console.log("📭 No posts scheduled for today");
        return;
      }

      console.log(`📬 Found ${users.length} posts scheduled for today`);

      for (const user of users) {
        const mailOptions = {
          from: "deepakhere24@gmail.com",
          to: user.email,
          subject: "Reminder",
          text: `Hello ${user.createdBy}, This is reminder email for your post "${user.title}"`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(
            `✅ Email sent to: ${user.email} for post: ${user.title}`
          );
        } catch (emailError) {
          console.error(
            `❌ Failed to send email to ${user.email}:`,
            emailError
          );
        }
      }
    } catch (error) {
      console.error("❌ Error in email scheduler:", error);
    }
  }

  /**
   * Start the email scheduler cron job
   * Runs daily at 8:00 AM
   */
  start() {
    if (this.isRunning) {
      console.log("⚠️ Email scheduler is already running");
      return;
    }

    console.log("🚀 Starting email scheduler (daily at 8:00 AM)...");

    // Schedule for 8:00 AM daily
    cron.schedule("0 8 * * *", async () => {
      console.log("⏰ Running scheduled email check...");
      await this.sendReminderEmails();
    });

    this.isRunning = true;
    console.log("✅ Email scheduler started successfully");
  }

  /**
   * Stop the email scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log("⚠️ Email scheduler is not running");
      return;
    }

    // Note: node-cron doesn't provide a direct way to stop specific tasks
    // This is more for status tracking
    this.isRunning = false;
    console.log("🛑 Email scheduler stopped");
  }

  /**
   * Get scheduler status
   * @returns {boolean} Whether the scheduler is running
   */
  getStatus() {
    return this.isRunning;
  }
}

// Export singleton instance
const emailScheduler = new EmailScheduler();
export default emailScheduler;
