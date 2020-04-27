import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Theme = 'standard' | 'rød' | 'grønn';

const farger = {
  rød: {
    border: '#C30000',
    background: '#F1D8D4',
  },
  grønn: {
    border: '#06893A',
    background: '#CDE7D8',
  },
  standard: {
    border: '#78706A',
    background: 'inherit',
  },
};

interface CounterBoxProps {
  bigCount: string | number;
  smallCount?: string | number;
  label: string | ReactNode;
  theme: Theme;
}

const containerHeight = '150px';
const containerWidth = '240px';

const Container = styled.div`
  height: ${containerHeight};
  width: ${containerWidth};
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => farger[theme].border};
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const Count = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: baseline;
  & > *:not(:last-child) {
    margin-right: 0.3em;
  }
  flex-basis: 67%;
  padding-top: 0.1em;
  font-weight: 300;
  margin-top: auto;
`;

const BigCount = styled.span`
  font-size: 4em;
`;

const SmallCount = styled.span`
  font-size: 2.7em;
`;

const LabelPanel = styled.div`
  background-color: ${({ color }) => color || 'inherit'};
  font-size: 1.3em;
  font-weight: 600;
  flex-basis: 33%;
  margin: ${({ theme }) => (theme === 'standard' ? '0 15px' : 'none')};
  border-top: ${({ theme }) => (theme === 'standard' ? '1px solid grey' : 'none')};
  background-color: ${({ theme }) => farger[theme].background};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CounterBox = ({ bigCount, smallCount, label, theme }: CounterBoxProps) => (
  <Container theme={theme}>
    <Count>
      <BigCount>{bigCount}</BigCount>
      {smallCount && <SmallCount>{smallCount}</SmallCount>}
    </Count>
    <LabelPanel theme={theme}>{label}</LabelPanel>
  </Container>
);

export default CounterBox;
