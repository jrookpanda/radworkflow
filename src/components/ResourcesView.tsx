import React from 'react';
import { Session } from '../types';
import { triggerHaptic } from '../utils';
import { Language, TRANSLATIONS } from '../i18n';

interface ResourcesViewProps {
  language: Language;
  session: Session;
  onUpdateSession: (updated: Session) => void;
  onSaveResources: (e: React.FormEvent) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  language,
  session,
  onUpdateSession,
  onSaveResources
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm my-auto space-y-4 pb-24 sm:pb-6">
      <div className="border-b border-slate-100 pb-2.5">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <i className="fa-solid fa-box-archive text-sky-600"></i>
          <span>{t.resourcesTitle}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {t.resourcesSubtitle}
        </p>
      </div>

      <form onSubmit={onSaveResources} className="space-y-3.5">

        {/* Laser Films Printed */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-film text-indigo-600"></i>
              <span>{t.filmsPrintedLabel}</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-400">{t.sheetsUnit}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(25);
                const current = session.resources.filmsPrinted || 0;
                onUpdateSession({
                  ...session,
                  resources: { ...session.resources, filmsPrinted: Math.max(0, current - 1) }
                });
              }}
              className="w-14 h-14 bg-white border-2 border-slate-200 hover:border-sky-500 rounded-2xl text-xl font-black text-slate-700 shadow-sm active:scale-90 transition flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-minus"></i>
            </button>

            <div className="flex-1 text-center bg-white py-2.5 rounded-2xl border border-slate-200 shadow-inner">
              <span className="text-3xl font-mono font-black text-sky-600">
                {session.resources.filmsPrinted}
              </span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">{t.sheetsUnit}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(25);
                const current = session.resources.filmsPrinted || 0;
                onUpdateSession({
                  ...session,
                  resources: { ...session.resources, filmsPrinted: current + 1 }
                });
              }}
              className="w-14 h-14 bg-white border-2 border-slate-200 hover:border-sky-500 rounded-2xl text-xl font-black text-slate-700 shadow-sm active:scale-90 transition flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          {/* Formula Baseline Calculation Display */}
          <div className="mt-2.5 py-1.5 px-3 bg-sky-50 border border-sky-200/80 rounded-xl text-[11px] flex items-center justify-between text-sky-950 font-semibold">
            <span className="flex items-center gap-1.5 truncate">
              <i className="fa-solid fa-calculator text-sky-600 flex-shrink-0"></i>
              <span className="truncate">
                {session.modality === 'CT'
                  ? (language === 'kh'
                      ? `ស្កេន CT ${session.ctRegionsCount || 1} តំបន់ × 2 = ${(session.ctRegionsCount || 1) * 2} សន្លឹក`
                      : `CT Scan ${session.ctRegionsCount || 1} regions × 2 = ${(session.ctRegionsCount || 1) * 2} films`)
                  : (language === 'kh'
                      ? `ថត X-Ray ${session.xrayViews || 1} ប្លង់ × 1 = ${(session.xrayViews || 1) * 1} សន្លឹក`
                      : `X-Ray ${session.xrayViews || 1} views × 1 = ${(session.xrayViews || 1) * 1} film`)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                const autoFilms = session.modality === 'CT'
                  ? (session.ctRegionsCount || 1) * 2
                  : (session.xrayViews || 1) * 1;
                onUpdateSession({
                  ...session,
                  resources: { ...session.resources, filmsPrinted: autoFilms }
                });
              }}
              className="text-[10px] text-sky-700 hover:text-sky-900 underline font-bold cursor-pointer whitespace-nowrap ml-2"
              title="Reset to formula calculated films"
            >
              {language === 'kh' ? 'គិតឡើងវិញ' : 'Reset'}
            </button>
          </div>
        </div>

        {/* CDs / DVDs Burned & Packaged */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-compact-disc text-amber-600"></i>
              <span>{t.cdsBurnedLabel}</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-400">{t.discsUnit}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(25);
                const current = session.resources.cdsBurned || 0;
                onUpdateSession({
                  ...session,
                  resources: { ...session.resources, cdsBurned: Math.max(0, current - 1) }
                });
              }}
              className="w-14 h-14 bg-white border-2 border-slate-200 hover:border-amber-500 rounded-2xl text-xl font-black text-slate-700 shadow-sm active:scale-90 transition flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-minus"></i>
            </button>

            <div className="flex-1 text-center bg-white py-2.5 rounded-2xl border border-slate-200 shadow-inner">
              <span className="text-3xl font-mono font-black text-amber-600">
                {session.resources.cdsBurned || 0}
              </span>
              <span className="block text-[9px] uppercase font-bold text-slate-400">{t.discsUnit}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(25);
                const current = session.resources.cdsBurned || 0;
                onUpdateSession({
                  ...session,
                  resources: { ...session.resources, cdsBurned: current + 1 }
                });
              }}
              className="w-14 h-14 bg-white border-2 border-slate-200 hover:border-amber-500 rounded-2xl text-xl font-black text-slate-700 shadow-sm active:scale-90 transition flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        {/* Film Size Format */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t.filmSizeLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '14x17', label: '14" x 17"', subKh: 'ធំ', subEn: 'Large' },
              { id: '10x12', label: '10" x 12"', subKh: 'មធ្យម', subEn: 'Medium' },
              { id: '8x10', label: '8" x 10"', subKh: 'តូច', subEn: 'Small' },
              { id: 'Digital-Only', label: 'PACS Only', subKh: 'ឌីជីថលសុទ្ធ', subEn: 'Digital Only' }
            ].map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  onUpdateSession({
                    ...session,
                    resources: { ...session.resources, filmSize: sz.id }
                  });
                }}
                className={`py-2 px-2 rounded-xl text-center border transition cursor-pointer active:scale-95 ${
                  session.resources.filmSize === sz.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">{sz.label}</div>
                <div className="text-[9px] font-semibold opacity-80">{language === 'kh' ? sz.subKh : sz.subEn}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Staffing: Technicians & Nurses */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Technicians */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">
              {t.techCountLabel}
            </label>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  const cur = session.resources.techCount || 1;
                  onUpdateSession({
                    ...session,
                    resources: { ...session.resources, techCount: Math.max(1, cur - 1) }
                  });
                }}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-xs active:scale-90 transition flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="text-lg font-mono font-black text-slate-900">{session.resources.techCount}</span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  const cur = session.resources.techCount || 1;
                  onUpdateSession({
                    ...session,
                    resources: { ...session.resources, techCount: cur + 1 }
                  });
                }}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-xs active:scale-90 transition flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Nurses */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">
              {t.nurseCountLabel}
            </label>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  const cur = session.resources.nurseCount || 0;
                  onUpdateSession({
                    ...session,
                    resources: { ...session.resources, nurseCount: Math.max(0, cur - 1) }
                  });
                }}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-xs active:scale-90 transition flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="text-lg font-mono font-black text-slate-900">{session.resources.nurseCount}</span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  const cur = session.resources.nurseCount || 0;
                  onUpdateSession({
                    ...session,
                    resources: { ...session.resources, nurseCount: cur + 1 }
                  });
                }}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-xs active:scale-90 transition flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Bottleneck / Observation Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.bottleneckNotesLabel}
          </label>
          <textarea
            rows={2}
            value={session.resources.bottleneckNotes}
            onChange={(e) => {
              onUpdateSession({
                ...session,
                resources: { ...session.resources, bottleneckNotes: e.target.value }
              });
            }}
            placeholder={t.bottleneckNotesPlaceholder}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
          ></textarea>
        </div>

        {/* Floating Thumb-Zone Action Button */}
        <div className="fixed bottom-3 left-0 right-0 max-w-md sm:max-w-xl mx-auto px-4 z-40">
          <button
            type="submit"
            className="w-full h-15 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center space-x-2 border-2 border-emerald-400/40 cursor-pointer"
          >
            <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
            <span className="text-sm sm:text-base font-black">{t.saveAndSyncBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
