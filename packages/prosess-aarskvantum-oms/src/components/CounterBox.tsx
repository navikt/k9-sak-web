import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Theme = 'grå' | 'rød' | 'grønn' | 'lyseblå' | 'oransje';

const farger = {
  rød: {
    border: '#C30000',
    background: '#F1D8D4',
  },
  grønn: {
    border: '#06893A',
    background: '#CDE7D8',
  },
  lyseblå: {
    border: '#66CBEC',
    background: '#E0F5FB',
  },
  oransje: {
    border: '#FFA733',
    background: '#FFE9CC',
  },
  grå: {
    border: '#78706A',
    background: '#E9E7E7',
  },
};

interface CounterBoxProps {
  bigCount: string | number;
  smallCount?: string | number | ReactNode;
  label: string | ReactNode;
  theme: Theme;
  infoText?: string | ReactNode;
}

const containerHeight = '60px';
const containerWidth = '100%';

const Container = styled.div`
  height: ${containerHeight};
  width: ${containerWidth};
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => farger[theme].border};
  text-align: center;
  display: flex;
`;

const Count = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: baseline;
  min-width: 130px;
  font-weight: 300;
  margin-top: -4px;
`;

const BigCount = styled.div`
  font-size: 3em;
`;

const SmallCount = styled.div`
  font-size: 1.5em;
`;

const LabelPanel = styled.div<{ theme: Theme }>`
  font-size: 1.3em;
  font-weight: 600;
  min-width: 250px;
  margin: ${({ theme }) => (theme === 'standard' ? '0 15px' : 'none')};
  background-color: ${({ theme }) => farger[theme].background};
  display: flex;
  align-items: center;
  padding-left: 1em;
`;

const InfoText = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
  text-align: start;
`;

const CounterBox = ({ bigCount, smallCount, label, theme, infoText }: CounterBoxProps) => (
  <Container theme={theme}>
    <Count>
      <BigCount>{bigCount}</BigCount>
      {smallCount && <SmallCount>{smallCount}</SmallCount>}
    </Count>
    <LabelPanel theme={theme}>{label}</LabelPanel>
    <InfoText>{infoText}</InfoText>
  </Container>
);

export default CounterBox;
