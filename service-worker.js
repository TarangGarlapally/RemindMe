// Service Worker for Rem!ndMe Extension
// Handles alarms and notifications in Manifest V3

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  handleReminder(alarm.name);
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Rem!ndMe extension installed');
});

// Handle reminder when alarm fires
async function handleReminder(timestamp) {
  try {
    // Get reminder data from storage
    const result = await chrome.storage.local.get([timestamp]);
    const reminderData = result[timestamp];
    
    if (reminderData) {
      const messages = reminderData.split('$');
      
      // Play notification sound
      await playNotificationSound();
      
      // Show notification for each message
      messages.forEach((message, index) => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Rem!ndMe',
          message: message.trim(),
          priority: 2
        });
      });
      
      // Remove the reminder from storage
      await chrome.storage.local.remove([timestamp]);
      
      // Clear the alarm
      await chrome.alarms.clear(timestamp);
    }
  } catch (error) {
    console.error('Error handling reminder:', error);
  }
}

// Play notification sound
async function playNotificationSound() {
  try {
    // Create audio context and play sound
    const audioContext = new AudioContext();
    const response = await fetch('1_second_tone.mp3');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setReminder') {
    setReminder(request.timestamp, request.message);
    sendResponse({ success: true });
  } else if (request.action === 'getReminders') {
    getReminders().then(reminders => {
      sendResponse({ reminders });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'deleteReminder') {
    deleteReminder(request.timestamp);
    sendResponse({ success: true });
  }
});

// Set a new reminder
async function setReminder(timestamp, message) {
  try {
    // Store reminder data
    const existingData = await chrome.storage.local.get([timestamp]);
    let reminderData = message;
    
    if (existingData[timestamp]) {
      reminderData = existingData[timestamp] + '$' + message;
    }
    
    await chrome.storage.local.set({ [timestamp]: reminderData });
    
    // Create alarm
    const alarmTime = parseInt(timestamp) * 1000;
    await chrome.alarms.create(timestamp, {
      when: alarmTime
    });
    
    console.log(`Reminder set for ${new Date(alarmTime)}`);
  } catch (error) {
    console.error('Error setting reminder:', error);
  }
}

// Get all reminders
async function getReminders() {
  try {
    const result = await chrome.storage.local.get(null);
    const reminders = [];
    
    for (const [timestamp, message] of Object.entries(result)) {
      if (!isNaN(timestamp)) { // Only include numeric timestamps
        reminders.push({
          timestamp: parseInt(timestamp),
          message: message
        });
      }
    }
    
    return reminders.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
}

// Delete a reminder
async function deleteReminder(timestamp) {
  try {
    await chrome.storage.local.remove([timestamp]);
    await chrome.alarms.clear(timestamp);
    console.log(`Reminder deleted for timestamp: ${timestamp}`);
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
} 