import React from 'react';
import { Session } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface SummaryViewProps {
  language: Language;
  activeSessions: Session[];
  onResumeExistingSession: (id: string) => void;
  onStartNewPatient: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  language,
  activeSessions,
  onResumeExistingSession,
  onStartNewPatient
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm my-auto space-y-5 text-center pb-24 sm:pb-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
        <i className="fa-solid fa-circle-check"></i>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900">
          {t.summaryDoneTitle}
        </h2>
        <div className="text-xs font-bold text-slate-500 mt-1">
          {t.summaryDoneSub}
        </div>
        <p className="text-[11px] text-emerald-700 font-medium mt-1">
          {t.summaryLocalSaved}
        </p>
      </div>

      {activeSessions.length > 0 && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-left">
          <div className="text-xs font-extrabold text-sky-950 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-users text-sky-600"></i>
              <span>{t.remainingActivePatients} ({activeSessions.length})</span>
            </span>
            <span className="text-[10px] text-sky-700 font-bold">{t.clickToResume}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {activeSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => onResumeExistingSession(s.id)}
                className="px-3.5 py-2 bg-white border-2 border-sky-300 hover:border-sky-500 rounded-xl text-xs font-mono font-black text-sky-950 flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{s.patientId}</span>
                <i className="fa-solid fa-arrow-right text-[10px] text-sky-600"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Thumb-Zone Action Button */}
      <div className="fixed bottom-3 left-0 right-0 max-w-md sm:max-w-xl mx-auto px-4 z-40">
        <button
          onClick={onStartNewPatient}
          className="w-full h-15 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-sky-600/30 active:scale-98 transition flex items-center justify-center space-x-2 border-2 border-sky-400/40 cursor-pointer"
        >
          <i className="fa-solid fa-plus text-lg"></i>
          <span className="text-sm sm:text-base font-black">{t.startNextPatientBtn}</span>
        </button>
      </div>
    </div>
  );
};
