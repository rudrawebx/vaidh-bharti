import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

function AdminBookings() {
  const bookings = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () =>
      (
        await supabase
          .from("bookings")
          .select(
            "id,reference,consultation_type,booking_date,slot_time,status,customer_name,phone,email,message,payment_status,amount",
          )
          .order("booking_date", { ascending: false })
      ).data ?? [],
  });

  return (
    <ul className="space-y-4">
      {bookings.data?.length ? (
        bookings.data.map((b) => (
          <li key={b.id} className="flex flex-wrap items-start justify-between gap-4 border border-border p-6">
            <div>
              <p className="font-display text-xl">{b.customer_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(`${b.booking_date}T00:00:00`).toLocaleDateString("en-IN")} at {b.slot_time} · {b.consultation_type}
              </p>
              <p className="text-sm text-muted-foreground">
                {b.phone}
                {b.email ? ` · ${b.email}` : ""} · {b.reference}
              </p>
              <p className="mt-1 text-sm">
                <span className={b.payment_status === "paid" ? "text-gold" : "text-muted-foreground"}>
                  {b.payment_status === "paid" ? `Paid ₹${Number(b.amount)}` : `Payment ${b.payment_status}`}
                </span>
              </p>
              {b.message ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{b.message}</p> : null}
            </div>
            <select
              aria-label={`Status for ${b.reference}`}
              value={b.status}
              onChange={async (e) => {
                const { error } = await supabase.from("bookings").update({ status: e.target.value }).eq("id", b.id);
                if (error) toast.error("Could not update the booking.");
                else toast.success("Booking updated.");
                void bookings.refetch();
              }}
              className="h-11 rounded-sm border border-input bg-card px-3 text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))
      ) : (
        <li className="text-sm text-muted-foreground">No bookings yet.</li>
      )}
    </ul>
  );
}
