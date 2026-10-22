import React from 'react';
import { CT_REGIONS, PATIENT_TYPES, SHIFT_SCHEDULES, XRAY_REGIONS } from '../constants';
import { FormDataState, Session } from '../types';
import { triggerHaptic } from '../utils';
import { Language, TRANSLATIONS } from '../i18n';

interface SetupViewProps {
  language: Language;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  stationId?: string;
  setStationId?: (id: string) => void;
  isStationLocked?: boolean;
  setIsStationLocked?: (locked: boolean) => void;
  matchingActiveSession: Session | undefined;
  onStartObservation: (e?: React.FormEvent) => void;
  onResumeExistingSession: (sessionId: string) => void;
  onOpenScanner: () => void;
}

export const SetupView: React.FC<SetupViewProps> = ({
  language,
  formData,
  setFormData,
  matchingActiveSession,
  onStartObservation,
  onResumeExistingSession,
  onOpenScanner
}) => {
  const t = TRANSLATIONS[language];
  const currentRegions = formData.modality === 'CT' ? CT_REGIONS : XRAY_REGIONS;
  const isMoreSelected = formData.bodyPart === 'More';
  const isCtMoreInvalid = formData.modality === 'CT' && isMoreSelected && (!formData.ctRegionsCount || Number(formData.ctRegionsCount) < 1);
  const isXrayMoreInvalid = formData.modality === 'XRay' && isMoreSelected && (!formData.xrayViews || Number(formData.xrayViews) < 1);
  const isRequiredMissing = isCtMoreInvalid || isXrayMoreInvalid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRequiredMissing) {
      triggerHaptic(60);
      return;
    }
    onStartObservation(e);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4 my-auto pb-24 sm:pb-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Patient ID & QR / Barcode Scanner Panel */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-3.5 sm:p-4 rounded-3xl border-2 border-sky-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <i className="fa-solid fa-id-badge text-sky-600 text-sm"></i>
              <span>{t.patientIdLabel}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-semibold">{t.patientIdHint}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                placeholder={t.patientIdPlaceholder}
                className={`w-full h-13 px-4 text-sm font-mono font-bold rounded-2xl border transition shadow-inner ${
                  matchingActiveSession
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 focus:ring-2 focus:ring-emerald-500'
                    : 'border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/50'
                }`}
              />
              {formData.patientId && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, patientId: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs hover:bg-slate-300"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* High-Visibility Obvious Scanner Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(30);
                onOpenScanner();
              }}
              className="h-13 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-2 border-2 border-sky-400/40 cursor-pointer flex-shrink-0"
            >
              <i className="fa-solid fa-camera text-lg animate-pulse"></i>
              <span className="text-xs sm:text-sm font-black whitespace-nowrap">{t.scanQrBtn}</span>
            </button>
          </div>
        </div>

        {/* Active Session Alert Banner if match */}
        {matchingActiveSession && (
          <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-play text-emerald-600"></i>
                <span>{t.activeSessionDetected}</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold">
                {t.activeSessionDesc} <span className="font-mono font-bold">{matchingActiveSession.patientId}</span> • {t.stepNumber} {matchingActiveSession.currentStepIndex + 1}: {language === 'kh' ? (matchingActiveSession.stepLogs[matchingActiveSession.currentStepIndex]?.stepNameKhmer || matchingActiveSession.stepLogs[matchingActiveSession.currentStepIndex]?.stepName) : matchingActiveSession.stepLogs[matchingActiveSession.currentStepIndex]?.stepName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onResumeExistingSession(matchingActiveSession.id)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition flex items-center space-x-1 cursor-pointer"
            >
              <span>{t.resumeBtn}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

        {/* 1. Modality Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              <span>{t.modalitySectionTitle}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-semibold">{t.modalityTapHint}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* CT Scan Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(35);
                setFormData({
                  ...formData,
                  modality: 'CT',
                  bodyPart: 'Brain',
                  bodyPartKhmer: 'ក្បាល',
                  ctRegionsCount: 1
                });
              }}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-95 text-left relative cursor-pointer ${
                formData.modality === 'CT'
                  ? 'border-teal-500 bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/30'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                  formData.modality === 'CT' ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'
                }`}>
                  <i className="fa-solid fa-ring"></i>
                </div>
                {formData.modality === 'CT' && (
                  <span className="w-5 h-5 rounded-full bg-white text-teal-700 font-black flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-black text-sm">{t.ctTitle}</div>
              <div className={`text-[10px] font-semibold ${formData.modality === 'CT' ? 'text-teal-100' : 'text-slate-400'}`}>
                {t.ctSub}
              </div>
            </button>

            {/* X-Ray Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(35);
                setFormData({
                  ...formData,
                  modality: 'XRay',
                  bodyPart: 'Chest (1 view)',
                  bodyPartKhmer: 'ទ្រូង (1 ប្លង់)',
                  xrayViews: 1
                });
              }}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-95 text-left relative cursor-pointer ${
                formData.modality === 'XRay'
                  ? 'border-sky-500 bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/30'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                  formData.modality === 'XRay' ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-600'
                }`}>
                  <i className="fa-solid fa-x-ray"></i>
                </div>
                {formData.modality === 'XRay' && (
                  <span className="w-5 h-5 rounded-full bg-white text-sky-700 font-black flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-black text-sm">{t.xrayTitle}</div>
              <div className={`text-[10px] font-semibold ${formData.modality === 'XRay' ? 'text-sky-100' : 'text-slate-400'}`}>
                {t.xraySub}
              </div>
            </button>
          </div>
        </div>

        {/* 2. Contrast Administration */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-800 tracking-wide uppercase">
            {t.contrastSectionTitle}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                setFormData({ ...formData, hasContrast: 'no' });
              }}
              className={`py-3 px-3 rounded-2xl font-black text-xs border transition flex items-center justify-center space-x-2 cursor-pointer ${
                formData.hasContrast === 'no'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-ban text-sm"></i>
              <div className="text-left">
                <div>{t.plainTitle}</div>
                <div className="text-[9px] font-medium opacity-80">{t.plainSub}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                setFormData({ ...formData, hasContrast: 'yes' });
              }}
              className={`py-3 px-3 rounded-2xl font-black text-xs border transition flex items-center justify-center space-x-2 cursor-pointer ${
                formData.hasContrast === 'yes'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-400/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-syringe text-sm"></i>
              <div className="text-left">
                <div>{t.contrastTitle}</div>
                <div className="text-[9px] font-medium opacity-80">{t.contrastSub}</div>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Streamlined Horizontal Pill & Quick Region Selection + Optional Manual Adjustment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 tracking-wide uppercase">
              {t.anatomySectionTitle}
            </label>
            <span className="text-[10px] text-slate-400 font-semibold">{t.anatomySwipeHint}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
            {currentRegions.map((reg) => {
              const isSelected = formData.bodyPart === reg.name;
              const pillLabel = reg.isMore
                ? t.moreBtnLabel
                : (language === 'kh' ? (reg.labelKhmer || reg.label) : (reg.labelEn || reg.label));

              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    if (reg.isMore || reg.id === 'more') {
                      setFormData({
                        ...formData,
                        bodyPart: 'More',
                        bodyPartKhmer: 'ផ្សេងទៀត',
                        ctRegionsCount: formData.modality === 'CT' ? (formData.ctRegionsCount && Number(formData.ctRegionsCount) > 0 ? formData.ctRegionsCount : '') : formData.ctRegionsCount,
                        xrayViews: formData.modality === 'XRay' ? (formData.xrayViews && Number(formData.xrayViews) > 0 ? formData.xrayViews : '') : formData.xrayViews
                      });
                    } else {
                      const defaultRegCount = 'defaultRegions' in reg ? (reg as any).defaultRegions : 1;
                      const defaultViewCount = 'defaultViews' in reg ? (reg as any).defaultViews : ('views' in reg ? (reg as any).views : 1);
                      setFormData({
                        ...formData,
                        bodyPart: reg.name,
                        bodyPartKhmer: reg.labelKhmer,
                        ctRegionsCount: formData.modality === 'CT' ? defaultRegCount : formData.ctRegionsCount,
                        xrayViews: formData.modality === 'XRay' ? defaultViewCount : formData.xrayViews
                      });
                    }
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border flex-shrink-0 transition flex items-center space-x-2 active:scale-95 cursor-pointer ${
                    isSelected
                      ? formData.modality === 'CT'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-400/30'
                        : 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className={`fa-solid ${reg.icon} text-sm ${isSelected ? 'text-white' : 'text-slate-500'}`}></i>
                  <span>{pillLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Manual Adjustment Stepper: Shown ONLY when ផ្សេងទៀត (More) is selected and is Mandatory */}
          {isMoreSelected && (
            <div className="animate-slide-in-right">
              {formData.modality === 'CT' ? (
                <div className={`rounded-2xl p-3.5 border transition-all shadow-xs ${
                  isCtMoreInvalid ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-300/40' : 'bg-teal-50/90 border-teal-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-layer-group text-teal-600"></i>
                      <span className="text-xs font-black text-teal-950">{t.ctRegionsLabel}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      isCtMoreInvalid
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-teal-100/80 text-teal-800 border-teal-300'
                    }`}>
                      {t.mandatoryBadge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-teal-900 leading-tight">
                      {formData.ctRegionsCount && Number(formData.ctRegionsCount) > 0 ? (
                        <span>
                          {t.ctCalcText
                            .replace('{count}', String(formData.ctRegionsCount))
                            .replace('{films}', String(Number(formData.ctRegionsCount) * 2))}
                        </span>
                      ) : (
                        <span className="text-amber-800 font-bold flex items-center gap-1">
                          <i className="fa-solid fa-circle-exclamation text-amber-600"></i>
                          <span>{t.enterCtRegionsPrompt}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(20);
                          const cur = Number(formData.ctRegionsCount) || 1;
                          setFormData({ ...formData, ctRegionsCount: Math.max(1, cur - 1) });
                        }}
                        className="w-10 h-10 bg-white border border-teal-300 hover:border-teal-500 rounded-xl text-teal-900 font-black text-base shadow-xs flex items-center justify-center active:scale-90 transition cursor-pointer"
                        title="Decrease body regions"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>

                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.ctRegionsCount}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 1);
                          setFormData({ ...formData, ctRegionsCount: val });
                        }}
                        placeholder="?"
                        className={`w-14 h-10 text-center font-mono font-black text-lg rounded-xl border bg-white focus:outline-none focus:ring-2 shadow-inner ${
                          isCtMoreInvalid
                            ? 'border-amber-400 text-amber-900 ring-2 ring-amber-300/60'
                            : 'border-teal-300 text-teal-950 focus:ring-teal-500'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(20);
                          const cur = Number(formData.ctRegionsCount) || 0;
                          setFormData({ ...formData, ctRegionsCount: cur + 1 });
                        }}
                        className="w-10 h-10 bg-white border border-teal-300 hover:border-teal-500 rounded-xl text-teal-900 font-black text-base shadow-xs flex items-center justify-center active:scale-90 transition cursor-pointer"
                        title="Increase body regions"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl p-3.5 border transition-all shadow-xs ${
                  isXrayMoreInvalid ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-300/40' : 'bg-sky-50/90 border-sky-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-camera-rotate text-sky-600"></i>
                      <span className="text-xs font-black text-sky-950">{t.xrayViewsLabel}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      isXrayMoreInvalid
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-sky-100/80 text-sky-800 border-sky-300'
                    }`}>
                      {t.mandatoryBadge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-sky-900 leading-tight">
                      {formData.xrayViews && Number(formData.xrayViews) > 0 ? (
                        <span>
                          {t.xrayCalcText
                            .replace('{count}', String(formData.xrayViews))
                            .replace('{films}', String(Number(formData.xrayViews) * 1))}
                        </span>
                      ) : (
                        <span className="text-amber-800 font-bold flex items-center gap-1">
                          <i className="fa-solid fa-circle-exclamation text-amber-600"></i>
                          <span>{t.enterXrayViewsPrompt}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(20);
                          const cur = Number(formData.xrayViews) || 1;
                          setFormData({ ...formData, xrayViews: Math.max(1, cur - 1) });
                        }}
                        className="w-10 h-10 bg-white border border-sky-300 hover:border-sky-500 rounded-xl text-sky-900 font-black text-base shadow-xs flex items-center justify-center active:scale-90 transition cursor-pointer"
                        title="Decrease views"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>

                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.xrayViews}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 1);
                          setFormData({ ...formData, xrayViews: val });
                        }}
                        placeholder="?"
                        className={`w-14 h-10 text-center font-mono font-black text-lg rounded-xl border bg-white focus:outline-none focus:ring-2 shadow-inner ${
                          isXrayMoreInvalid
                            ? 'border-amber-400 text-amber-900 ring-2 ring-amber-300/60'
                            : 'border-sky-300 text-sky-950 focus:ring-sky-500'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(20);
                          const cur = Number(formData.xrayViews) || 0;
                          setFormData({ ...formData, xrayViews: cur + 1 });
                        }}
                        className="w-10 h-10 bg-white border border-sky-300 hover:border-sky-500 rounded-xl text-sky-900 font-black text-base shadow-xs flex items-center justify-center active:scale-90 transition cursor-pointer"
                        title="Increase views"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Patient Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-800 tracking-wide uppercase">
            {t.patientTypeSectionTitle}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PATIENT_TYPES.map((pt) => {
              const isSelected = formData.patientType === pt.id;
              const isER = pt.id === 'ER';
              const label = language === 'kh' ? pt.labelKhmer : pt.labelEn;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setFormData({ ...formData, patientType: pt.id });
                  }}
                  className={`py-2 px-1 rounded-xl text-center border transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? isER
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : isER
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black truncate">{pt.label}</div>
                  <div className="text-[9px] font-semibold opacity-90 truncate">{label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Shift Schedule */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-800 tracking-wide uppercase">
            {t.shiftSectionTitle}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SHIFT_SCHEDULES.map((s) => {
              const isSelected = formData.shift.includes(s.name.split(' ')[0]);
              const label = language === 'kh' ? s.labelKhmer : s.labelEn;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setFormData({ ...formData, shift: s.name, isShiftOverridden: true });
                  }}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center gap-1">
                    <i className="fa-regular fa-clock text-indigo-600 text-[10px]"></i>
                    <span className="truncate">{label}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold">{s.time}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Thumb-Zone Action Button */}
        <div className="fixed bottom-3 left-0 right-0 max-w-md sm:max-w-xl mx-auto px-4 z-40">
          {matchingActiveSession ? (
            <button
              type="button"
              onClick={() => onResumeExistingSession(matchingActiveSession.id)}
              className="w-full h-15 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center space-x-2 border-2 border-emerald-400/30 cursor-pointer"
            >
              <i className="fa-solid fa-play text-lg"></i>
              <div className="text-left font-black">
                {t.resumePatientBtn.replace('{id}', matchingActiveSession.patientId)}
              </div>
            </button>
          ) : isRequiredMissing ? (
            <button
              type="submit"
              className="w-full h-15 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-600/30 active:scale-98 transition flex items-center justify-center space-x-2 border-2 border-amber-300/50 cursor-pointer animate-pulse"
            >
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <div className="text-left leading-tight">
                <div>{formData.modality === 'CT' ? t.pleaseEnterCtRegions : t.pleaseEnterXrayViews}</div>
                <div className="text-[10px] font-semibold text-amber-100">
                  {t.mandatoryRequired}
                </div>
              </div>
            </button>
          ) : (
            <button
              type="submit"
              className={`w-full h-15 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer ${
                formData.modality === 'CT'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 shadow-teal-600/30 border-2 border-teal-400/30'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 shadow-sky-600/30 border-2 border-sky-400/30'
              }`}
            >
              <i className="fa-solid fa-play text-lg"></i>
              <div className="text-left leading-tight">
                <div>{t.startStudyBtn}</div>
                <div className="text-[10px] font-normal text-white/90">
                  {formData.modality === 'CT'
                    ? `${t.summaryPillCt.replace('{count}', String(formData.ctRegionsCount || 1)).replace('{films}', String((Number(formData.ctRegionsCount) || 1) * 2))} • ${formData.hasContrast === 'yes' ? t.contrastTitle : t.plainTitle}`
                    : `${t.summaryPillXray.replace('{views}', String(formData.xrayViews || 1)).replace('{films}', String((Number(formData.xrayViews) || 1) * 1))} • ${formData.hasContrast === 'yes' ? t.contrastTitle : t.plainTitle}`}
                </div>
              </div>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
