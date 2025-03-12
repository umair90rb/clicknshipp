import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { formatDate } from 'utils/format-date';
import { dateFormatForHistory } from 'constants/index';

export default function History({ orderHistory = [] }) {
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.4
        }
      }}
    >
      {orderHistory
        .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
        .map((h, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="textSecondary">{formatDate(dateFormatForHistory, h?.createdAt)}</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              {h?.event} {h?.user?.name ? 'by ' + h?.user?.name : ''}
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  );
}
