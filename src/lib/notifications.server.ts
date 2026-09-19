export async function sendClinicEmailNotification({
  subject,
  body,
}: {
  subject: string;
  body: string;
}) {
  const recipientEmails = [
    process.env["ADMIN_EMAIL"] || "vaidbharti80@gmail.com",
    "rudrawebx@gmail.com",
  ];

  console.log(`[Clinic Notification] To: ${recipientEmails.join(", ")}\nSubject: ${subject}\n${body}`);

  const resendKey = process.env["RESEND_API_KEY"];
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Vaidh Bharti Clinic <onboarding@resend.dev>",
          to: recipientEmails,
          subject,
          text: body,
        }),
      });
    } catch (err) {
      console.error("[Clinic Notification] Resend email dispatch failed:", err);
    }
  }
}
