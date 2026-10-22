import { WorkflowTemplate } from './types';

export const HARDCODED_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyni4IMpxrEB-cLgGhkhbfMmgcnpAt62p6doRAZW3w3lXftEdNG-jurMc9kGFXk2GE44A/exec";

export const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate> = {
  'XRAY_NO_CONTRAST': {
    name: 'Routine X-Ray (No Contrast)',
    nameKhmer: 'ថតកាំរស្មីទូទៅ (គ្មានថ្នាំព៌ណ)',
    category: 'X-Ray',
    hasContrast: false,
    steps: [
      { id: 's1', name: 'Patient Intake & Verification', nameKhmer: 'ពិនិត្យឈ្មោះ និងសំណើ', type: 'hands_on', icon: 'fa-user-check' },
      { id: 's2', name: 'Positioning & Tube Alignment', nameKhmer: 'រៀបចំ និងតម្រង់កាំរស្មី', type: 'hands_on', icon: 'fa-arrows-to-eye' },
      { id: 's3', name: 'Image Exposure / Acquisition', nameKhmer: 'បាញ់កាំរស្មី / ថត', type: 'hands_on', icon: 'fa-radiation' },
      { id: 's4', name: 'Patient Offboarding', nameKhmer: 'ជូនអ្នកជំងឺចេញបន្ទប់ថត', type: 'hands_on', icon: 'fa-person-walking-arrow-right' },
      { id: 's5', name: 'Console Formatting & Post-Proc', nameKhmer: 'រៀបចំរូបភាពក្នុងកុងសូល', type: 'post_patient', icon: 'fa-sliders' },
      { id: 's6', name: 'Laser Printing & Film Packaging', nameKhmer: 'បោះពុម្ព និង ដាក់ស្រោម', type: 'post_patient', icon: 'fa-print' },
      { id: 's7', name: 'Final Handover to Patient', nameKhmer: 'ប្រគល់លទ្ធផលជូនអ្នកជំងឺ', type: 'post_patient', icon: 'fa-box-archive' }
    ]
  },
  'XRAY_WITH_CONTRAST': {
    name: 'Contrast-Enhanced X-Ray (IVU/HSG)',
    nameKhmer: 'ថតកាំរស្មីចាក់ថ្នាំព៌ណContrast (IVU/HSG)',
    category: 'X-Ray',
    hasContrast: true,
    steps: [
      { id: 's1', name: 'Patient Intake & Screening', nameKhmer: 'ពិនិត្យឈ្មោះ និងសំណើ', type: 'hands_on', icon: 'fa-clipboard-check' },
      { id: 's2', name: 'IV Access & Contrast Prep', nameKhmer: 'ចាក់ថ្នាំក្នុងសរសៃ និងរៀបចំសឺរ៉ាំង', type: 'hands_on', icon: 'fa-syringe' },
      { id: 's3', name: 'Positioning & Scout Exposure', nameKhmer: 'រៀបចំ និងតម្រង់កាំរស្មី', type: 'hands_on', icon: 'fa-expand' },
      { id: 's4', name: 'Contrast Injection & Timed Exposures', nameKhmer: 'បាញ់កាំរស្មី / ថតតាមដំណាក់កាល', type: 'hands_on', icon: 'fa-stopwatch-20' },
      { id: 's5', name: 'Line Removal & Offboarding', nameKhmer: 'ដកសរសៃ និងជូនអ្នកជំងឺចេញ', type: 'hands_on', icon: 'fa-hand-holding-medical' },
      { id: 's6', name: 'Console Review & Layout', nameKhmer: 'រៀបចំរូបភាពក្នុងកុងសូល', type: 'post_patient', icon: 'fa-desktop' },
      { id: 's7', name: 'Laser Printing & Packaging', nameKhmer: 'បោះពុម្ព និង ដាក់ស្រោម', type: 'post_patient', icon: 'fa-print' },
      { id: 's8', name: 'Final Handover & Instructions', nameKhmer: 'ប្រគល់លទ្ធផលជូនអ្នកជំងឺ', type: 'post_patient', icon: 'fa-file-signature' }
    ]
  },
  'CT_NO_CONTRAST': {
    name: 'CT Scan (No Contrast)',
    nameKhmer: 'ស្កេន CT ធម្មតា (គ្មានថ្នាំព៌ណ)',
    category: 'CT Scan',
    hasContrast: false,
    steps: [
      { id: 's1', name: 'Patient Intake & Safety Check', nameKhmer: 'ពិនិត្យឈ្មោះ និងសំណើ/សុវត្ថិភាព', type: 'hands_on', icon: 'fa-shield-halved' },
      { id: 's2', name: 'Couch Positioning & Laser Alignment', nameKhmer: 'រៀបចំ និងតម្រង់កាំរស្មីឡាស៊ែរ', type: 'hands_on', icon: 'fa-crosshairs' },
      { id: 's3', name: 'Topogram & CT Scan Execution', nameKhmer: 'បាញ់កាំរស្មី / ស្កេន CT', type: 'hands_on', icon: 'fa-ring' },
      { id: 's4', name: 'Patient Offboarding & Room Reset', nameKhmer: 'ជូនអ្នកជំងឺចេញ និងសម្អាតគ្រែ', type: 'hands_on', icon: 'fa-pump-soap' },
      { id: 's5', name: '3D Multi-Planar Recon (MPR)', nameKhmer: 'រៀបចំរូបភាពក្នុងកុងសូល 3D MPR', type: 'post_patient', icon: 'fa-cubes' },
      { id: 's6', name: 'Multi-Frame Printing & Packaging', nameKhmer: 'បោះពុម្ព និង ដាក់ស្រោម/CD', type: 'post_patient', icon: 'fa-images' },
      { id: 's7', name: 'Final Handover to Patient', nameKhmer: 'ប្រគល់លទ្ធផលជូនអ្នកជំងឺ', type: 'post_patient', icon: 'fa-circle-check' }
    ]
  },
  'CT_WITH_CONTRAST': {
    name: 'CT Scan (With IV Contrast)',
    nameKhmer: 'ស្កេន CT ថ្នាំព៌ណContrast',
    category: 'CT Scan',
    hasContrast: true,
    steps: [
      { id: 's1', name: 'Patient Intake & Renal Screening', nameKhmer: 'ពិនិត្យឈ្មោះ និងសំណើ/ជាតិអ៊ុយរ៉េ', type: 'hands_on', icon: 'fa-vial' },
      { id: 's2', name: 'IV Cannulation & Injector Setup', nameKhmer: 'ចាក់ថ្នាំក្នុងសរសៃ និងរៀបចំសឺរ៉ាំង', type: 'hands_on', icon: 'fa-syringe' },
      { id: 's3', name: 'Couch Positioning & Scout Setup', nameKhmer: 'រៀបចំ និងតម្រង់កាំរស្មីឡាស៊ែរ', type: 'hands_on', icon: 'fa-crosshairs' },
      { id: 's4', name: 'Contrast Injection & Dynamic Scan', nameKhmer: 'ចាក់ថ្នាំ & បាញ់កាំរស្មីស្កេន', type: 'hands_on', icon: 'fa-heart-pulse' },
      { id: 's5', name: 'Line Removal & Reaction Watch', nameKhmer: 'ដកសរសៃ និងតាមដានអាការៈ', type: 'hands_on', icon: 'fa-user-nurse' },
      { id: 's6', name: 'Advanced 3D Recon (MPR/MIP/VRT)', nameKhmer: 'រៀបចំរូបភាពក្នុងកុងសូល 3D MPR', type: 'post_patient', icon: 'fa-layer-group' },
      { id: 's7', name: 'Multi-Sheet Printing & Packaging', nameKhmer: 'បោះពុម្ព និង ដាក់ស្រោម/CD', type: 'post_patient', icon: 'fa-print' },
      { id: 's8', name: 'Final Handover & Hydration Guidance', nameKhmer: 'ប្រគល់លទ្ធផលជូនអ្នកជំងឺ', type: 'post_patient', icon: 'fa-bottle-water' }
    ]
  }
};

export const XRAY_REGIONS = [
  { id: 'chest', label: 'Chest (1 view)', labelKhmer: 'ទ្រូង (1 ប្លង់)', labelEn: 'Chest (1 view)', name: 'Chest (1 view)', defaultViews: 1, views: 1, isMore: false, icon: 'fa-lungs' },
  { id: 'bones', label: 'Limbs & Spine (2 views)', labelKhmer: 'ឆ្អឹង/ខ្នង (2 ប្លង់)', labelEn: 'Limbs & Spine (2 views)', name: 'Bones / Limbs / Spines (2 views)', defaultViews: 2, views: 2, isMore: false, icon: 'fa-bone' },
  { id: 'fluoro', label: 'Fluoroscopy (6 views)', labelKhmer: 'ឆ្លុះ (6 ប្លង់)', labelEn: 'Fluoroscopy (6 views)', name: 'Fluoroscopy (6 views)', defaultViews: 6, views: 6, isMore: false, icon: 'fa-film' },
  { id: 'more', label: 'More', labelKhmer: 'ផ្សេងទៀត', labelEn: 'More', name: 'More', defaultViews: 0, views: 0, isMore: true, icon: 'fa-ellipsis' }
];

export const CT_REGIONS = [
  { id: 'brain', label: 'Brain / Head', labelKhmer: 'ក្បាល', labelEn: 'Brain / Head', sublabel: 'Cerebral', name: 'Brain', defaultRegions: 1, isMore: false, icon: 'fa-brain' },
  { id: 'tap', label: 'TAP', labelKhmer: 'ទ្រូង-ពោះ (TAP)', labelEn: 'TAP (Thorax/Abdo/Pelvis)', sublabel: 'Thorax / Abdo / Pelvis', name: 'TAP', defaultRegions: 3, isMore: false, icon: 'fa-child-body' },
  { id: 'ctap', label: 'CTAP', labelKhmer: 'ក្បាល+TAP', labelEn: 'CTAP (Brain + TAP)', sublabel: 'Cerebral + TAP', name: 'CTAP (Cerebral + TAP)', defaultRegions: 4, isMore: false, icon: 'fa-head-side-medical' },
  { id: 'more', label: 'More', labelKhmer: 'ផ្សេងទៀត', labelEn: 'More', sublabel: 'Multi / Custom', name: 'More', defaultRegions: 0, isMore: true, icon: 'fa-layer-group' }
];

export const QUICK_BOTTLENECKS = [
  { id: 'iv', label: 'IV Line Delay', labelKhmer: 'ចាក់សរសៃយឺត', labelEn: 'IV Line Delay', icon: 'fa-syringe' },
  { id: 'patient', label: 'Patient Late', labelKhmer: 'អ្នកជំងឺមកយឺត', labelEn: 'Patient Late', icon: 'fa-user-clock' },
  { id: 'transport', label: 'Transport Delay', labelKhmer: 'រង់ចាំរទេះ/គ្រែ', labelEn: 'Transport Delay', icon: 'fa-wheelchair' },
  { id: 'sanitation', label: 'Sanitation Delay', labelKhmer: 'សម្អាតបន្ទប់/ក្អួត', labelEn: 'Sanitation Delay', icon: 'fa-pump-soap' },
  { id: 'consent', label: 'Consent Delay', labelKhmer: 'រង់ចាំការយល់ព្រម', labelEn: 'Consent Delay', icon: 'fa-file-signature' },
  { id: 'console', label: 'Console Queue', labelKhmer: 'កុងសូលស្ទះ/រង់ចាំ', labelEn: 'Console Queue', icon: 'fa-desktop' }
];

export const PATIENT_TYPES = [
  { id: 'OPD', label: 'OPD', labelKhmer: 'អ្នកជំងឺក្រៅ', labelEn: 'OPD', color: 'border-slate-300' },
  { id: 'IPD', label: 'IPD', labelKhmer: 'សម្រាកពេទ្យ', labelEn: 'IPD', color: 'border-slate-300' },
  { id: 'ER', label: '🚨 ER', labelKhmer: 'សង្គ្រោះបន្ទាន់', labelEn: '🚨 Emergency', color: 'border-rose-500 bg-rose-50' },
  { id: 'VIP', label: 'VIP', labelKhmer: 'ពិសេស', labelEn: 'VIP', color: 'border-amber-400' }
];

export const SHIFT_SCHEDULES = [
  { id: 'morning', name: 'Morning (7:30 AM - 12:00 PM)', labelKhmer: 'វេនព្រឹក', labelEn: 'Morning', time: '7:30 - 12:00' },
  { id: 'afternoon', name: 'Afternoon (12:00 PM - 7:00 PM)', labelKhmer: 'វេនរសៀល', labelEn: 'Afternoon', time: '12:00 - 19:00' },
  { id: 'overnight', name: 'Overnight (7:00 PM - 7:30 AM)', labelKhmer: 'វេនយប់', labelEn: 'Overnight', time: '19:00 - 7:30' }
];
