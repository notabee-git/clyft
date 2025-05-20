export interface PriceTier {
  min: number;
  max: number;
  price: number;
}

export interface Variant {
  size: string;
  priceTiers: PriceTier[];
}

export interface WideItemFb {
  name: string;
  subcategoryName: string;
  image: string;
  bestSellingPrice: number;
  variants: Variant[];
}