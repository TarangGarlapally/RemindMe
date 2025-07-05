// Reminders script for Rem!ndMe Extension
// Updated for beautiful modern design

let allReminders = [];

document.addEventListener('DOMContentLoaded', function() {
    loadReminders();
    setupSearch();
});

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterReminders(searchTerm);
        });
    }
}

function parseTime(hours, minutes) { 
    let meridian = "";
    if (hours < 12) {
        meridian = "AM";
    } else {
        meridian = "PM";
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (hours > 12) {
        hours = hours - 12;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (hours === 0) {
        return "12:" + minutes + " " + meridian;
    }
    return hours + ":" + minutes + " " + meridian;
}

async function loadReminders() {
    try {
        showLoading();
        
        // Get reminders from service worker
        const response = await chrome.runtime.sendMessage({
            action: 'getReminders'
        });
        
        if (response && response.reminders) {
            allReminders = response.reminders;
            updateStatistics();
            displayReminders(allReminders);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading reminders:', error);
        showError('Error loading reminders');
    }
}

function showLoading() {
    const container = document.getElementById("allRemindersBox");
    const emptyState = document.getElementById("emptyState");
    
    if (container) container.innerHTML = '<div class="loading">Loading reminders...</div>';
    if (emptyState) emptyState.style.display = 'none';
}

function showEmptyState() {
    const container = document.getElementById("allRemindersBox");
    const emptyState = document.getElementById("emptyState");
    
    if (container) container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
}

function showError(message) {
    const container = document.getElementById("allRemindersBox");
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: white;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

function updateStatistics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    const totalReminders = allReminders.length;
    const todayReminders = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.timestamp * 1000);
        return reminderDate >= today && reminderDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;
    
    // Only count upcoming reminders for this week (future reminders within the week)
    const weekReminders = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.timestamp * 1000);
        const currentTime = Date.now();
        return reminderDate >= now && // Must be in the future
               reminderDate >= weekStart && // Must be this week or later
               reminderDate < weekEnd; // Must be before next week
    }).length;
    
    // Update statistics
    const totalElement = document.getElementById('totalReminders');
    const todayElement = document.getElementById('todayReminders');
    const weekElement = document.getElementById('weekReminders');
    
    if (totalElement) totalElement.textContent = totalReminders;
    if (todayElement) todayElement.textContent = todayReminders;
    if (weekElement) weekElement.textContent = weekReminders;
}

function filterReminders(searchTerm) {
    if (!searchTerm) {
        displayReminders(allReminders);
        return;
    }
    
    const filtered = allReminders.filter(reminder => 
        reminder.message.toLowerCase().includes(searchTerm) ||
        new Date(reminder.timestamp * 1000).toLocaleDateString().includes(searchTerm)
    );
    
    displayReminders(filtered);
}

function displayReminders(reminders) {
    const container = document.getElementById("allRemindersBox");
    const emptyState = document.getElementById("emptyState");
    
    if (!container) return;
    
    if (reminders.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Sort reminders by timestamp (earliest first)
    const sortedReminders = [...reminders].sort((a, b) => a.timestamp - b.timestamp);
    
    container.innerHTML = '';
    
    sortedReminders.forEach((reminder, index) => {
        const date = new Date(reminder.timestamp * 1000);
        const dateTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + 
                        " " + parseTime(date.getHours(), date.getMinutes());
        
        const reminderElement = document.createElement('div');
        reminderElement.id = reminder.timestamp;
        reminderElement.className = 'reminderTile';
        reminderElement.style.animationDelay = `${index * 0.1}s`;
        
        // Check if reminder is overdue
        const isOverdue = reminder.timestamp * 1000 < Date.now();
        const overdueClass = isOverdue ? 'overdue' : '';
        
        reminderElement.innerHTML = `
            <div class="reminderMessage ${overdueClass}">
                <div class="calendarIcon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="reminder-content">
                    <div class="dateTime ${isOverdue ? 'overdue-badge' : ''}">
                        ${dateTime} ${isOverdue ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                    </div>
                    <div class="reminder-text">${escapeHtml(reminder.message)}</div>
                </div>
            </div>
            <div class="reminderOptions">
                <button class="iconButton edit-btn" data-timestamp="${reminder.timestamp}" data-message="${escapeHtml(reminder.message)}" title="Edit reminder">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="iconButton delete-btn" data-timestamp="${reminder.timestamp}" title="Delete reminder">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners to buttons
        const editBtn = reminderElement.querySelector('.edit-btn');
        const deleteBtn = reminderElement.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            const timestamp = this.getAttribute('data-timestamp');
            const message = this.getAttribute('data-message');
            editReminder(timestamp, message);
        });
        
        deleteBtn.addEventListener('click', function() {
            const timestamp = this.getAttribute('data-timestamp');
            deleteReminder(timestamp);
        });
        
        container.appendChild(reminderElement);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function deleteReminder(timestamp) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'deleteReminder',
                timestamp: timestamp
            });
            
            if (response && response.success) {
                // Remove from local array
                allReminders = allReminders.filter(r => r.timestamp !== parseInt(timestamp));
                updateStatistics();
                loadReminders(); // Reload to refresh display
                
                // Show success message
                showToast('Reminder deleted successfully!', 'success');
            } else {
                showToast('Failed to delete reminder', 'error');
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
            showToast('Error deleting reminder', 'error');
        }
    }
}

async function editReminder(timestamp, currentMessage) {
    const newMessage = prompt('Edit reminder message:', currentMessage);
    if (newMessage !== null && newMessage.trim() !== '') {
        try {
            // Delete the old reminder
            await chrome.runtime.sendMessage({
                action: 'deleteReminder',
                timestamp: timestamp
            });
            
            // Create new reminder with same timestamp but new message
            const response = await chrome.runtime.sendMessage({
                action: 'setReminder',
                timestamp: timestamp,
                message: newMessage.trim()
            });
            
            if (response && response.success) {
                showToast('Reminder updated successfully!', 'success');
                loadReminders(); // Reload to refresh display
            } else {
                showToast('Failed to update reminder', 'error');
            }
        } catch (error) {
            console.error('Error updating reminder:', error);
            showToast('Error updating reminder', 'error');
        }
    }
}

function showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .overdue {
        opacity: 0.7;
    }
    
    .overdue-badge {
        background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
    }
`;
document.head.appendChild(style);