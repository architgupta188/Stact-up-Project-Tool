import { create } from 'zustand';

export const useReportStore = create((set) => ({
  currentReportId: null,
  generationStatus: 'idle',
  pipelineStep: 0,
  pipelineLabel: '',
  setReportId: (id) => set({ currentReportId: id }),
  setPipelineStep: (step, label) => set({ pipelineStep: step, pipelineLabel: label }),
  setStatus: (status) => set({ generationStatus: status }),
  reset: () => set({ currentReportId: null, generationStatus: 'idle', pipelineStep: 0, pipelineLabel: '' }),
}));
