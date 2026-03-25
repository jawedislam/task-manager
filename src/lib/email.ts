import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface TaskReminderData {
  title: string;
  description: string | null;
  dueDate: Date;
  managerName: string | null;
  priority: string;
}

export async function sendTaskReminder(task: TaskReminderData) {
  const priorityLabel = task.priority.charAt(0) + task.priority.slice(1).toLowerCase();
  const managerLine = task.managerName
    ? `Assigned to: ${task.managerName}`
    : "No manager assigned";

  const { data, error } = await getResend().emails.send({
    from: "Task Manager <onboarding@resend.dev>",
    to: [process.env.REMINDER_EMAIL!],
    subject: `[${priorityLabel}] Task Due Today: ${task.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Task Reminder</h2>
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
          ${task.description ? `<p style="color: #4b5563;">${task.description}</p>` : ""}
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;">Due Date:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: 600;">${task.dueDate.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Priority:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: 600;">${priorityLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Manager:</td>
              <td style="padding: 8px 0; color: #111827;">${managerLine}</td>
            </tr>
          </table>
        </div>
        <p style="color: #9ca3af; font-size: 12px;">This is an automated reminder from Task Manager.</p>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}
