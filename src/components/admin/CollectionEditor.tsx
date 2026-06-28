import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { listContentDocs, upsertContentDoc, deleteContentDoc, type ContentRow } from '@/lib/contentAdmin';
import PremiumButton from '@/components/ui/PremiumButton';
import ImageField from './ImageField';
import type { CollectionDef, FieldDef } from './contentSchema';

const blankForm = (def: CollectionDef): Record<string, unknown> => {
  const f: Record<string, unknown> = {};
  def.fields.forEach((field) => {
    f[field.key] = field.type === 'number' ? 0 : '';
  });
  return f;
};

const CollectionEditor = ({ def }: { def: CollectionDef }) => {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-content', def.name],
    queryFn: () => listContentDocs(def.name),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const open = isNew || editingId !== null;

  const startEdit = (row: ContentRow) => {
    setEditingId(row.id);
    setIsNew(false);
    setForm({ ...row });
  };
  const startNew = () => {
    setEditingId(null);
    setIsNew(true);
    setForm(blankForm(def));
  };
  const close = () => {
    setEditingId(null);
    setIsNew(false);
    setForm({});
  };

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['admin-content', def.name] });
    qc.invalidateQueries({ queryKey: [def.name] }); // public site query
  };

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...rest } = form as { id?: string };
      await upsertContentDoc(def.name, editingId, { ...def.defaults, ...rest });
      toast.success('Saved');
      refresh();
      close();
    } catch (err) {
      toast.error('Save failed — check your admin access.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: ContentRow) => {
    if (!window.confirm(`Delete "${String(row[def.titleField] ?? row.id)}"? This cannot be undone.`)) return;
    try {
      await deleteContentDoc(def.name, row.id);
      toast.success('Deleted');
      refresh();
    } catch {
      toast.error('Delete failed.');
    }
  };

  const setField = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const renderField = (field: FieldDef) => {
    const value = form[field.key];
    if (field.type === 'image') {
      return (
        <ImageField
          key={field.key}
          label={field.label}
          value={(value as string) ?? ''}
          kind={field.imageKind}
          onChange={(uri) => setField(field.key, uri)}
        />
      );
    }
    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{field.label}</label>
          <textarea
            rows={4}
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors resize-y"
            value={(value as string) ?? ''}
            onChange={(e) => setField(field.key, e.target.value)}
          />
        </div>
      );
    }
    return (
      <div key={field.key} className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{field.label}</label>
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors"
          value={(value as string | number) ?? ''}
          onChange={(e) => setField(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
        />
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading…
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{def.label} <span className="text-muted-foreground text-sm">({rows.length})</span></h3>
        {def.allowAddDelete && (
          <PremiumButton onClick={startNew} className="h-10 px-4 text-sm">
            <Plus className="w-4 h-4 mr-1" /> Add
          </PremiumButton>
        )}
      </div>

      {/* List */}
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-4 p-3 rounded-2xl border border-border/40 bg-card/30">
            {def.imageField && (
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/20 shrink-0">
                {row[def.imageField] ? (
                  <img src={row[def.imageField] as string} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{String(row[def.titleField] ?? row.id)}</p>
              <p className="text-[11px] text-muted-foreground">order: {String(row.order ?? '—')} · id: {row.id}</p>
            </div>
            <button onClick={() => startEdit(row)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            {def.allowAddDelete && (
              <button onClick={() => remove(row)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Editor modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={close}>
          <div
            className="glass-premium w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-border/40 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">{isNew ? `New ${def.label}` : `Edit ${def.label}`}</h4>
              <button onClick={close} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            {def.fields.map(renderField)}
            <div className="flex gap-3 pt-2">
              <PremiumButton onClick={save} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
              </PremiumButton>
              <PremiumButton variant="secondary" onClick={close} disabled={saving}>
                Cancel
              </PremiumButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionEditor;
