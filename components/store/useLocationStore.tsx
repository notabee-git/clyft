// store/useLocationStore.tsx
import { create } from 'zustand';

type Location = { 
  latitude: number;
  longitude: number;
};

type LocationState = {
  globalCoordinates: Location | null;
  setGlobalCoordinates: (location: Location) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  globalCoordinates: null,
  setGlobalCoordinates: (location) => set({ globalCoordinates: location }),
}));
