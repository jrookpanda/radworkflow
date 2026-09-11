🏥 Radiology Time-Motion Study Tracker

Calmette Hospital Radiology Department • MHA Activity-Based Costing (ABC) Study

A lightweight, mobile-optimized Web Application designed for time-and-motion data collection in hospital radiology departments. Built for tablets and smartphones to track micro-step operational timings, personnel allocations, material consumables, and process bottlenecks for X-Ray and CT Scan workflows.

💡 Key Features

⏱️ Micro-Step Stopwatch: Split tracking for Hands-On Physical Patient Prep vs. Post-Patient Console & Film Printing.

📋 Pre-configured Protocol Templates: Built-in workflow steps for X-Ray (Contrast / Non-Contrast) and CT Scans (Contrast / Non-Contrast).

📊 Resource & Consumable Logging: Track film sheets printed (14x17", 8x10", etc.), technician counts, nurse involvement, and bottleneck notes.

🔄 Google Sheets Live Sync: Direct zero-backend integration via Google Apps Script Web App endpoint.

📱 Offline First & Responsive: Fully responsive Tailwind CSS UI with touch-friendly controls and haptic feedback support.

🚀 Quick Deployment Guide

1. Backend Setup (Google Sheets)

Open a new Google Sheet.

Click Extensions > Apps Script.

Replace the script content with Code.gs from this repository.

Click Deploy > New Deployment > Web app.

Set Execute as to Me and Who has access to Anyone.

Copy the generated Web App Execution URL.

2. Frontend Setup (GitHub Pages)

Fork or clone this repository to your GitHub account.

Go to Settings > Pages.

Set Source to Deploy from a branch (main / root).

Launch your live site URL on your mobile device!

Tap Link Sheets in the application header and paste your Apps Script URL.

📁 Repository Structure

├── index.html                  # Main Web Application (Single-file React + Tailwind + Babel)
├── Code.gs                     # Google Apps Script endpoint script
├── google_sheet_setup_guide.md # Detailed Google Sheets spreadsheet template guide
└── github_hosting_guide.md     # Step-by-step GitHub Pages hosting setup


🛠️ Built With

React 18 (UMD standalone)

Tailwind CSS (CDN)

FontAwesome 6

Google Apps Script API

Developed for Radiology Workflow Optimization & Activity-Based Costing Research.
