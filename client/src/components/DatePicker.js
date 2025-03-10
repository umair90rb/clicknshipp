import React, { useState } from 'react';
import styled from 'styled-components';
import { format, addDays } from 'date-fns';
import moment from 'moment';
import { dateFormat } from 'constants/index';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  background: none;
  border-radius: 4px;
  margin: 0;
  width: 100%;
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

const DateRangePicker = ({ requiredFormat = dateFormat, startPeriod, endPeriod, onStartDateSelect, onEndDateSelect }) => {
  const [startDate, setStartDate] = useState(startPeriod);
  const [endDate, setEndDate] = useState(endPeriod);
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
      setIsPopupOpen(false);
    }
  };

  const handleInputClick = () => {
    setIsPopupOpen(!isPopupOpen);
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={startDate}
              onChange={(newValue) => handleDateClick(newValue)}
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              views={['year', 'month', 'day']}
            />
          </LocalizationProvider>
        </Popup>
      )}
    </Wrapper>
  );
};

export default DateRangePicker;
