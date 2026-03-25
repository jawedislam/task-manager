import { prisma } from "./prisma";
import { sendTaskReminder } from "./email";

export async function checkAndSendReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueTasks = await prisma.task.findMany({
    where: {
      dueDate: { gte: today, lt: tomorrow },
      status: { not: "COMPLETED" },
      reminderSent: false,
    },
    include: { manager: true },
  });

  console.log(`[CRON] Found ${dueTasks.length} tasks due today`);

  let sent = 0;
  let failed = 0;

  for (const task of dueTasks) {
    try {
      await sendTaskReminder({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        managerName: task.manager?.name ?? null,
        priority: task.priority,
      });
      await prisma.task.update({
        where: { id: task.id },
        data: { reminderSent: true },
      });
      sent++;
      console.log(`[CRON] Reminder sent for task: ${task.title}`);
    } catch (err) {
      failed++;
      console.error(`[CRON] Failed to send reminder for task ${task.id}:`, err);
    }
  }

  return { sent, failed };
}
