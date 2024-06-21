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
  isSameMonth,
  addDays,
  isWithinInterval
} from 'date-fns';
import moment from 'moment';
import { dateFormat } from 'constants/index';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 0px;
`;

const Popup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
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

const DateRangePicker = ({ requiredFormat = dateFormat, startPeriod, endPeriod, onStartDateSelect, onEndDateSelect }) => {
  const [startDate, setStartDate] = useState(startPeriod);
  const [endDate, setEndDate] = useState(endPeriod);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Today');

  const predefinedRanges = {
    Today: [new Date(), new Date()],
    Yesterday: [addDays(new Date(), -1), addDays(new Date(), -1)],
    'Last 7 days': [addDays(new Date(), -6), new Date()],
    'Last 30 days': [addDays(new Date(), -29), new Date()],
    'Last 90 days': [addDays(new Date(), -89), new Date()],
    'Last 365 days': [addDays(new Date(), -364), new Date()]
  };

  const handleRangeClick = (range) => {
    setStartDate(predefinedRanges[range][0]);
    onStartDateSelect(moment(predefinedRanges[range][0]).startOf('day').format(requiredFormat));
    setEndDate(predefinedRanges[range][1]);
    onEndDateSelect(moment(predefinedRanges[range][1]).endOf('day').format(requiredFormat));
    setSelectedRange(range);
    setIsPopupOpen(false);
  };

  const handleDateClick = (day) => {
    setSelectedRange('');
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
      onStartDateSelect(moment(day).startOf('day').format(requiredFormat));
    } else {
      setEndDate(day);
      onEndDateSelect(moment(day).endOf('day').format(requiredFormat));
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
    const startOfWeekDate = startOfWeek(monthStart);
    const endOfWeekDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startOfWeekDate;
    let formattedDate = '';

    while (day <= endOfWeekDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <Day
            key={day}
            isSelected={startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })}
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
    </Wrapper>
  );
};

export default DateRangePicker;
