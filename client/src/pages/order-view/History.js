import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import moment from 'moment';

export default function History({ orderHistory = [] }) {
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.4
        }
      }}
    >
      {orderHistory.map((h, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="textSecondary">{moment(h?.createdAt).format('DD MMM h:mm a')}</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>{h.event}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
