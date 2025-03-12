import React, { useState } from 'react';
import styled from 'styled-components';
import { format, addDays, isSameDay, isEqual, endOfWeek, startOfWeek, lastDayOfWeek, isWithinInterval } from 'date-fns';
import { getStartOfDay, getEndOfDay, subtractDays, isItToday, isItYesterday } from 'utils/format-date';
import { dateFormat } from 'constants/index';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered'
})(({ theme, isSelected, day, start, end }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme?.palette?.primary?.main || '#1976d2',
    color: theme?.palette?.primary?.contrastText || '#fff',
    '&:hover, &:focus': {
      backgroundColor: theme?.palette?.primary?.main || '#1976d2'
    }
  })
  // ...(isSameDay(day, start) && {
  //   borderTopLeftRadius: '50%',
  //   borderBottomLeftRadius: '50%'
  // }),
  // ...(isSameDay(day, end) && {
  //   borderTopRightRadius: '50%',
  //   borderBottomRightRadius: '50%'
  // }) not working properly
}));

function isSelected(day, start, end) {
  const normalizedDay = day && getStartOfDay(day);
  const normalizedStart = start && getStartOfDay(start);
  const normalizedEnd = end && getStartOfDay(end);

  if (isEqual(normalizedDay, normalizedStart)) return true;
  if (isEqual(normalizedDay, normalizedEnd)) return true;
  if (isWithinInterval(normalizedDay, { start: normalizedStart, end: normalizedEnd })) return true;

  return false;
}

function Day(props) {
  const { day, start, end, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      start={start}
      end={end}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isSelected(day, start, end)}
    />
  );
}

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
    'This week': [startOfWeek(new Date()), endOfWeek(new Date())],
    'Last week': [startOfWeek(subtractDays(7, new Date())), endOfWeek(subtractDays(7, new Date()))],
    'Last 7 days': [subtractDays(7, new Date()), new Date()],
    'This month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
    'Last month': [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    ],
    'Last 30 days': [subtractDays(30, new Date()), new Date()],
    'Last 90 days': [subtractDays(90, new Date()), new Date()],
    'Last 365 days': [subtractDays(365, new Date()), new Date()]
  };

  const handleRangeClick = (range) => {
    setStartDate(predefinedRanges[range][0]);
    onStartDateSelect(getStartOfDay(predefinedRanges[range][0], requiredFormat));
    setEndDate(predefinedRanges[range][1]);
    onEndDateSelect(getEndOfDay(predefinedRanges[range][1], requiredFormat));
    setSelectedRange(range);
    setIsPopupOpen(false);
  };

  const handleDateClick = (day) => {
    setSelectedRange('');
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
      onStartDateSelect(getStartOfDay(day, requiredFormat));
    } else {
      setEndDate(day);
      onEndDateSelect(getEndOfDay(day, requiredFormat));
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
              slots={{ day: Day }}
              slotProps={{
                day: {
                  start: startDate,
                  end: endDate
                }
              }}
            />
          </LocalizationProvider>
        </Popup>
      )}
    </Wrapper>
  );
};

export default DateRangePicker;
