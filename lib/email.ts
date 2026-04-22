// Email notification service
// This is a placeholder implementation that logs emails instead of sending them
// In production, you would integrate with a service like Resend, SendGrid, or AWS SES

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailData): Promise<void> {
  // Log the email for now (replace with actual email service)
  console.log('=== EMAIL NOTIFICATION ===')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('HTML:', html)
  console.log('Text:', text)
  console.log('========================')
  
  // TODO: Implement actual email sending
  // Example with Resend:
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to,
  //   subject,
  //   html,
  // })
}

export function generateComplaintSubmissionEmail(complaintId: string, title: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Complaint Submitted Successfully</h2>
      <p>Thank you for your civic complaint submission. Your complaint has been registered and will be processed by the relevant authorities.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Complaint Details:</h3>
        <p><strong>Complaint ID:</strong> ${complaintId}</p>
        <p><strong>Subject:</strong> ${title}</p>
        <p><strong>Status:</strong> Pending</p>
      </div>
      
      <p>You will receive notifications when the status of your complaint changes.</p>
      <p>You can track your complaint by logging into your dashboard.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `
}

export function generateComplaintStatusUpdateEmail(complaintId: string, title: string, newStatus: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Complaint Status Update</h2>
      <p>There has been an update to your complaint submission.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Complaint Details:</h3>
        <p><strong>Complaint ID:</strong> ${complaintId}</p>
        <p><strong>Subject:</strong> ${title}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
      </div>
      
      <p>You can track your complaint by logging into your dashboard for more details.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `
}
