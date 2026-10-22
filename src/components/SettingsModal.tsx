import React from 'react';
import { CompletedRecord } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface SettingsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  sheetsUrl: string;
  setSheetsUrl: (url: string) => void;
  history: CompletedRecord[];
  onManualSyncAll: () => void;
  onExportCSV: () => void;
  showToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  language,
  isOpen,
  onClose,
  sheetsUrl,
  setSheetsUrl,
  history,
  onManualSyncAll,
  onExportCSV,
  showToast
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <i className="fa-solid fa-table text-emerald-600"></i>
            <span>{t.sheetsSettingsTitle}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {t.sheetsUrlHelp}
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.sheetsUrlLabel}
          </label>
          <input
            type="url"
            value={sheetsUrl}
            onChange={(e) => setSheetsUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>{t.recordsLogged}:</span>
            <span className="font-mono font-bold text-slate-900">{history.length} {t.recordsUnit}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>{language === 'kh' ? 'រង់ចាំបញ្ជូន:' : 'Pending Sync:'}</span>
            <span className="font-mono font-bold text-amber-600">
              {history.filter(h => !h.syncedToSheet).length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onManualSyncAll}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>{language === 'kh' ? 'បញ្ជូនទិន្នន័យ' : 'Sync Sheets'}</span>
            </button>
            <button
              type="button"
              onClick={onExportCSV}
              className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-file-csv"></i>
              <span>{t.exportCsvBtn}</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => {
              try {
                localStorage.setItem('radiology_sheets_url', sheetsUrl);
              } catch {
                // Ignore
              }
              onClose();
              showToast(language === 'kh' ? "បានរក្សាទុក URL Google Sheets!" : "Google Sheets URL saved!");
            }}
            className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            {t.saveUrlBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
