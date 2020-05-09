import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Theme = 'standard' | 'rød' | 'grønn' | 'lyseblå' | 'oransje';

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
  standard: {
    border: '#78706A',
    background: 'inherit',
  },
};

interface CounterBoxProps {
  bigCount: string | number;
  smallCount?: string | number | ReactNode;
  label: string | ReactNode;
  theme: Theme;
  bottomText?: string | ReactNode;
}

const containerHeight = '180px';
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
  flex-basis: 50%;
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

const themeBorder = ({ theme }) => (theme === 'standard' ? '1px solid grey' : 'none');

const LabelPanel = styled.div<{ theme: Theme }>`
  font-size: 1.3em;
  font-weight: 600;
  flex-basis: 30%;
  margin: ${({ theme }) => (theme === 'standard' ? '0 15px' : 'none')};
  border-bottom: ${themeBorder};
  border-top: ${themeBorder};
  background-color: ${({ theme }) => farger[theme].background};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BottomText = styled.div`
  flex-basis: 20%;
  padding-top: 5px;
`;

const CounterBox = ({ bigCount, smallCount, label, theme, bottomText }: CounterBoxProps) => (
  <Container theme={theme}>
    <Count>
      <BigCount>{bigCount}</BigCount>
      {smallCount && <SmallCount>{smallCount}</SmallCount>}
    </Count>
    <LabelPanel theme={theme}>{label}</LabelPanel>
    <BottomText>{bottomText}</BottomText>
  </Container>
);

export default CounterBox;
