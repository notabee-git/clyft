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

export interface Address {
  addressType:string,
  city: string;
  flatBuilding:string
  fullname:string,
  id:number,
  landmark:string,
  locality: string;
  mobile: string;
  pincode: string;
  state: string;
}

export interface CartItem {
  product: WideItemFb;
  variantIndex: number;
  quantity: number;
  price: number;
}
type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  dateOfBirth: string;
  gender: Gender;
  addresses: Address[];
  deliveryAddress?: Address;
  currentLocationAddress?: Address;
}

type LocationCoords = {
  latitude: number;
  longitude: number;
};