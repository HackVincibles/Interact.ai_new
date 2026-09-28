import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarDateSelector.css';

export default function CalendarDateSelector({ selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
    date.setHours(0,0,0,0);
    
    const isPast = date < today;
    const isSelected = selectedDate && date.getTime() === new Date(selectedDate).setHours(0,0,0,0);
    
    days.push(
      <button 
        key={`day-${d}`} 
        className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => !isPast && onSelectDate(date)}
        disabled={isPast}
      >
        {d}
      </button>
    );
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-container animate-fade-in">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth} disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}>
          <ChevronLeft size={20} />
        </button>
        <div className="calendar-month-name">{monthName}</div>
        <button className="calendar-nav-btn" onClick={handleNextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid-header">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="calendar-dow">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {days}
      </div>
    </div>
  );
}
