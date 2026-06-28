/** Schema describing each editable content collection for the generic CMS editor. */

export type FieldType = 'text' | 'textarea' | 'number' | 'image';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  imageKind?: 'photo' | 'icon';
}

export interface CollectionDef {
  name: string; // Firestore collection name (also the TanStack query key)
  label: string;
  fields: FieldDef[];
  allowAddDelete: boolean;
  /** Field used as the row title in the list view. */
  titleField: string;
  /** Field holding the row's image, if any (for list thumbnails). */
  imageField?: string;
  /** Values merged into every saved doc (e.g. gallery.type). */
  defaults?: Record<string, unknown>;
}

export const COLLECTIONS: CollectionDef[] = [
  {
    name: 'attractions',
    label: 'Attractions',
    titleField: 'title',
    imageField: 'image',
    allowAddDelete: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'image', label: 'Image', type: 'image', imageKind: 'photo' },
    ],
  },
  {
    name: 'safetyFeatures',
    label: 'Safety Features',
    titleField: 'title',
    imageField: 'icon',
    allowAddDelete: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'icon', label: 'Icon', type: 'image', imageKind: 'icon' },
    ],
  },
  {
    name: 'faqs',
    label: 'FAQs',
    titleField: 'question',
    allowAddDelete: true,
    fields: [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    name: 'gallery',
    label: 'Gallery',
    titleField: 'title',
    imageField: 'image',
    allowAddDelete: true,
    defaults: { type: 'image' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'image', label: 'Image', type: 'image', imageKind: 'photo' },
    ],
  },
  {
    name: 'cafeImages',
    label: 'Cafe Images',
    titleField: 'alt',
    imageField: 'image',
    allowAddDelete: true,
    fields: [
      { key: 'alt', label: 'Caption', type: 'text' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'image', label: 'Image', type: 'image', imageKind: 'photo' },
    ],
  },
  {
    name: 'waiverImages',
    label: 'Waiver Images',
    titleField: 'id',
    imageField: 'image',
    allowAddDelete: false, // fixed section ids: welcome/risks/eligibility/medical/signature
    fields: [
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'image', label: 'Image', type: 'image', imageKind: 'photo' },
    ],
  },
];
