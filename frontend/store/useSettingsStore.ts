import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  schoolName: string;
  schoolAddress: string;
  setSchoolName: (name: string) => void;
  setSchoolAddress: (address: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      schoolName: 'Delhi Public School',
      schoolAddress: 'Bokaro Steel City',
      setSchoolName: (schoolName) => set({ schoolName }),
      setSchoolAddress: (schoolAddress) => set({ schoolAddress }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
