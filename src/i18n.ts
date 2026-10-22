export type Language = 'kh' | 'en';

export const TRANSLATIONS = {
  kh: {
    // Header
    appTitle: 'RAD TIME-MOTION',
    modalityBadge: 'CT & X-Ray',
    appSubtitle: 'កម្មវិធីតាមដានពេលវេលាការងារវិទ្យុសកម្ម',
    sheetsSync: 'Sheets',
    syncedAt: 'បានបញ្ជូន',
    settingsTitle: 'ការកំណត់ Google Sheets',

    // Active Sessions Banner
    activePatients: 'អ្នកជំងឺកំពុងថត',
    newPatientBtn: '+ ថតអ្នកថ្មី',
    stepNumber: 'ជំហានទី',

    // Setup: Patient ID
    patientIdLabel: 'កូដអ្នកជំងឺ (Accession ID)',
    patientIdHint: 'ស្កេន ឬវាយបញ្ចូល',
    patientIdPlaceholder: 'វាយបញ្ចូលកូដ (ទុកទទេ = បង្កើតកូដ Auto)...',
    scanQrBtn: 'ស្កេន QR / Barcode',
    activeSessionDetected: 'មានការថតកំពុងដំណើរការ',
    activeSessionDesc: 'អ្នកជំងឺ',
    resumeBtn: 'បន្ត',

    // Setup: 1. Modality
    modalitySectionTitle: '១. ជ្រើសរើសម៉ាស៊ីន',
    modalityTapHint: 'ចុចដើម្បីប្តូរ',
    ctTitle: 'ស្កេន CT',
    ctSub: 'Computed Tomography',
    xrayTitle: 'ថតកាំរស្មី X-Ray',
    xraySub: 'General Radiography',

    // Setup: 2. Contrast
    contrastSectionTitle: '២. ការប្រើប្រាស់ថ្នាំព៌ណ',
    plainTitle: 'គ្មានថ្នាំព៌ណ',
    plainSub: 'Plain / Routine',
    contrastTitle: 'មានប្រើថ្នាំព៌ណ',
    contrastSub: 'IV Contrast Enhanced',

    // Setup: 3. Anatomy Region
    anatomySectionTitle: '៣. ចំនួនតំបន់សរីរាង្គដែលត្រូវថត',
    anatomySwipeHint: 'អូស / ចុចជ្រើសរើស',
    moreBtnLabel: 'ផ្សេងទៀត',
    ctRegionsLabel: 'ចំនួនតំបន់ស្កេន CT ជាក់ស្តែង',
    xrayViewsLabel: 'ចំនួនប្លង់ថត X-Ray ជាក់ស្តែង',
    mandatoryBadge: '* កាតព្វកិច្ច',
    ctCalcText: 'ស្កេន {count} តំបន់ = {films} សន្លឹកហ្វីម (1 តំបន់ = 2 films)',
    xrayCalcText: 'ថត {count} ប្លង់ = {films} សន្លឹកហ្វីម (1 ប្លង់ = 1 film)',
    enterCtRegionsPrompt: 'សូមវាយបញ្ចូល ឬចុច + កំណត់ចំនួនតំបន់',
    enterXrayViewsPrompt: 'សូមវាយបញ្ចូល ឬចុច + កំណត់ចំនួនប្លង់',

    // Setup: 4. Patient Type
    patientTypeSectionTitle: '៤. ប្រភេទអ្នកជំងឺ',
    opd: 'អ្នកជំងឺក្រៅ (OPD)',
    ipd: 'សម្រាកពេទ្យ (IPD)',
    er: '🚨 សង្គ្រោះបន្ទាន់ (ER)',
    vip: 'ពិសេស (VIP)',

    // Setup: 5. Shift
    shiftSectionTitle: '៥. វេនការងារ',
    morning: 'ព្រឹក',
    afternoon: 'រសៀល',
    night: 'យប់',

    // Setup: Floating Action Button
    resumePatientBtn: 'បន្តការថតអ្នកជំងឺ {id}',
    startStudyBtn: 'ចាប់ផ្តើមថត',
    pleaseEnterCtRegions: 'សូមបញ្ចូលចំនួនតំបន់ស្កេន CT',
    pleaseEnterXrayViews: 'សូមបញ្ចូលចំនួនប្លង់ថត X-Ray',
    mandatoryRequired: '* កាតព្វកិច្ច (សូមបញ្ជាក់ចំនួន)',
    summaryPillCt: 'ស្កេន CT ({count} តំបន់ = {films} សន្លឹកហ្វីម)',
    summaryPillXray: 'ថតកាំរស្មី ({views} ប្លង់ = {films} សន្លឹកហ្វីម)',

    // Tracking View
    undoBtn: 'ថយក្រោយ',
    pauseNewBtn: 'ផ្អាក & ថតថ្មី',
    nextStepBtn: 'ជំហានបន្ទាប់',
    finishStepBtn: 'បញ្ចប់ការថត',
    nextStepCue: 'បន្ទាប់:',
    minSecLabel: 'នាទី : វិនាទី',
    timerHandsOn: 'កំពុងពិនិត្យ/ថតអ្នកជំងឺ',
    timerPostProc: 'កំពុងរៀបចំរូបភាព/កុងសូល',
    bottlenecksBtn: 'កកស្ទះ / យឺត (Bottlenecks)',
    bottlenecksTitle: 'កត់ត្រាមូលហេតុយឺតយ៉ាវជាក់ស្តែង',
    closeBtn: 'បិទ',
    allStepsHistory: 'លម្អិតជំហានទាំងអស់',
    stepInProgress: 'កំពុងដំណើរការ',
    stepCompleted: 'បានបញ្ចប់',
    stepPending: 'មិនទាន់ដល់',

    // Resources View
    resourcesTitle: 'សម្ភារៈប្រើប្រាស់ និងបុគ្គលិក',
    resourcesSubtitle: 'ទិន្នន័យស្រាវជ្រាវថ្លៃដើមហ្វីម ថាស CD និងកម្លាំងពលកម្ម',
    filmsPrintedLabel: 'ចំនួនសន្លឹកហ្វីមដែលព្រីន',
    sheetsUnit: 'សន្លឹក',
    cdsBurnedLabel: 'ចំនួនថាស CD/DVD ដែលបានសរសេរ',
    discsUnit: 'បន្ទះ',
    filmSizeLabel: 'ទំហំហ្វីមឡាស៊ែរ',
    techCountLabel: 'ចំនួនអ្នកបច្ចេកទេសវិទ្យុសកម្ម',
    techsUnit: 'នាក់',
    nurseCountLabel: 'ចំនួនគិលានុបដ្ឋាយិកា (សម្រាប់ចាក់ថ្នាំ)',
    nursesUnit: 'នាក់',
    bottleneckNotesLabel: 'កំណត់សម្គាល់ការកកស្ទះ ឬបញ្ហាជួបប្រទះ',
    bottleneckNotesPlaceholder: 'ឧ. រង់ចាំលទ្ធផល Creatinine, ចាក់សរសៃ 2 ដង, ម៉ាស៊ីន Error...',
    saveAndSyncBtn: 'រក្សាទុក & បញ្ជូនទិន្នន័យ',

    // Summary View
    summaryDoneTitle: 'ការថតបានបញ្ចប់ & កត់ត្រារួចរាល់!',
    summaryDoneSub: 'ទិន្នន័យត្រូវបានកត់ត្រាសម្រាប់គម្រោងស្រាវជ្រាវ',
    summaryLocalSaved: '✓ បានរក្សាទុកក្នុងឧបករណ៍ & បញ្ជូនចូល Google Sheets',
    remainingActivePatients: 'អ្នកជំងឺកំពុងដំណើរការនៅសល់',
    clickToResume: 'ចុចដើម្បីបន្ត',
    startNextPatientBtn: 'ថតអ្នកជំងឺបន្ទាប់',

    // Scanner Modal
    scannerTitle: 'ស្កេនបាកូដ / QR កូដអ្នកជំងឺ',
    scannerPrompt: 'សូមតម្រង់កាមេរ៉ាទៅលើ QR Code ឬ Barcode',
    scannerCloseBtn: 'បិទ',

    // Settings Modal
    sheetsSettingsTitle: 'ការកំណត់ Google Sheets',
    sheetsUrlLabel: 'Google Apps Script Web App URL',
    sheetsUrlHelp: 'URL ទទួលទិន្នន័យពី Apps Script សម្រាប់កត់ត្រាចូល Sheets',
    saveUrlBtn: 'រក្សាទុក URL',
    exportCsvBtn: 'ទាញយកទិន្នន័យ Backup (CSV)',
    recordsLogged: 'ទិន្នន័យកត់ត្រារួច',
    recordsUnit: 'ករណី',
    closeModalBtn: 'បិទ'
  },
  en: {
    // Header
    appTitle: 'RAD TIME-MOTION',
    modalityBadge: 'CT & X-Ray',
    appSubtitle: 'Radiology Workflow & Time-Motion Tracker',
    sheetsSync: 'Sheets',
    syncedAt: 'Synced',
    settingsTitle: 'Google Sheets Settings',

    // Active Sessions Banner
    activePatients: 'Active Patients',
    newPatientBtn: '+ New Patient',
    stepNumber: 'Step',

    // Setup: Patient ID
    patientIdLabel: 'Patient ID / Accession Number',
    patientIdHint: 'Scan QR or Enter Code',
    patientIdPlaceholder: 'Enter Patient Code (leave blank for Auto ID)...',
    scanQrBtn: 'Scan QR / Barcode',
    activeSessionDetected: 'Active Study in Progress',
    activeSessionDesc: 'Patient',
    resumeBtn: 'Resume',

    // Setup: 1. Modality
    modalitySectionTitle: '1. Select Modality',
    modalityTapHint: 'Tap to switch',
    ctTitle: 'CT Scan',
    ctSub: 'Computed Tomography',
    xrayTitle: 'X-Ray',
    xraySub: 'General Radiography',

    // Setup: 2. Contrast
    contrastSectionTitle: '2. Contrast Administration',
    plainTitle: 'Plain / Routine',
    plainSub: 'No IV Contrast',
    contrastTitle: 'IV Contrast Enhanced',
    contrastSub: 'Contrast Media Injected',

    // Setup: 3. Anatomy Region
    anatomySectionTitle: '3. Body Regions / Views',
    anatomySwipeHint: 'Swipe / Tap to select',
    moreBtnLabel: 'More',
    ctRegionsLabel: 'Actual CT Body Regions Scanned',
    xrayViewsLabel: 'Actual X-Ray Views Taken',
    mandatoryBadge: '* Required',
    ctCalcText: '{count} regions scanned = {films} films (1 region = 2 films)',
    xrayCalcText: '{count} views taken = {films} films (1 view = 1 film)',
    enterCtRegionsPrompt: 'Please enter or tap + to specify regions count',
    enterXrayViewsPrompt: 'Please enter or tap + to specify views count',

    // Setup: 4. Patient Type
    patientTypeSectionTitle: '4. Patient Category',
    opd: 'OPD (Outpatient)',
    ipd: 'IPD (Inpatient)',
    er: '🚨 ER (Emergency)',
    vip: 'VIP',

    // Setup: 5. Shift
    shiftSectionTitle: '5. Work Shift',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',

    // Setup: Floating Action Button
    resumePatientBtn: 'Resume Observation for {id}',
    startStudyBtn: 'Start Study',
    pleaseEnterCtRegions: 'Please Enter CT Regions Count',
    pleaseEnterXrayViews: 'Please Enter X-Ray Views Count',
    mandatoryRequired: '* Mandatory Field Required',
    summaryPillCt: 'CT Scan ({count} regions = {films} films)',
    summaryPillXray: 'X-Ray ({views} views = {films} film)',

    // Tracking View
    undoBtn: 'Undo',
    pauseNewBtn: 'Pause & New',
    nextStepBtn: 'Next Step',
    finishStepBtn: 'Finish Study',
    nextStepCue: 'Next:',
    minSecLabel: 'min : sec',
    timerHandsOn: 'Patient Positioning & Acquisition',
    timerPostProc: 'Console Reconstruction & Printing',
    bottlenecksBtn: 'Bottlenecks / Delays',
    bottlenecksTitle: 'Log Workflow Bottleneck or Delay',
    closeBtn: 'Close',
    allStepsHistory: 'Detailed Step Timeline',
    stepInProgress: 'In Progress',
    stepCompleted: 'Completed',
    stepPending: 'Pending',

    // Resources View
    resourcesTitle: 'Consumables & Staffing',
    resourcesSubtitle: 'Research evidence on film waste, CD packaging and labor cost',
    filmsPrintedLabel: 'Laser Films Printed',
    sheetsUnit: 'Sheets',
    cdsBurnedLabel: 'CDs / DVDs Burned',
    discsUnit: 'Discs',
    filmSizeLabel: 'Laser Film Size',
    techCountLabel: 'Radiology Technicians Count',
    techsUnit: 'Techs',
    nurseCountLabel: 'Nurses Count (IV Prep & Injection)',
    nursesUnit: 'Nurses',
    bottleneckNotesLabel: 'Bottlenecks / Clinical Delay Notes',
    bottleneckNotesPlaceholder: 'e.g. Waiting for renal panel, difficult IV access, console lag...',
    saveAndSyncBtn: 'Save & Sync Data',

    // Summary View
    summaryDoneTitle: 'Study Completed & Logged!',
    summaryDoneSub: 'Data recorded for time-motion research study',
    summaryLocalSaved: '✓ Saved locally & submitted to Google Sheets',
    remainingActivePatients: 'Remaining Active Patients',
    clickToResume: 'Click to resume',
    startNextPatientBtn: 'Start Next Patient',

    // Scanner Modal
    scannerTitle: 'Scan Patient Barcode / QR Code',
    scannerPrompt: 'Align camera with barcode or accession QR code',
    scannerCloseBtn: 'Close',

    // Settings Modal
    sheetsSettingsTitle: 'Google Sheets Settings',
    sheetsUrlLabel: 'Google Apps Script Web App URL',
    sheetsUrlHelp: 'Apps Script endpoint URL for synchronizing logged records',
    saveUrlBtn: 'Save URL',
    exportCsvBtn: 'Export Backup Data (CSV)',
    recordsLogged: 'Records Logged',
    recordsUnit: 'Cases',
    closeModalBtn: 'Close'
  }
};
