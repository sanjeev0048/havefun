import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';
import { Loader2, LogOut, ShieldAlert, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { isAdminEmail } from '@/lib/admin';
import {
  listBookings,
  listContactMessages,
  listWaivers,
  type WithMeta,
} from '@/lib/submissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PremiumButton from '@/components/ui/PremiumButton';
import ContentManager from '@/components/admin/ContentManager';
import { cn } from '@/lib/utils';

const fmtDate = (ts: WithMeta['createdAt']): string => {
  if (!ts) return '—';
  // Firestore Timestamp instance or plain {seconds}
  const anyTs = ts as unknown as { toDate?: () => Date; seconds?: number };
  const ms =
    typeof anyTs.toDate === 'function'
      ? anyTs.toDate().getTime()
      : (anyTs.seconds ?? 0) * 1000;
  return new Date(ms).toLocaleString();
};

function LoginForm({ error }: { error: string | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setLocalError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-premium w-full max-w-sm p-8 rounded-3xl border border-border/40 space-y-6"
      >
        <div className="text-center space-y-2">
          <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">HavFun Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to view submissions</p>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {(localError || error) && (
          <p className="text-sm text-destructive text-center">{localError || error}</p>
        )}
        <PremiumButton type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </PremiumButton>
      </form>
    </div>
  );
}

function NotAuthorized({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
      <div className="space-y-4 max-w-sm">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground">{email}</span> is not an admin account.
        </p>
        <PremiumButton variant="secondary" onClick={() => signOut(auth)}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </PremiumButton>
      </div>
    </div>
  );
}

function Section<T>({
  queryKey,
  queryFn,
  columns,
  empty,
}: {
  queryKey: string;
  queryFn: () => Promise<T[]>;
  columns: { header: string; cell: (row: T) => React.ReactNode }[];
  empty: string;
}) {
  const { data, isLoading, error } = useQuery({ queryKey: [queryKey], queryFn });

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading…
      </div>
    );
  if (error)
    return <p className="text-destructive py-10 text-center text-sm">Failed to load. Check your access.</p>;
  if (!data || data.length === 0)
    return <p className="text-muted-foreground py-10 text-center text-sm">{empty}</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/40">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.header}>{c.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((c) => (
                <TableCell key={c.header}>{c.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'submissions' | 'content'>('submissions');

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setLoading(false);
  }), []);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  if (!user) return <LoginForm error={null} />;
  if (!isAdminEmail(user.email)) return <NotAuthorized email={user.email ?? ''} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <div>
            <h1 className="font-bold leading-tight">HavFun Admin</h1>
            <p className="text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <PremiumButton variant="secondary" onClick={() => signOut(auth)}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </PremiumButton>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Top-level view switch */}
        <div className="inline-flex p-1 rounded-2xl border border-border/40 bg-card/30">
          {(['submissions', 'content'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-5 py-2 rounded-xl text-sm font-medium capitalize transition-colors',
                view === v ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {v === 'content' ? 'Site Content' : 'Submissions'}
            </button>
          ))}
        </div>

        {view === 'content' ? (
          <ContentManager />
        ) : (
          <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="waivers">Waivers</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Section
              queryKey="admin-bookings"
              queryFn={listBookings}
              empty="No bookings yet."
              columns={[
                { header: 'Booking ID', cell: (r) => <span className="font-mono text-primary">{r.bookingId}</span> },
                { header: 'Date', cell: (r) => r.date },
                { header: 'Time', cell: (r) => r.time },
                { header: 'Duration', cell: (r) => `${r.duration} min` },
                { header: 'Submitted', cell: (r) => fmtDate(r.createdAt) },
              ]}
            />
          </TabsContent>

          <TabsContent value="waivers">
            <Section
              queryKey="admin-waivers"
              queryFn={listWaivers}
              empty="No waivers yet."
              columns={[
                { header: 'Name', cell: (r) => r.name },
                { header: 'Email', cell: (r) => r.email },
                { header: 'Phone', cell: (r) => r.phone },
                { header: 'Participants', cell: (r) => r.participants?.map((p) => p.name).join(', ') },
                { header: 'Visit', cell: (r) => `${r.visitDate?.slice(0, 10)} ${r.visitTime}` },
                { header: 'Total', cell: (r) => `₹${r.pricing?.total?.toFixed(0) ?? '—'}` },
                {
                  header: 'Signature',
                  cell: (r) =>
                    r.signature ? (
                      <img src={r.signature} alt="signature" className="h-10 bg-white/5 rounded" />
                    ) : (
                      '—'
                    ),
                },
                { header: 'Submitted', cell: (r) => fmtDate(r.createdAt) },
              ]}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <Section
              queryKey="admin-contacts"
              queryFn={listContactMessages}
              empty="No messages yet."
              columns={[
                { header: 'Name', cell: (r) => r.name },
                { header: 'Email', cell: (r) => r.email },
                { header: 'Phone', cell: (r) => r.phone || '—' },
                { header: 'Message', cell: (r) => <span className="max-w-xs block whitespace-pre-wrap">{r.message}</span> },
                { header: 'Submitted', cell: (r) => fmtDate(r.createdAt) },
              ]}
            />
          </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Admin;
