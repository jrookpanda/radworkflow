import { WORKFLOW_TEMPLATES } from './constants';
import { StepLog } from './types';

export function triggerHaptic(duration: number = 35): void {
  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(duration);
    } catch {
      // Ignore vibration error
    }
  }
}

export function getAutoDetectedShift(dateObj: Date = new Date()): string {
  const totalMin = dateObj.getHours() * 60 + dateObj.getMinutes();
  if (totalMin >= 450 && totalMin < 720) {
    return 'Morning (7:30 AM - 12:00 PM)';
  } else if (totalMin >= 720 && totalMin < 1140) {
    return 'Afternoon (12:00 PM - 7:00 PM)';
  } else {
    return 'Overnight (7:00 PM - 7:30 AM)';
  }
}

export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem('radiology_station_id');
    if (!id) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      id = `STATION-RAD-${rand}`;
      localStorage.setItem('radiology_station_id', id);
    }
    return id;
  } catch {
    return 'STATION-RAD-01';
  }
}

export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDateTimeLocal(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoStr;
  }
}

export function formatTimeOnly(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoStr;
  }
}

export function getStepDuration(step: StepLog | undefined, nowTs: number): number {
  if (!step) return 0;
  if (step.status === 'completed') {
    return step.durationSeconds || 0;
  }
  const accumulated = step.accumulatedSeconds || 0;
  if (step.status === 'in_progress' && step.activeSegmentStart) {
    const live = Math.max(0, Math.floor((nowTs - step.activeSegmentStart) / 1000));
    return accumulated + live;
  }
  return accumulated;
}

export function flattenRecordForSheet(obs: any): any {
  const handsOnSec = obs.summaryMetrics?.handsOnDurationSec || 0;
  const postSec = obs.summaryMetrics?.postProcessingDurationSec || 0;
  const totalSec = obs.summaryMetrics?.totalDurationSec || (handsOnSec + postSec);

  const pauseCount = obs.multiPatientPauseCount || 0;
  const isInterrupted = pauseCount > 0;

  const microTimings = (obs.stepLogs || []).map((step: any, idx: number) => {
    const sStart = step.startTime ? formatTimeOnly(step.startTime) : '';
    const sEnd = step.endTime ? formatTimeOnly(step.endTime) : '';
    const timeSpan = (sStart && sEnd) ? ` (${sStart}-${sEnd})` : '';
    const pauseNote = step.isMultiPatientInterrupted
      ? ` [PAUSED ${step.pauseEvents?.length || 1}x for concurrent patient | Active work: ${step.durationSeconds || 0}s]`
      : '';
    const stepLabel = step.stepNameKhmer ? `${step.stepNameKhmer} (${step.stepName})` : step.stepName;
    return `Step ${idx + 1} [${stepLabel}]: ${step.durationSeconds || 0}s active${timeSpan}${pauseNote}`;
  }).join(' | ');

  const timestampLogged = obs.timestampLogged ? formatDateTimeLocal(obs.timestampLogged) : formatDateTimeLocal(new Date().toISOString());
  const overallStartFormatted = obs.overallStartTime ? formatDateTimeLocal(obs.overallStartTime) : formatDateTimeLocal(new Date().toISOString());
  const overallEndFormatted = obs.overallEndTime ? formatDateTimeLocal(obs.overallEndTime) : formatDateTimeLocal(new Date().toISOString());

  const stationVal = obs.stationId || obs.observerName || 'STATION-RAD-01';
  const observerVal = obs.observerName || obs.stationId || 'STATION-RAD-01';
  const patientVal = obs.patientId || ('ACC-' + Math.floor(100000 + Math.random() * 900000));
  const shiftVal = obs.shift || getAutoDetectedShift();
  const modalityVal = obs.modality || 'CT';
  const contrastVal = obs.hasContrast ? 'Yes' : 'No';
  const patientTypeVal = obs.patientType || 'OPD';
  const bodyPartVal = obs.bodyPart || (modalityVal === 'CT' ? 'Brain' : 'Chest (1 view)');
  const templateVal = obs.templateName || (WORKFLOW_TEMPLATES[obs.templateKey]?.name || (modalityVal === 'CT' ? 'CT Scan' : 'X-Ray'));
  const filmSizeVal = obs.resources?.filmSize || '14x17';
  const filmsPrintedVal = obs.resources?.filmsPrinted ?? 0;
  const cdsBurnedVal = obs.resources?.cdsBurned ?? 0;
  const techCountVal = obs.resources?.techCount ?? 1;
  const nurseCountVal = obs.resources?.nurseCount ?? 0;

  let bottleneckVal = obs.resources?.bottleneckNotes || '';
  if (isInterrupted) {
    const multiNote = `[CONCURRENT MULTI-PATIENT WORKFLOW: Step paused ${pauseCount} time(s) to attend other patients. Steps affected: ${obs.multiPatientPauseSummary || 'Multiple'}. Active duration is exact - NOT a slow step]`;
    bottleneckVal = bottleneckVal ? `${multiNote} | Field Notes: ${bottleneckVal}` : multiNote;
  } else if (!bottleneckVal) {
    bottleneckVal = 'None';
  }

  return {
    ...obs,
    timestampLogged,
    microStepTimings: microTimings,

    "Timestamp Logged": timestampLogged,
    "Observation ID": obs.id || '',
    "Station ID": stationVal,
    "Observer Name": observerVal,
    "Patient ID": patientVal,
    "Shift": shiftVal,
    "Modality": modalityVal,
    "IV Contrast": contrastVal,
    "Patient Type": patientTypeVal,
    "Body Region / Exam": bodyPartVal,
    "Workflow Template": templateVal,
    "Overall Start Time": overallStartFormatted,
    "Overall End Time": overallEndFormatted,
    "Total Sec": totalSec,
    "Hands-On Sec": handsOnSec,
    "Post-Proc Sec": postSec,
    "Total (mm:ss)": formatDuration(totalSec),
    "Hands-On (mm:ss)": formatDuration(handsOnSec),
    "Post-Proc (mm:ss)": formatDuration(postSec),
    "Body Regions Count": obs.ctRegionsCount ?? (obs.modality === 'CT' ? 1 : ''),
    "Views Count": obs.xrayViews ?? (obs.modality === 'XRay' ? 1 : ''),
    "Films Printed": filmsPrintedVal,
    "CDs Burned": cdsBurnedVal,
    "Film Size": filmSizeVal,
    "Tech Count": techCountVal,
    "Nurse Count": nurseCountVal,
    "Multi-Patient Interrupted": isInterrupted ? `YES (${pauseCount} pause${pauseCount > 1 ? 's' : ''})` : 'NO',
    "Is Real Delay Or Multi-Patient": isInterrupted ? 'Multi-Patient Concurrency (NOT a slow step)' : 'Normal Flow',
    "Interruption Details": obs.multiPatientPauseSummary || 'None',
    "Bottlenecks / Notes": bottleneckVal,
    "Micro Step Timings": microTimings
  };
}
