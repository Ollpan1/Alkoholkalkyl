# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- This is a static web application (`index.html`) running directly in the browser. No build or test command runners are configured.

## Architecture and Structure
- **`index.html`**: A single-file web application containing all HTML structure, CSS styles, and JavaScript logic:
  - Pharmacokinetic modeling using first-order stomach absorption and non-linear **Michaelis-Menten** liver elimination.
  - Unified timeline simulation (`simulateTimeline`) for live tracking and chart rendering.
  - Promilleplanerare for optimizing build-up and maintenance phases.
- **`systembolaget.json`**: Product database loaded asynchronously by the app for searching drinks, pricing, volume, alcohol percentage, and APK (Alkohol Per Krona).
- **`update_apk_data.py`**: Python script to fetch and process active products from the Systembolaget data API into `systembolaget.json`.
- **`README.md`**: Project documentation in Swedish.
