export type StepType = 'hands_on' | 'post_patient';

export interface StepDefinition {
  id: string;
  name: string;
  nameKhmer: string;
  type: StepType;
  icon: string;
}

export interface WorkflowTemplate {
  name: string;
  nameKhmer: string;
  category: 'X-Ray' | 'CT Scan';
  hasContrast: boolean;
  steps: StepDefinition[];
}

export interface PauseEvent {
  pausedAt: string;
  resumedAt?: string;
  targetPatientId: string;
  activeSecondsBeforePause: number;
}

export interface StepLog {
  stepId: string;
  stepName: string;
  stepNameKhmer?: string;
  stepType: StepType;
  icon: string;
  status: 'pending' | 'in_progress' | 'completed';
  startTime: string | null;
  endTime: string | null;
  accumulatedSeconds: number;
  activeSegmentStart: number | null;
  durationSeconds: number;
  note?: string;
  isMultiPatientInterrupted?: boolean;
  pauseEvents?: PauseEvent[];
}

export interface ResourcesState {
  filmsPrinted: number;
  cdsBurned: number;
  filmSize: string;
  techCount: number;
  nurseCount: number;
  bottleneckNotes: string;
}

export interface Session {
  id: string;
  observerName: string;
  stationId: string;
  patientId: string;
  modality: 'CT' | 'XRay';
  hasContrast: boolean;
  patientType: string;
  bodyPart: string;
  bodyPartKhmer?: string;
  xrayViews?: number | null;
  ctRegionsCount?: number | null;
  shift: string;
  templateKey: string;
  templateName: string;
  templateNameKhmer?: string;
  overallStartTime: string;
  overallEndTime: string | null;
  currentStepIndex: number;
  stepLogs: StepLog[];
  syncedToSheet: boolean;
  resources: ResourcesState;
  multiPatientPauseCount?: number;
  multiPatientPauseSummary?: string;
}

export interface SummaryMetrics {
  handsOnDurationSec: number;
  postProcessingDurationSec: number;
  totalDurationSec: number;
}

export interface CompletedRecord extends Session {
  timestampLogged: string;
  summaryMetrics: SummaryMetrics;
  microStepTimings?: string;
  [key: string]: any;
}

export interface FormDataState {
  observerName: string;
  patientId: string;
  modality: 'CT' | 'XRay';
  hasContrast: 'yes' | 'no';
  bodyPart: string;
  bodyPartKhmer: string;
  customBodyPart?: string;
  xrayViews: number | '';
  ctRegionsCount: number | '';
  patientType: string;
  shift: string;
  isShiftOverridden: boolean;
}
