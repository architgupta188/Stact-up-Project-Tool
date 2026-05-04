import { create } from 'zustand';

interface ReportState {
  currentReportId: string | null;
  generationStatus: 'idle' | 'generating' | 'complete' | 'error';
  pipelineStep: number;
  pipelineLabel: string;
  setReportId: (id: string) => void;
  setPipelineStep: (step: number, label: string) => void;
  setStatus: (status: ReportState['generationStatus']) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  currentReportId: null,
  generationStatus: 'idle',
  pipelineStep: 0,
  pipelineLabel: '',
  setReportId: (id) => set({ currentReportId: id }),
  setPipelineStep: (step, label) => set({ pipelineStep: step, pipelineLabel: label }),
  setStatus: (status) => set({ generationStatus: status }),
  reset: () => set({ currentReportId: null, generationStatus: 'idle', pipelineStep: 0, pipelineLabel: '' }),
}));
