// Popup script for RemindMe Extension
// Updated for beautiful modern design

document.addEventListener('DOMContentLoaded', function() {
	// Add event listeners
	document.getElementById("form").addEventListener("submit", (e) => {
		e.preventDefault();
		setReminder();
	});

	// Character counter for message input
	const messageInput = document.getElementById("msg");
	const charCounter = document.getElementById("charCount");
	
	messageInput.addEventListener("input", (e) => {
		validateInput(e);
		updateCharCounter(e.target.value.length);
	});

	// Set minimum datetime to current time
	setMinDateTime();

	// Show current time
	updateCurrentTime();
	setInterval(updateCurrentTime, 1000);
});

function updateCurrentTime() {
	const now = new Date();
	const timeString = now.toLocaleTimeString([], { 
		hour: '2-digit', 
		minute: '2-digit',
		second: '2-digit'
	});
	const dateString = now.toLocaleDateString([], { 
		weekday: 'short', 
		month: 'short', 
		day: 'numeric' 
	});
	
	document.getElementById("now").innerHTML = `
		<div class="time">${timeString}</div>
		<div class="date">${dateString}</div>
	`;
}

function updateCharCounter(count) {
	const charCounter = document.getElementById("charCount");
	charCounter.textContent = count;
	
	// Change color when approaching limit
	if (count >= 45) {
		charCounter.style.color = '#e74c3c';
	} else if (count >= 35) {
		charCounter.style.color = '#f39c12';
	} else {
		charCounter.style.color = '#95a5a6';
	}
}

function setMinDateTime() {
	const dateInput = document.getElementById("date");
	const now = new Date();
	
	// Add 1 minute to current time to ensure future datetime
	now.setMinutes(now.getMinutes() + 1);
	
	// Format datetime for input field (YYYY-MM-DDTHH:MM)
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	
	const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
	dateInput.min = minDateTime;
	
	// Set default value to 1 hour from now
	const defaultTime = new Date(now.getTime() + 60 * 60 * 1000);
	const defaultYear = defaultTime.getFullYear();
	const defaultMonth = String(defaultTime.getMonth() + 1).padStart(2, '0');
	const defaultDay = String(defaultTime.getDate()).padStart(2, '0');
	const defaultHours = String(defaultTime.getHours()).padStart(2, '0');
	const defaultMinutes = String(defaultTime.getMinutes()).padStart(2, '0');
	
	const defaultDateTime = `${defaultYear}-${defaultMonth}-${defaultDay}T${defaultHours}:${defaultMinutes}`;
	dateInput.value = defaultDateTime;
}

async function setReminder() {
	const submitBtn = document.getElementById("submit");
	const originalText = submitBtn.innerHTML;
	
	try {
		// Show loading state
		submitBtn.classList.add('loading');
		submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Setting...';
		
		const message = document.getElementById("msg").value.trim();
		const dateValue = document.getElementById("date").value;
		
		if (!message || !dateValue) {
			showError("Please fill in both message and date/time fields!");
			return;
		}
		
		const timestamp = Math.floor(new Date(dateValue).getTime() / 1000);
		const currentTime = Math.floor(Date.now() / 1000);
		
		if (timestamp <= currentTime) {
			showError("Please select a future date and time!");
			return;
		}
		
		// Send message to service worker to set reminder
		const response = await chrome.runtime.sendMessage({
			action: 'setReminder',
			timestamp: timestamp.toString(),
			message: message
		});
		
		if (response && response.success) {
			showSuccess("Reminder set successfully!");
			document.getElementById("form").reset();
			setMinDateTime(); // Reset datetime to default
			updateCharCounter(0); // Reset character counter
		} else {
			showError("Failed to set reminder. Please try again.");
		}
	} catch (error) {
		console.error('Error setting reminder:', error);
		showError("An error occurred while setting the reminder.");
	} finally {
		// Reset button state
		submitBtn.classList.remove('loading');
		submitBtn.innerHTML = originalText;
	}
}

function validateInput(e) {
	const str = e.target.value;
	if (str.slice(-1) === "$") {
		document.getElementById("msg").value = str.substring(0, str.length - 1);
	}
}

function showSuccess(message) {
	const successElement = document.getElementById("successMessage");
	successElement.querySelector('span').textContent = message;
	successElement.style.display = 'flex';
	
	// Hide after 3 seconds
	setTimeout(() => {
		successElement.style.display = 'none';
	}, 3000);
}

function showError(message) {
	// Create error message element
	const errorElement = document.createElement('div');
	errorElement.className = 'error-message';
	errorElement.style.cssText = `
		position: fixed;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		background: linear-gradient(135deg, #e74c3c, #c0392b);
		color: white;
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
		z-index: 1000;
		animation: slideDown 0.3s ease-out;
	`;
	errorElement.innerHTML = `
		<i class="fas fa-exclamation-triangle"></i>
		<span>${message}</span>
	`;
	
	document.body.appendChild(errorElement);
	
	// Remove after 4 seconds
	setTimeout(() => {
		if (errorElement.parentNode) {
			errorElement.style.animation = 'slideUp 0.3s ease-in';
			setTimeout(() => {
				if (errorElement.parentNode) {
					errorElement.parentNode.removeChild(errorElement);
				}
			}, 300);
		}
	}, 4000);
}

// Add CSS for error animation
const style = document.createElement('style');
style.textContent = `
	@keyframes slideUp {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-100%);
			opacity: 0;
		}
	}
	
	.error-message i {
		font-size: 1.1rem;
	}
`;
document.head.appendChild(style);