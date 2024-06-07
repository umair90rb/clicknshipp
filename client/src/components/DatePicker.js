// DateRangePicker.js
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays
} from 'date-fns';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 5px;
`;

const Popup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  z-index: 1000;
  display: flex;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;

const SidebarItem = styled.button`
  padding: 10px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  &.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
  }
`;

const Calendar = styled.div`
  display: flex;
  flex-direction: column;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const Day = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.isSelected ? '#007bff' : 'transparent')};
  color: ${(props) => (props.isSelected ? 'white' : props.isCurrentMonth ? 'black' : '#ccc')};

  &:hover {
    background-color: ${(props) => (!props.isSelected ? '#f0f0f0' : '')};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &.cancel {
    background-color: #ccc;
    margin-right: 10px;

    &:hover {
      background-color: #999;
    }
  }
`;

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Today');

  const predefinedRanges = {
    Today: [new Date(), new Date()],
    Yesterday: [addDays(new Date(), -1), addDays(new Date(), -1)],
    'Last 7 days': [addDays(new Date(), -6), new Date()],
    'Last 30 days': [addDays(new Date(), -29), new Date()],
    'Last 90 days': [addDays(new Date(), -89), new Date()],
    'Last 365 days': [addDays(new Date(), -364), new Date()],
    'Last month': [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
    'Last 12 months': [addMonths(new Date(), -11), new Date()],
    'Last year': [startOfMonth(subMonths(new Date(), 12)), endOfMonth(subMonths(new Date(), 1))]
  };

  const handleRangeClick = (range) => {
    setStartDate(predefinedRanges[range][0]);
    setEndDate(predefinedRanges[range][1]);
    setSelectedRange(range);
    setIsPopupOpen(false);
  };

  const handleDateClick = (day) => {
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
    } else if (day < startDate) {
      setEndDate(startDate);
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleInputClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';
    return (
      <CalendarHeader>
        <button onClick={prevMonth}>‹</button>
        <div>{format(currentMonth, dateFormat)}</div>
        <button onClick={nextMonth}>›</button>
      </CalendarHeader>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <CalendarBody>
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </CalendarBody>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <Day
            key={day}
            isSelected={(startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))}
            isCurrentMonth={isSameMonth(day, monthStart)}
            onClick={() => handleDateClick(cloneDay)}
          >
            {formattedDate}
          </Day>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="row">
          {days}
        </div>
      );
      days = [];
    }
    return <CalendarBody>{rows}</CalendarBody>;
  };

  const renderSidebar = () => {
    return (
      <Sidebar>
        {Object.keys(predefinedRanges).map((range) => (
          <SidebarItem key={range} className={selectedRange === range ? 'selected' : ''} onClick={() => handleRangeClick(range)}>
            {range}
          </SidebarItem>
        ))}
      </Sidebar>
    );
  };

  return (
    <Wrapper>
      <Input
        type="text"
        readOnly
        onClick={handleInputClick}
        value={startDate && endDate ? `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}` : ''}
        placeholder="Select date range"
      />
      {isPopupOpen && (
        <Popup>
          {renderSidebar()}
          <Calendar>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </Calendar>
        </Popup>
      )}
      <ButtonWrapper>
        <Button className="cancel" onClick={() => setIsPopupOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsPopupOpen(false)}>Apply</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default DateRangePicker;
