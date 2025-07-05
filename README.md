# Rem!ndMe

A modern Chrome extension for setting reminders and notifications. Built with Manifest V3 for the latest web extension specifications.

## Features

- Set reminders with custom messages and date/time
- Desktop notifications with sound alerts
- View and manage all your reminders
- Edit or delete existing reminders
- Modern UI with Bootstrap styling
- Manifest V3 compatible

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Rem!ndMe extension will appear in your extensions list

## Usage

1. Click the Rem!ndMe extension icon in your browser toolbar
2. Enter your reminder message
3. Select the date and time for your reminder
4. Click "Set Reminder"
5. You'll receive a desktop notification with sound when the time comes
6. Click "View all reminders" to manage your existing reminders

## Technical Details

- **Manifest Version**: 3 (Latest Chrome extension specification)
- **Background**: Service Worker for efficient resource usage
- **Storage**: Chrome Storage API for reliable data persistence
- **Notifications**: Native browser notifications with sound
- **Alarms**: Chrome Alarms API for precise timing

## Files Structure

- `manifest.json` - Extension configuration (Manifest V3)
- `service-worker.js` - Background service worker
- `popup.html/js` - Main extension popup interface
- `reminders.html/js` - Reminders management page
- `css/` - Bootstrap and custom styles
- `js/` - JavaScript libraries

## Permissions

- `storage` - To save reminder data
- `notifications` - To show desktop notifications
- `alarms` - To schedule reminder triggers

Feel free to use and modify!
