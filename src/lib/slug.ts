export function slugify(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function unslugify(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function extractIdFromSlug(param: string): string | null {
  if (!param || typeof param !== 'string') return null;
  const match = param.match(/(?:^|-)([a-fA-F0-9]{24})$/);
  return match ? match[1].toLowerCase() : null;
}

export function getStudioUrl(studio: { _id?: string; title?: string; slug?: string }): string {
  if (studio?.slug) return `/studios/${studio.slug}`;
  if (studio?.title) {
    const mainTitle = studio.title.split('-')[0].trim();
    const titleSlug = slugify(mainTitle) || slugify(studio.title);
    if (titleSlug) return `/studios/${titleSlug}`;
  }
  return studio?._id ? `/studios/${studio._id}` : '/studios';
}

export function getCategoryUrl(categoryName: string): string {
  const catSlug = slugify(categoryName || '');
  return catSlug ? `/studios/category/${catSlug}` : '/studios';
}
