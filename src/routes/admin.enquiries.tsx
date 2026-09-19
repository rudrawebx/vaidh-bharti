import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/enquiries")({ component: AdminEnquiries });

const statuses = ["all", "new", "read", "resolved"] as const;

function AdminEnquiries() {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof statuses)[number]>("all");

  const enquiries = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () =>
      (
        await supabase
          .from("enquiries")
          .select("id,name,phone,email,enquiry_type,subject,message,status,created_at")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) toast.error("Could not update the enquiry.");
    else toast.success(`Marked as ${status}.`);
    void enquiries.refetch();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) toast.error("Could not delete the enquiry.");
    else toast.success("Enquiry deleted.");
    void enquiries.refetch();
  };

  const rows = (enquiries.data ?? []).filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (!q.trim()) return true;
    const t = q.trim().toLowerCase();
    return [r.name, r.phone, r.email, r.subject, r.message, r.enquiry_type]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(t));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, email or message"
          className="h-11 min-w-[240px] flex-1 rounded-sm border border-input bg-background px-4 text-sm"
        />
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-sm border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]",
                filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-primary",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {rows.length ? (
          rows.map((r) => (
            <li key={r.id} className="border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-xl">{r.name}</p>
                <span className="text-[11px] uppercase tracking-[0.16em] text-gold">{r.status}</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {r.enquiry_type} · {new Date(r.created_at).toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-primary">
                <a href={`tel:${r.phone}`} className="hover:text-gold">
                  {r.phone}
                </a>
                {r.email ? (
                  <>
                    {" · "}
                    <a href={`mailto:${r.email}`} className="hover:text-gold">
                      {r.email}
                    </a>
                  </>
                ) : null}
              </p>
              {r.subject ? <p className="mt-3 text-sm text-foreground">{r.subject}</p> : null}
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.14em]">
                <button type="button" className="text-primary hover:text-gold" onClick={() => setStatus(r.id, "read")}>
                  Mark as read
                </button>
                <button type="button" className="text-gold" onClick={() => setStatus(r.id, "resolved")}>
                  Mark as resolved
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => void remove(r.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">No enquiries found.</li>
        )}
      </ul>
    </div>
  );
}
