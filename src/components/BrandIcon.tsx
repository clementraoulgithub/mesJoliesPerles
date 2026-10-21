import { BRAND_PATHS } from './brandPaths';

export type Brand = keyof typeof BRAND_PATHS | 'ungrandmarche';

export const BRAND_LABEL: Record<Brand, string> = {
  instagram: 'Instagram', facebook: 'Facebook', pinterest: 'Pinterest', etsy: 'Etsy', ungrandmarche: 'Un grand marché',
};

export interface BrandIconProps { brand: Brand; size?: number; className?: string }
/** Logo of a social network or shop, in the text colour (Un grand marché: its original logo). */
export function BrandIcon({ brand, size = 18, className }: BrandIconProps) {
  if (brand === 'ungrandmarche') {
    return <img className={'jp-brand jp-brand-ugm ' + (className ?? '')} src="/marque/ungrandmarche.png" width={size} height={size} alt="" />;
  }
  return (
    <svg className={'jp-brand ' + (className ?? '')} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={BRAND_PATHS[brand]} />
    </svg>
  );
}
