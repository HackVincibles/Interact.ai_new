import React, { useMemo } from 'react';
import './TimeSlotSelector.css';

export default function TimeSlotSelector({ selectedDate, selectedTime, interval = 30, onSelectTime }) {
  
  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    
    // Check if the selected date is today
    const isToday = selectedDate && 
                    selectedDate.getDate() === now.getDate() && 
                    selectedDate.getMonth() === now.getMonth() && 
                    selectedDate.getFullYear() === now.getFullYear();

    // Generate times from 8:00 AM to 10:00 PM
    for (let h = 8; h <= 22; h++) {
      for (let m = 0; m < 60; m += interval) {
        if (isToday) {
          // If it's today, block past times (adding a 30 min buffer for practicality)
          if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes() + 15)) {
            continue;
          }
        }
        
        const hourStr = String(h).padStart(2, '0');
        const minStr = String(m).padStart(2, '0');
        const timeVal = `${hourStr}:${minStr}`;
        
        // Format for display (AM/PM)
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const displayVal = `${displayHour}:${minStr} ${ampm}`;
        
        slots.push({ value: timeVal, display: displayVal });
      }
    }
    return slots;
  }, [selectedDate, interval]);

  return (
    <div className="time-selector-container animate-fade-in">
      <div className="time-selector-header">
        <p>Available times for {selectedDate ? selectedDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'this day'}</p>
      </div>
      
      {timeSlots.length === 0 ? (
        <div className="time-slots-empty">
          No available times left for today. Please select a future date.
        </div>
      ) : (
        <div className="time-slots-grid">
          {timeSlots.map(slot => (
            <button
              key={slot.value}
              className={`time-slot-btn ${selectedTime === slot.value ? 'selected' : ''}`}
              onClick={() => onSelectTime(slot.value)}
            >
              {slot.display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
