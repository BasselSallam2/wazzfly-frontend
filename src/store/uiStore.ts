import { create } from 'zustand';

type Density = 'standard' | 'compact';

interface UiState {
  sidebarOpen: boolean;
  density: Density;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDensity: (density: Density) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  density: 'standard',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setDensity: (density) => set({ density }),
}));
