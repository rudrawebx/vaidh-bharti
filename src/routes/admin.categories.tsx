import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

type Draft = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
};

const empty: Draft = { slug: "", name: "", description: "", image_url: "", sort_order: "0", is_active: true };

function AdminCategories() {
  const categories = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("*").order("sort_order")).data ?? [],
  });

  const [draft, setDraft] = React.useState<Draft>(empty);
  const [saving, setSaving] = React.useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: draft.slug.trim() || draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      image_url: draft.image_url.trim() || null,
      sort_order: Number(draft.sort_order) || 0,
      is_active: draft.is_active,
    };
    const { error } = draft.id
      ? await supabase.from("categories").update(payload).eq("id", draft.id)
      : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Category updated" : "Category added");
    setDraft(empty);
    categories.refetch();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-display text-2xl">{draft.id ? "Edit category" : "Add category"}</h2>
        {[
          { k: "name" as const, label: "Name" },
          { k: "slug" as const, label: "URL slug (optional)" },
          { k: "image_url" as const, label: "Image URL" },
          { k: "sort_order" as const, label: "Sort order" },
        ].map((f) => (
          <label key={f.k} className="block text-sm">
            <span className="mb-1 block text-muted-foreground">{f.label}</span>
            <input
              value={draft[f.k]}
              onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}
              required={f.k === "name"}
              className="w-full rounded-sm border border-border bg-background px-3 py-2"
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="mb-1 block text-muted-foreground">Description</span>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="w-full rounded-sm border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Visible on the website
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : draft.id ? "Save changes" : "Add category"}
          </button>
          {draft.id ? (
            <button
              type="button"
              onClick={() => setDraft(empty)}
              className="rounded-sm border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="border border-border bg-card">
        <h2 className="border-b border-border p-6 font-display text-2xl">Categories</h2>
        <ul>
          {(categories.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  /{c.slug} · {c.is_active ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: c.id,
                      slug: c.slug,
                      name: c.name,
                      description: c.description ?? "",
                      image_url: c.image_url ?? "",
                      sort_order: String(c.sort_order),
                      is_active: c.is_active,
                    })
                  }
                  className="rounded-sm border border-border px-3 py-2 text-[11px] uppercase tracking-[0.12em]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await supabase
                      .from("categories")
                      .update({ is_active: !c.is_active })
                      .eq("id", c.id);
                    if (error) toast.error(error.message);
                    else categories.refetch();
                  }}
                  className="rounded-sm border border-border px-3 py-2 text-[11px] uppercase tracking-[0.12em]"
                >
                  {c.is_active ? "Hide" : "Show"}
                </button>
              </div>
            </li>
          ))}
          {categories.data?.length === 0 ? (
            <li className="p-6 text-sm text-muted-foreground">No categories yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
