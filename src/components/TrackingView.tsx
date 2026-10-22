import React, { useState } from 'react';
import { QUICK_BOTTLENECKS } from '../constants';
import { Session } from '../types';
import { formatDuration, getStepDuration, triggerHaptic } from '../utils';
import { Language, TRANSLATIONS } from '../i18n';

interface TrackingViewProps {
  language: Language;
  session: Session;
  now: number;
  slideAnimClass: string;
  onUndoLastStep: () => void;
  onNewPatientFromStopwatch: () => void;
  onTapStepComplete: () => void;
  onToggleBottleneck: (tag: string) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  language,
  session,
  now,
  slideAnimClass,
  onUndoLastStep,
  onNewPatientFromStopwatch,
  onTapStepComplete,
  onToggleBottleneck
}) => {
  const [isBottleneckDropdownOpen, setIsBottleneckDropdownOpen] = useState<boolean>(false);
  const t = TRANSLATIONS[language];

  const currentStep = session.stepLogs[session.currentStepIndex];
  const nextStep = session.currentStepIndex + 1 < session.stepLogs.length
    ? session.stepLogs[session.currentStepIndex + 1]
    : null;
  const isLastStep = session.currentStepIndex === session.stepLogs.length - 1;
  const isCT = session.modality === 'CT';
  const isER = session.patientType === 'ER';

  const selectedBottlenecks = QUICK_BOTTLENECKS.filter((b) =>
    (session.resources?.bottleneckNotes || '').includes(b.label)
  );

  const currentStepTitle = language === 'kh'
    ? (currentStep?.stepNameKhmer || currentStep?.stepName)
    : currentStep?.stepName;

  const nextStepTitle = nextStep
    ? (language === 'kh' ? (nextStep.stepNameKhmer || nextStep.stepName) : nextStep.stepName)
    : '';

  return (
    <div className="space-y-3 my-auto pb-6">

      {/* TOP ACTION DOCK: Next Step, Pause/New Patient, and Undo */}
      <div className="bg-slate-950/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2 sticky top-2 z-30">
        {/* Compact Undo Button */}
        <button
          onClick={onUndoLastStep}
          disabled={session.currentStepIndex === 0}
          className="w-12 h-13 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-bold rounded-xl disabled:opacity-30 active:scale-95 transition flex flex-col items-center justify-center cursor-pointer shadow-sm flex-shrink-0"
          title={t.undoBtn}
        >
          <i className="fa-solid fa-rotate-left text-xs"></i>
          <span className="text-[10px] font-bold mt-0.5">{t.undoBtn}</span>
        </button>

        {/* Frictionless Multi-Tasking: Pause & New Patient Button */}
        <button
          onClick={onNewPatientFromStopwatch}
          className="h-13 px-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black rounded-xl active:scale-95 transition flex flex-col items-center justify-center cursor-pointer shadow-md shadow-amber-500/20 flex-shrink-0"
          title={t.pauseNewBtn}
        >
          <div className="flex items-center space-x-1">
            <i className="fa-solid fa-pause text-xs"></i>
            <i className="fa-solid fa-user-plus text-xs"></i>
          </div>
          <span className="text-[11px] font-black leading-tight mt-0.5 whitespace-nowrap">{t.pauseNewBtn}</span>
        </button>

        {/* Primary Action Button: NEXT STEP / FINISH Button */}
        <button
          onClick={onTapStepComplete}
          className={`flex-1 h-13 text-white font-black rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer ${
            isLastStep
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30 border border-emerald-400/40'
              : isCT
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 shadow-teal-600/30 border border-teal-400/40'
              : 'bg-gradient-to-r from-sky-600 to-blue-600 shadow-sky-600/30 border border-sky-400/40'
          }`}
        >
          <div className="text-left">
            <div className="text-xs sm:text-sm font-black leading-tight">
              {isLastStep ? t.finishStepBtn : `${t.nextStepBtn} (${session.currentStepIndex + 1}/${session.stepLogs.length})`}
            </div>
          </div>
          <i className={`fa-solid ${isLastStep ? 'fa-circle-check text-base' : 'fa-arrow-right text-sm'}`}></i>
        </button>
      </div>

      {/* Main Active Timer Card */}
      <div className={`rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden border-2 ${
        isCT
          ? 'bg-slate-950 text-white border-teal-500/40 shadow-teal-950/30'
          : 'bg-slate-950 text-white border-sky-500/40 shadow-sky-950/30'
      }`}>
        {/* Top Status Bar: Patient ID, Modality, ER, Concurrency */}
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono font-black text-sm text-white tracking-wider">{session.patientId}</span>
            {isER && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                🚨 ER
              </span>
            )}
          </div>

          <div className="flex gap-1.5 items-center flex-wrap">
            {currentStep?.isMultiPatientInterrupted && (
              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold flex items-center gap-1">
                <i className="fa-solid fa-user-group text-amber-400 text-[10px]"></i>
                <span>{language === 'kh' ? `ផ្អាក ${currentStep.pauseEvents?.length || 1}x` : `Paused ${currentStep.pauseEvents?.length || 1}x`}</span>
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
              isCT
                ? 'bg-teal-950 text-teal-300 border-teal-700'
                : 'bg-sky-950 text-sky-300 border-sky-700'
            }`}>
              {isCT ? (language === 'kh' ? 'ស្កេន CT' : 'CT Scan') : (language === 'kh' ? 'ថតកាំរស្មី' : 'X-Ray')}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              session.hasContrast ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-800 text-slate-300'
            }`}>
              {session.hasContrast ? (language === 'kh' ? 'ថ្នាំព៌ណContrast' : 'IV Contrast') : (language === 'kh' ? 'គ្មានថ្នាំព៌ណ' : 'Plain')}
            </span>
          </div>
        </div>

        {/* Current Step Name with Clean Faint Next Step Visual Cue */}
        <div className="text-center my-1 overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest text-sky-400 font-extrabold mb-1">
            {language === 'kh'
              ? `ជំហានទី ${session.currentStepIndex + 1} នៃ ${session.stepLogs.length}`
              : `Step ${session.currentStepIndex + 1} of ${session.stepLogs.length}`}
          </div>

          <div className={slideAnimClass}>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentStepTitle}
              </h2>

              {/* Faint Next Step Visual Cue */}
              {nextStep ? (
                <div className="pt-1.5 flex items-center justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-400 text-xs font-semibold opacity-75">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{t.nextStepCue}</span>
                    <span className="text-slate-200 font-bold">{nextStepTitle}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-sky-400 ml-0.5"></i>
                  </div>
                </div>
              ) : (
                <div className="pt-1.5 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-bold opacity-80">
                    <i className="fa-solid fa-flag-checkered"></i>
                    <span>{language === 'kh' ? 'ជំហានចុងក្រោយ' : 'Final Step'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Stopwatch */}
        <div className="my-2.5 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-black/60 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {language === 'kh' ? 'ពេលវេលា:' : 'Time:'}
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
              {formatDuration(getStepDuration(currentStep, now))}
            </span>
          </div>
        </div>

        {currentStep?.isMultiPatientInterrupted && (
          <div className="text-center mb-2">
            <span className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-amber-400 text-[10px]"></i>
              <span>{language === 'kh' ? 'ការងារជាក់ស្តែងត្រូវបានកត់ត្រា • ផ្អាកព្រោះមើលអ្នកជំងឺផ្សេង' : 'Actual time tracked • Paused for another patient'}</span>
            </span>
          </div>
        )}

        {/* DELAYS & BOTTLENECKS: BUTTON WITH MULTICHOICE DROPDOWN SELECTION */}
        <div className="relative pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setIsBottleneckDropdownOpen(!isBottleneckDropdownOpen);
            }}
            className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold border transition flex items-center justify-between cursor-pointer active:scale-98 ${
              selectedBottlenecks.length > 0
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black ring-2 ring-amber-300/30'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border-slate-700/80'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <i className={`fa-solid fa-triangle-exclamation ${selectedBottlenecks.length > 0 ? 'text-slate-950' : 'text-amber-400'}`}></i>
              <span className="truncate">
                {selectedBottlenecks.length > 0
                  ? (language === 'kh' ? `កកស្ទះ/យឺតយ៉ាវ (${selectedBottlenecks.length} បានជ្រើសរើស)` : `Bottlenecks (${selectedBottlenecks.length} selected)`)
                  : t.bottlenecksBtn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              {selectedBottlenecks.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-950/20 text-slate-950 text-[10px] font-black">
                  {selectedBottlenecks.length}
                </span>
              )}
              <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isBottleneckDropdownOpen ? 'rotate-180' : ''}`}></i>
            </div>
          </button>

          {/* Active Tag Chips when dropdown is closed */}
          {!isBottleneckDropdownOpen && selectedBottlenecks.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {selectedBottlenecks.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-bold"
                >
                  <i className={`fa-solid ${b.icon} text-[9px]`}></i>
                  <span>{language === 'kh' ? b.labelKhmer : (b.labelEn || b.label)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(15);
                      onToggleBottleneck(b.label);
                    }}
                    className="hover:text-white ml-0.5 p-0.5 cursor-pointer"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Multichoice Dropdown Panel */}
          {isBottleneckDropdownOpen && (
            <div className="mt-2 bg-slate-900 border-2 border-slate-700 rounded-2xl p-2.5 shadow-2xl space-y-1.5 z-20">
              <div className="flex items-center justify-between px-1.5 pb-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-amber-400"></i>
                  <span>{language === 'kh' ? 'ជ្រើសរើសមូលហេតុ:' : 'Select Reasons:'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setIsBottleneckDropdownOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black transition cursor-pointer"
                >
                  {language === 'kh' ? 'រួចរាល់ ✓' : 'Done ✓'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto no-scrollbar pt-0.5">
                {QUICK_BOTTLENECKS.map((b) => {
                  const isSelected = (session.resources?.bottleneckNotes || '').includes(b.label);
                  const label = language === 'kh' ? b.labelKhmer : (b.labelEn || b.label);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(20);
                        onToggleBottleneck(b.label);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <i className={`fa-solid ${b.icon} text-xs ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}></i>
                        <span className="truncate">{label}</span>
                      </div>

                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs flex-shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400 border-slate-950 font-black'
                          : 'border-slate-600 bg-slate-900/60 text-transparent'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Progression List */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{t.allStepsHistory}</span>
          <span className="font-mono text-slate-400">{session.currentStepIndex + 1}/{session.stepLogs.length}</span>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
          {session.stepLogs.map((log, idx) => {
            const isActive = idx === session.currentStepIndex;
            const isDone = log.status === 'completed';
            const durationDisp = formatDuration(getStepDuration(log, now));
            const stepName = language === 'kh' ? (log.stepNameKhmer || log.stepName) : log.stepName;
            const stepTypeDesc = log.stepType === 'hands_on'
              ? (language === 'kh' ? 'ថែទាំអ្នកជំងឺផ្ទាល់' : 'Hands-On Patient Care')
              : (language === 'kh' ? 'រៀបចំក្នុងកុងសូល' : 'Console Post-Processing');

            return (
              <div
                key={log.stepId}
                className={`p-2.5 rounded-2xl border transition flex items-center justify-between ${
                  isActive
                    ? isCT
                      ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                      : 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                    : isDone
                    ? 'bg-slate-50 border-slate-200 opacity-90'
                    : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-emerald-500 text-white' :
                    isActive ? (isCT ? 'bg-teal-600 text-white pulse-subtle' : 'bg-sky-600 text-white pulse-subtle') :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {isDone ? <i className="fa-solid fa-check"></i> : <i className={`fa-solid ${log.icon}`}></i>}
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 flex items-center gap-1">
                      <span>{stepName}</span>
                      {log.isMultiPatientInterrupted && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          {language === 'kh' ? 'ផ្អាក' : 'Paused'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400">
                      {stepTypeDesc}
                    </div>
                  </div>
                </div>

                <div className="font-mono font-black text-xs text-slate-800">
                  {durationDisp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
