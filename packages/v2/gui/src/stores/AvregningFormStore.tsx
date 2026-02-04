import { create } from 'zustand';

interface AvregningFormState {
  formState: any;
  setFormState: (state: any) => void;
  reset: () => void;
}

export const useAvregningFormState = create<AvregningFormState>(set => ({
  formState: 0,
  setFormState: state => set({ formState: state }),
  reset: () => set({ formState: 0 }),
}));
