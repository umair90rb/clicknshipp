import React, { Component } from 'react';
import styled from 'styled-components';

import { WarningIcon } from '../assets/images/icons/WarningIcon';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ global }) => (global ? '80vh' : '100%')};
  ${({ invertedColor, theme }) => invertedColor && `color: ${theme.palette.white};`}
  ${({ isHeader }) =>
    isHeader &&
    `
    position: absolute;
    flex-direction: row;
    height: 80px;
    width: 100%;
  `}
`;

const StyledText = styled.span`
  margin-top: 8px;
`;

class ErrorBoundary extends Component {
  state = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    const { children, global = false, invertedColor = false, isHeader = false } = this.props;
    const { error } = this.state;

    return error ? (
      <StyledWrapper global={global} invertedColor={invertedColor} isHeader={isHeader}>
        <WarningIcon />
        <StyledText>Something went wrong</StyledText>
      </StyledWrapper>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
