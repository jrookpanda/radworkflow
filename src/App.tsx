import React, { useState, useEffect } from 'react';
import { HARDCODED_SHEETS_URL, WORKFLOW_TEMPLATES } from './constants';
import { CompletedRecord, FormDataState, Session, StepLog } from './types';
import {
  flattenRecordForSheet,
  formatDateTimeLocal,
  formatDuration,
  formatTimeOnly,
  getAutoDetectedShift,
  getOrCreateDeviceId,
  getStepDuration,
  triggerHaptic
} from './utils';
import { QrScannerModal } from './components/QrScannerModal';
import { SettingsModal } from './components/SettingsModal';
import { SetupView } from './components/SetupView';
import { TrackingView } from './components/TrackingView';
import { ResourcesView } from './components/ResourcesView';
import { SummaryView } from './components/SummaryView';
import { Language, TRANSLATIONS } from './i18n';

export function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('radiology_lang') as Language) || 'kh';
    } catch {
      return 'kh';
    }
  });
  const [view, setView] = useState<'setup' | 'tracking' | 'resources' | 'summary'>('setup');
  const [stationId, setStationId] = useState<string>(getOrCreateDeviceId());
  const [isStationLocked, setIsStationLocked] = useState<boolean>(true);
  const [sheetsUrl, setSheetsUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('radiology_sheets_url') || HARDCODED_SHEETS_URL;
    } catch {
      return HARDCODED_SHEETS_URL;
    }
  });
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [slideAnimClass, setSlideAnimClass] = useState<string>('animate-slide-in-right');

  const [formData, setFormData] = useState<FormDataState>({
    observerName: stationId,
    patientId: '',
    modality: 'XRay',
    hasContrast: 'no',
    bodyPart: 'Chest (1 view)',
    bodyPartKhmer: 'ទ្រូង (1 ប្លង់)',
    customBodyPart: '',
    xrayViews: 1,
    ctRegionsCount: 1,
    patientType: 'OPD',
    shift: getAutoDetectedShift(),
    isShiftOverridden: false
  });

  const [activeSessions, setActiveSessions] = useState<Session[]>(() => {
    try {
      const saved = localStorage.getItem('radiology_active_sessions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [history, setHistory] = useState<CompletedRecord[]>(() => {
    try {
      const saved = localStorage.getItem('radiology_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [now, setNow] = useState<number>(Date.now());
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    try {
      localStorage.setItem('radiology_active_sessions_v1', JSON.stringify(activeSessions));
    } catch {
      // Ignore
    }
  }, [activeSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('radiology_lang', language);
    } catch {
      // Ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('radiology_history_v2', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (view === 'tracking') {
      interval = setInterval(() => setNow(Date.now()), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3200);
  };

  const getTemplateKey = (modality: string, hasContrast: string) => {
    if (modality === 'CT') {
      return hasContrast === 'yes' ? 'CT_WITH_CONTRAST' : 'CT_NO_CONTRAST';
    } else {
      return hasContrast === 'yes' ? 'XRAY_WITH_CONTRAST' : 'XRAY_NO_CONTRAST';
    }
  };

  const trackingSession = activeSessions.find(s => s.id === currentSessionId) || null;

  const matchingActiveSession = formData.patientId.trim()
    ? activeSessions.find(s => s.patientId.toLowerCase() === formData.patientId.trim().toLowerCase())
    : undefined;

  const sendToGoogleSheets = async (recordsToSync: any[]): Promise<boolean> => {
    if (!sheetsUrl || !recordsToSync || recordsToSync.length === 0) return false;
    setIsSyncing(true);
    try {
      const flattened = recordsToSync.map(r => flattenRecordForSheet(r));
      await fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flattened)
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSyncing(false);
      return true;
    } catch {
      setIsSyncing(false);
      return false;
    }
  };

  const logMultiPatientPauseToSheets = async (
    pausedSession: Session,
    pausedStepName: string,
    pausedStepIndex: number,
    targetPatientId: string,
    activeSecSoFar: number
  ) => {
    if (!sheetsUrl) return;

    const pauseRecord = {
      "Timestamp Logged": formatDateTimeLocal(new Date().toISOString()),
      "Observation ID": pausedSession.id || '',
      "Station ID": pausedSession.stationId || '',
      "Observer Name": pausedSession.observerName || '',
      "Patient ID": pausedSession.patientId,
      "Shift": pausedSession.shift,
      "Modality": pausedSession.modality,
      "IV Contrast": pausedSession.hasContrast ? 'Yes' : 'No',
      "Patient Type": pausedSession.patientType || 'OPD',
      "Body Region / Exam": pausedSession.bodyPart,
      "Workflow Template": pausedSession.templateName,
      "Overall Start Time": formatDateTimeLocal(pausedSession.overallStartTime),
      "Overall End Time": "IN_PROGRESS (PAUSED FOR OTHER PATIENT)",
      "Total Sec": activeSecSoFar,
      "Total (mm:ss)": formatDuration(activeSecSoFar),
      "Record Type": "CONCURRENT_MULTI_PATIENT_PAUSE_EVENT",
      "Is Real Delay Or Multi-Patient": "Multi-Patient Concurrency (NOT a slow step)",
      "Multi-Patient Interrupted": "YES (Paused for Concurrent Patient)",
      "Paused Step Index": pausedStepIndex,
      "Paused Step Name": pausedStepName,
      "Interrupted For Patient": targetPatientId || "New Patient",
      "Interruption Details": `Step ${pausedStepIndex} (${pausedStepName}) paused at ${formatTimeOnly(new Date().toISOString())} to attend to Patient ${targetPatientId || 'New Patient'}. Active working time: ${activeSecSoFar}s.`,
      "Bottlenecks / Notes": `[CONCURRENT MULTI-PATIENT PAUSE] Step ${pausedStepIndex} (${pausedStepName}) was paused to care for Patient ${targetPatientId || 'New Patient'}. Active working time before pause: ${formatDuration(activeSecSoFar)}. This is NOT a slow step.`,
      "Micro Step Timings": `Step ${pausedStepIndex} [${pausedStepName}]: PAUSED at ${formatTimeOnly(new Date().toISOString())} for Patient ${targetPatientId || 'New Patient'} (Active: ${activeSecSoFar}s)`
    };

    try {
      await fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([pauseRecord])
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Ignore background sync errors
    }
  };

  const pauseSessionTimer = (sessionObj: Session, targetPatientId: string = 'Another Patient'): Session => {
    const nowTs = Date.now();
    const nowIso = new Date(nowTs).toISOString();
    let stepNamePaused = '';
    let stepIndexPaused = 1;
    let activeSecAtPause = 0;

    const updatedLogs: StepLog[] = sessionObj.stepLogs.map((log, idx) => {
      if (idx === sessionObj.currentStepIndex && log.status === 'in_progress' && log.activeSegmentStart) {
        const addedSec = Math.max(0, Math.floor((nowTs - log.activeSegmentStart) / 1000));
        const totalActiveSec = (log.accumulatedSeconds || 0) + addedSec;
        stepNamePaused = log.stepNameKhmer ? `${log.stepNameKhmer} (${log.stepName})` : log.stepName;
        stepIndexPaused = idx + 1;
        activeSecAtPause = totalActiveSec;

        const newPauseEvent = {
          pausedAt: nowIso,
          targetPatientId: targetPatientId,
          activeSecondsBeforePause: totalActiveSec
        };

        return {
          ...log,
          accumulatedSeconds: totalActiveSec,
          activeSegmentStart: null,
          isMultiPatientInterrupted: true,
          pauseEvents: [...(log.pauseEvents || []), newPauseEvent]
        };
      }
      return log;
    });

    const newPauseCount = (sessionObj.multiPatientPauseCount || 0) + 1;
    const pauseNote = `Step ${stepIndexPaused} (${stepNamePaused || 'Active Step'}) paused for Patient ${targetPatientId} at ${formatTimeOnly(nowIso)}`;
    const newSummary = sessionObj.multiPatientPauseSummary
      ? `${sessionObj.multiPatientPauseSummary}; ${pauseNote}`
      : pauseNote;

    const updatedSession: Session = {
      ...sessionObj,
      stepLogs: updatedLogs,
      multiPatientPauseCount: newPauseCount,
      multiPatientPauseSummary: newSummary
    };

    if (stepNamePaused) {
      logMultiPatientPauseToSheets(sessionObj, stepNamePaused, stepIndexPaused, targetPatientId, activeSecAtPause);
    }

    return updatedSession;
  };

  const resumeSessionTimer = (sessionObj: Session): Session => {
    const nowTs = Date.now();
    const nowIso = new Date(nowTs).toISOString();
    const updatedLogs: StepLog[] = sessionObj.stepLogs.map((log, idx) => {
      if (idx === sessionObj.currentStepIndex) {
        const pauseEvents = log.pauseEvents ? [...log.pauseEvents] : [];
        if (pauseEvents.length > 0 && !pauseEvents[pauseEvents.length - 1].resumedAt) {
          pauseEvents[pauseEvents.length - 1] = {
            ...pauseEvents[pauseEvents.length - 1],
            resumedAt: nowIso
          };
        }
        return {
          ...log,
          status: 'in_progress',
          activeSegmentStart: nowTs,
          pauseEvents
        };
      }
      return log;
    });
    return { ...sessionObj, stepLogs: updatedLogs };
  };

  const handleResumeExistingSession = (sessionIdToResume: string) => {
    triggerHaptic(40);
    const targetPatient = activeSessions.find(s => s.id === sessionIdToResume);
    const targetPatientCode = targetPatient ? targetPatient.patientId : 'Concurrent Patient';

    let updatedList = activeSessions.map(s => {
      if (s.id === currentSessionId && s.id !== sessionIdToResume) {
        return pauseSessionTimer(s, targetPatientCode);
      }
      return s;
    });

    updatedList = updatedList.map(s => {
      if (s.id === sessionIdToResume) {
        return resumeSessionTimer(s);
      }
      return s;
    });

    setActiveSessions(updatedList);
    setCurrentSessionId(sessionIdToResume);
    setSlideAnimClass('animate-slide-in-right');
    setView('tracking');

    if (targetPatient) {
      showToast(`បានបន្តការថតអ្នកជំងឺ (Resumed): ${targetPatient.patientId}`);
    }
  };

  const handleStartObservation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerHaptic(50);

    const effectiveObserver = formData.observerName.trim() || stationId.trim() || getOrCreateDeviceId();
    const reqPatientId = formData.patientId.trim();

    try {
      localStorage.setItem('radiology_station_id', effectiveObserver);
      setStationId(effectiveObserver);
    } catch {
      // Ignore
    }

    if (reqPatientId) {
      const existing = activeSessions.find(s => s.patientId.toLowerCase() === reqPatientId.toLowerCase());
      if (existing) {
        handleResumeExistingSession(existing.id);
        return;
      }
    }

    const newPatientCode = reqPatientId || ('ACC-' + Math.floor(100000 + Math.random() * 900000));

    let currentActiveList = activeSessions;
    if (currentSessionId) {
      currentActiveList = activeSessions.map(s => {
        if (s.id === currentSessionId) return pauseSessionTimer(s, newPatientCode);
        return s;
      });
    }

    const templateKey = getTemplateKey(formData.modality, formData.hasContrast);
    const template = WORKFLOW_TEMPLATES[templateKey];
    const startTimeIso = new Date().toISOString();
    const nowTs = Date.now();

    const initialLogs: StepLog[] = template.steps.map((step, idx) => ({
      stepId: step.id,
      stepName: step.name,
      stepNameKhmer: step.nameKhmer,
      stepType: step.type,
      icon: step.icon,
      status: idx === 0 ? 'in_progress' : 'pending',
      startTime: idx === 0 ? startTimeIso : null,
      endTime: null,
      accumulatedSeconds: 0,
      activeSegmentStart: idx === 0 ? nowTs : null,
      durationSeconds: 0,
      note: ''
    }));

    const isMore = formData.bodyPart === 'More';
    const ctRegions = Number(formData.ctRegionsCount) || 0;
    const xrayViews = Number(formData.xrayViews) || 0;

    // Validate mandatory field when ផ្សេងទៀត (More) is chosen
    if (isMore) {
      if (formData.modality === 'CT' && (!formData.ctRegionsCount || ctRegions < 1)) {
        showToast('សូមបញ្ចូលចំនួនតំបន់ស្កេន CT ជាក់ស្តែង (Please enter CT body regions count)!');
        return;
      }
      if (formData.modality === 'XRay' && (!formData.xrayViews || xrayViews < 1)) {
        showToast('សូមបញ្ចូលចំនួនប្លង់ថត X-Ray ជាក់ស្តែង (Please enter X-Ray views count)!');
        return;
      }
    }

    const effectiveCtRegions = formData.modality === 'CT' ? (isMore ? ctRegions : (Number(formData.ctRegionsCount) || 1)) : 1;
    const effectiveXrayViews = formData.modality === 'XRay' ? (isMore ? xrayViews : (Number(formData.xrayViews) || 1)) : 1;

    let finalBodyPart = formData.bodyPart;
    let finalBodyPartKhmer = formData.bodyPartKhmer;
    if (isMore) {
      if (formData.modality === 'CT') {
        finalBodyPart = `Multi-Region (${effectiveCtRegions} regions)`;
        finalBodyPartKhmer = `ស្កេនច្រើនតំបន់ (${effectiveCtRegions} តំបន់)`;
      } else {
        finalBodyPart = `Multiple Views (${effectiveXrayViews} views)`;
        finalBodyPartKhmer = `ថតច្រើនប្លង់ (${effectiveXrayViews} ប្លង់)`;
      }
    }

    // Calculation: CT scan 1 region = 2 films, X-Ray 1 view = 1 film
    const initialFilmCount = formData.modality === 'CT'
      ? effectiveCtRegions * 2
      : effectiveXrayViews * 1;

    const newSession: Session = {
      id: 'OBS-' + Date.now().toString().slice(-6),
      observerName: effectiveObserver,
      stationId: effectiveObserver,
      patientId: newPatientCode,
      modality: formData.modality,
      hasContrast: formData.hasContrast === 'yes',
      patientType: formData.patientType || 'OPD',
      bodyPart: finalBodyPart,
      bodyPartKhmer: finalBodyPartKhmer,
      xrayViews: formData.modality === 'XRay' ? effectiveXrayViews : null,
      ctRegionsCount: formData.modality === 'CT' ? effectiveCtRegions : null,
      shift: formData.shift || getAutoDetectedShift(),
      templateKey: templateKey,
      templateName: template.name,
      templateNameKhmer: template.nameKhmer,
      overallStartTime: startTimeIso,
      overallEndTime: null,
      currentStepIndex: 0,
      stepLogs: initialLogs,
      syncedToSheet: false,
      resources: {
        filmsPrinted: initialFilmCount,
        cdsBurned: 1, // Default 1 CD for study packaging research tracking
        filmSize: '14x17',
        techCount: 1,
        nurseCount: formData.hasContrast === 'yes' ? 1 : 0,
        bottleneckNotes: ''
      }
    };

    setActiveSessions([newSession, ...currentActiveList]);
    setCurrentSessionId(newSession.id);
    setSlideAnimClass('animate-slide-in-right');
    setView('tracking');
    showToast(`ចាប់ផ្តើមថតអ្នកជំងឺ (Started): ${newSession.patientId}!`);
  };

  const handleTapStepComplete = () => {
    triggerHaptic(40);
    if (!trackingSession) return;

    setSlideAnimClass('animate-slide-out-left');

    setTimeout(() => {
      const nowTs = Date.now();
      const nowIso = new Date(nowTs).toISOString();
      const logs = [...trackingSession.stepLogs];
      const currentIndex = trackingSession.currentStepIndex;
      const currentStep = logs[currentIndex];

      const totalStepSec = getStepDuration(currentStep, nowTs);

      logs[currentIndex] = {
        ...currentStep,
        status: 'completed',
        endTime: nowIso,
        durationSeconds: Math.max(1, totalStepSec),
        activeSegmentStart: null,
        accumulatedSeconds: Math.max(1, totalStepSec)
      };

      let updatedSession: Session;

      if (currentIndex + 1 < logs.length) {
        logs[currentIndex + 1] = {
          ...logs[currentIndex + 1],
          status: 'in_progress',
          startTime: logs[currentIndex + 1].startTime || nowIso,
          activeSegmentStart: nowTs,
          accumulatedSeconds: logs[currentIndex + 1].accumulatedSeconds || 0
        };

        updatedSession = {
          ...trackingSession,
          currentStepIndex: currentIndex + 1,
          stepLogs: logs
        };

        setActiveSessions(activeSessions.map(s => s.id === trackingSession.id ? updatedSession : s));
        setSlideAnimClass('animate-slide-in-right');
      } else {
        updatedSession = {
          ...trackingSession,
          overallEndTime: nowIso,
          stepLogs: logs
        };
        setActiveSessions(activeSessions.map(s => s.id === trackingSession.id ? updatedSession : s));
        setView('resources');
        showToast('គ្រប់ជំហានថតបានបញ្ចប់! សូមកត់ត្រាសម្ភារៈហ្វីម និងស៊ីឌី');
      }
    }, 200);
  };

  const handleUndoLastStep = () => {
    triggerHaptic(30);
    if (!trackingSession || trackingSession.currentStepIndex === 0) return;

    setSlideAnimClass('animate-slide-in-right');
    const nowTs = Date.now();
    const logs = [...trackingSession.stepLogs];
    const currentIndex = trackingSession.currentStepIndex;

    logs[currentIndex] = {
      ...logs[currentIndex],
      status: 'pending',
      activeSegmentStart: null,
      endTime: null
    };

    const prevIndex = currentIndex - 1;
    logs[prevIndex] = {
      ...logs[prevIndex],
      status: 'in_progress',
      activeSegmentStart: nowTs,
      endTime: null
    };

    const updatedSession: Session = {
      ...trackingSession,
      currentStepIndex: prevIndex,
      stepLogs: logs
    };

    setActiveSessions(activeSessions.map(s => s.id === trackingSession.id ? updatedSession : s));
  };

  const handleNewPatientFromStopwatch = () => {
    triggerHaptic(35);
    if (currentSessionId) {
      const updated = activeSessions.map(s => {
        if (s.id === currentSessionId) return pauseSessionTimer(s, 'New Patient Intake');
        return s;
      });
      setActiveSessions(updated);
    }

    setFormData(prev => ({
      ...prev,
      patientId: '',
      shift: getAutoDetectedShift()
    }));

    setView('setup');
    showToast("ការថតត្រូវបានផ្អាក & កត់ត្រាចូល Sheets។ សូមស្កេន ឬជ្រើសរើសអ្នកជំងឺថ្មី!");
  };

  const handleToggleBottleneck = (tag: string) => {
    triggerHaptic(20);
    if (!trackingSession) return;

    const currentNotes = trackingSession.resources.bottleneckNotes || '';
    let updatedNotes = '';

    if (currentNotes.includes(tag)) {
      updatedNotes = currentNotes.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|\s*,\s*$/g, '');
    } else {
      updatedNotes = currentNotes ? `${currentNotes}, ${tag}` : tag;
    }

    const updatedSession: Session = {
      ...trackingSession,
      resources: {
        ...trackingSession.resources,
        bottleneckNotes: updatedNotes
      }
    };

    setActiveSessions(activeSessions.map(s => s.id === trackingSession.id ? updatedSession : s));
  };

  const handleSaveResources = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerHaptic(50);
    if (!trackingSession) return;

    let handsOnSec = 0;
    let postSec = 0;
    const endTimeIso = trackingSession.overallEndTime || new Date().toISOString();

    trackingSession.stepLogs.forEach(log => {
      const sec = log.durationSeconds || 0;
      if (log.stepType === 'hands_on') {
        handsOnSec += sec;
      } else {
        postSec += sec;
      }
    });

    const totalSec = handsOnSec + postSec;

    const baseRecord = {
      ...trackingSession,
      overallEndTime: endTimeIso,
      timestampLogged: new Date().toISOString(),
      syncedToSheet: false,
      summaryMetrics: {
        handsOnDurationSec: handsOnSec,
        postProcessingDurationSec: postSec,
        totalDurationSec: totalSec
      }
    };

    const finalRecord = flattenRecordForSheet(baseRecord);

    let isSynced = false;
    if (sheetsUrl) {
      isSynced = await sendToGoogleSheets([finalRecord]);
    }

    finalRecord.syncedToSheet = isSynced;

    const updatedActiveList = activeSessions.filter(s => s.id !== trackingSession.id);
    setActiveSessions(updatedActiveList);
    setHistory([finalRecord, ...history]);

    if (updatedActiveList.length > 0) {
      setCurrentSessionId(updatedActiveList[0].id);
    } else {
      setCurrentSessionId(null);
    }

    setFormData(prev => ({ ...prev, patientId: '' }));
    setView('summary');
    showToast(isSynced ? "បានរក្សាទុក & បញ្ជូនចូល Google Sheets ដោយជោគជ័យ!" : "បានរក្សាទុកក្នុងទូរស័ព្ទ (Offline mode)");
  };

  const handleStartNewPatient = () => {
    triggerHaptic(30);
    setFormData({
      ...formData,
      patientId: '',
      shift: getAutoDetectedShift()
    });
    setView('setup');
  };

  const handleManualSyncAll = async () => {
    triggerHaptic(40);
    const unsynced = history.filter(item => !item.syncedToSheet);
    if (unsynced.length === 0) {
      showToast("ទិន្នន័យទាំងអស់បានបញ្ជូនចូល Sheets រួចរាល់ហើយ!");
      return;
    }

    const success = await sendToGoogleSheets(unsynced);
    if (success) {
      const updated = history.map(item => ({ ...item, syncedToSheet: true }));
      setHistory(updated);
      showToast(`បានបញ្ជូន ${unsynced.length} កំណត់ត្រាចូល Google Sheets!`);
    } else {
      showToast("ការបញ្ជូនមិនបានសម្រេច សូមពិនិត្យអ៊ីនធឺណិត ឬ URL");
    }
  };

  const handleExportCSV = () => {
    triggerHaptic(30);
    if (history.length === 0) {
      showToast("មិនទាន់មានទិន្នន័យដើម្បី Export ទេ");
      return;
    }

    const headers = Object.keys(history[0]).filter(k => typeof history[0][k] !== 'object');
    const csvRows = [
      headers.join(','),
      ...history.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Radiology_Time_Study_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("បានទាញយកឯកសារ CSV Backup!");
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto px-3.5 py-3 min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 shadow-sm mb-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            <i className="fa-solid fa-microscope"></i>
          </div>
          <div>
            <h1 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
              <span>RAD TIME-MOTION</span>
              <span className="bg-teal-100 text-teal-800 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase">CT & X-Ray</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold">
              {language === 'kh' ? 'កម្មវិធីតាមដានពេលវេលាវិទ្យុសកម្ម' : 'Radiology Workflow Tracker'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Subtle KH / EN Flag Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-inner">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setLanguage('kh');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                language === 'kh'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="ភាសាខ្មែរ (Khmer)"
            >
              <span className="text-sm leading-none">🇰🇭</span>
              <span className="text-[10px] font-black">KH</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setLanguage('en');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="English"
            >
              <span className="text-sm leading-none">🇬🇧</span>
              <span className="text-[10px] font-black">EN</span>
            </button>
          </div>

          <button
            onClick={() => {
              triggerHaptic(20);
              setShowSettingsModal(true);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              isSyncing ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Google Sheets Configuration"
          >
            <i className={`fa-solid ${isSyncing ? 'fa-spinner fa-spin text-amber-600' : 'fa-cloud text-sky-600'}`}></i>
            <span className="text-[10px] font-black">
              {lastSyncTime ? `${language === 'kh' ? 'បានបញ្ជូន' : 'Synced'} ${lastSyncTime}` : 'Sheets'}
            </span>
          </button>
        </div>
      </header>

      {/* In-Progress Patients Banner Strip */}
      {activeSessions.length > 0 && (
        <div className="mb-2.5 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-sky-200 shadow-sm">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-black text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{language === 'kh' ? `អ្នកជំងឺកំពុងថត (${activeSessions.length})` : `Active Patients (${activeSessions.length})`}</span>
            </span>
            {view !== 'setup' && (
              <button
                onClick={handleNewPatientFromStopwatch}
                className="text-[10px] font-black text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>{language === 'kh' ? '+ ថតអ្នកថ្មី' : '+ New Patient'}</span>
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {activeSessions.map((session) => {
              const isSelected = session.id === currentSessionId && view === 'tracking';
              const currentStep = session.stepLogs[session.currentStepIndex];
              const isPausedForOther = currentStep?.isMultiPatientInterrupted;
              const isCT = session.modality === 'CT';
              const stepName = language === 'kh'
                ? (currentStep?.stepNameKhmer || currentStep?.stepName)
                : currentStep?.stepName;

              return (
                <button
                  key={session.id}
                  onClick={() => handleResumeExistingSession(session.id)}
                  className={`px-3 py-1.5 rounded-xl text-left border flex-shrink-0 transition active:scale-95 flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? isCT
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-400/30'
                        : 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-white/20 text-white' : isCT ? 'bg-teal-100 text-teal-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    <i className={`fa-solid ${isCT ? 'fa-ring' : 'fa-x-ray'}`}></i>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-black leading-tight flex items-center gap-1">
                      <span>{session.patientId}</span>
                      {isPausedForOther && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Step paused for concurrent patient"></span>
                      )}
                    </div>
                    <div className={`text-[9px] font-semibold ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                      {session.currentStepIndex + 1}/{session.stepLogs.length}: {(stepName || '').slice(0, 16)}...
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-slate-700 animate-bounce max-w-[90vw] text-center">
          <i className="fa-solid fa-circle-info text-sky-400 flex-shrink-0"></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      <QrScannerModal
        language={language}
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={(scannedText) => {
          const trimmed = scannedText.trim();
          setFormData(prev => ({ ...prev, patientId: trimmed }));
          setShowScannerModal(false);

          const existing = activeSessions.find(s => s.patientId.toLowerCase() === trimmed.toLowerCase());
          if (existing) {
            triggerHaptic(80);
            showToast(language === 'kh'
              ? `បានស្កេនកូដ ${trimmed} មានរួចហើយ! កំពុងបន្តការថត...`
              : `Accession ${trimmed} already active! Resuming study...`);
            handleResumeExistingSession(existing.id);
          } else {
            showToast(language === 'kh'
              ? `បានស្កេនកូដអ្នកជំងឺ: ${trimmed}`
              : `Scanned Patient ID: ${trimmed}`);
          }
        }}
      />

      <SettingsModal
        language={language}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        sheetsUrl={sheetsUrl}
        setSheetsUrl={setSheetsUrl}
        history={history}
        onManualSyncAll={handleManualSyncAll}
        onExportCSV={handleExportCSV}
        showToast={showToast}
      />

      {/* Setup View */}
      {view === 'setup' && (
        <SetupView
          language={language}
          formData={formData}
          setFormData={setFormData}
          stationId={stationId}
          setStationId={setStationId}
          isStationLocked={isStationLocked}
          setIsStationLocked={setIsStationLocked}
          matchingActiveSession={matchingActiveSession}
          onStartObservation={handleStartObservation}
          onResumeExistingSession={handleResumeExistingSession}
          onOpenScanner={() => setShowScannerModal(true)}
        />
      )}

      {/* Tracking View */}
      {view === 'tracking' && trackingSession && (
        <TrackingView
          language={language}
          session={trackingSession}
          now={now}
          slideAnimClass={slideAnimClass}
          onUndoLastStep={handleUndoLastStep}
          onNewPatientFromStopwatch={handleNewPatientFromStopwatch}
          onTapStepComplete={handleTapStepComplete}
          onToggleBottleneck={handleToggleBottleneck}
        />
      )}

      {/* Resources View */}
      {view === 'resources' && trackingSession && (
        <ResourcesView
          language={language}
          session={trackingSession}
          onUpdateSession={(updated) => {
            setActiveSessions(activeSessions.map(s => s.id === updated.id ? updated : s));
          }}
          onSaveResources={handleSaveResources}
        />
      )}

      {/* Summary View */}
      {view === 'summary' && (
        <SummaryView
          language={language}
          activeSessions={activeSessions}
          onResumeExistingSession={handleResumeExistingSession}
          onStartNewPatient={handleStartNewPatient}
        />
      )}
    </div>
  );
}

export default App;
