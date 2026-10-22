# Radiology Time-Motion Study Tracker (CT & X-Ray)

A modern React (Vite + TypeScript + Tailwind CSS) application designed for clinical radiology departments to conduct accurate time-and-motion workflow efficiency studies.

## Features

- **Modality Support**: Tailored workflows for routine and contrast-enhanced CT scans and X-Ray examinations.
- **Workflow Steps Tracking**:
  - Routine X-Ray (No Contrast) & Contrast-Enhanced X-Ray (IVU/HSG)
  - Plain CT & IV Contrast CT
  - Precise active-time stopwatch with sub-second accuracy
  - Micro-step timing breakdown (Hands-On Patient Care vs Post-Patient Console Work)
- **Concurrent Multi-Patient Handling**:
  - In-progress patient queue with seamless switching
  - Automatic timer pause with concurrency logging so pause times are never mislabeled as slow procedure steps
- **Quick Bottleneck & Delay Logging**:
  - One-tap delay tags: IV Line Delay, Patient Late, Transport Delay, Sanitation Delay, Consent Delay, Console Queue
- **QR / Barcode Scanner**:
  - Real-time webcam scanning of patient accession codes and hospital barcodes using `jsQR` with fallback manual entry
- **Consumables & Staffing Tracker**:
  - Films printed, film dimensions (14x17, 10x12, 8x10, Digital-only), technologists, and nursing counts
- **Google Sheets Integration & CSV Export**:
  - Real-time synchronization to Google Apps Script endpoints
  - Offline local storage caching (`localStorage`) with one-click manual sync for pending records
  - Direct CSV file export for spreadsheet analysis

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build
```
