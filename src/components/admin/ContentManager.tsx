import { useState } from 'react';
import { cn } from '@/lib/utils';
import { COLLECTIONS } from './contentSchema';
import CollectionEditor from './CollectionEditor';
import { SiteEditor, PricingEditor, CafeEditor, SmtpEditor } from './SettingsEditors';

type SectionId = 'site' | 'pricing' | 'cafe' | 'smtp' | string;

const SETTINGS_SECTIONS = [
  { id: 'site', label: 'Site Info' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'smtp', label: 'Email (SMTP)' },
];

const ContentManager = () => {
  const [section, setSection] = useState<SectionId>('site');

  const navItems = [
    ...SETTINGS_SECTIONS,
    ...COLLECTIONS.map((c) => ({ id: c.name, label: c.label })),
  ];

  const renderEditor = () => {
    if (section === 'site') return <SiteEditor />;
    if (section === 'pricing') return <PricingEditor />;
    if (section === 'cafe') return <CafeEditor />;
    if (section === 'smtp') return <SmtpEditor />;
    const def = COLLECTIONS.find((c) => c.name === section);
    return def ? <CollectionEditor def={def} /> : null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Section nav */}
      <nav className="md:w-52 shrink-0 flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={cn(
              'text-left px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
              section === item.id
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Editor */}
      <div className="flex-1 min-w-0 glass-premium p-5 md:p-6 rounded-2xl border border-border/40">
        {renderEditor()}
      </div>
    </div>
  );
};

export default ContentManager;
