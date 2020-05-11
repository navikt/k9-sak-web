import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

type Theme = 'grå' | 'rød' | 'grønn' | 'lyseblå' | 'oransje' | 'hvit';

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
  hvit: {
    border: 'grey',
    background: 'white',
  },
};

export interface CounterBoxProps {
  bigCount: string | number;
  smallCount?: string | number | ReactNode;
  label: {
    textId: string;
    bold?: boolean;
    borderTop?: boolean;
    borderBottom?: boolean;
  };
  theme: Theme;
  infoText: {
    content: ReactNode;
    borderTop?: boolean;
    borderBottom?: boolean;
  };
  border?: boolean;
}

const containerHeight = '60px';
const containerWidth = '100%';

const borderTopFn = ({ borderTop, theme }) => borderTop && `border-top: 1px solid ${farger[theme].border};`;
const borderBottomFn = ({ borderBottom, theme }) => borderBottom && `border-bottom: 1px solid ${farger[theme].border};`;

const Container = styled.div<{ theme: Theme; border: boolean }>`
  height: ${containerHeight};
  width: ${containerWidth};
  background-color: #ffffff;
  text-align: center;
  display: flex;
  ${({ border, theme }) => border && `border: 1px solid ${farger[theme].border};`}
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

const LabelPanel = styled.div<{ theme: Theme; bold: boolean; borderTop: boolean; borderBottom: boolean }>`
  font-size: 1.3em;
  font-weight: ${({ bold }) => (bold ? `600` : `500`)};
  min-width: 250px;
  margin: ${({ theme }) => (theme === 'standard' ? '0 15px' : 'none')};
  background-color: ${({ theme }) => farger[theme].background};
  display: flex;
  align-items: center;
  padding-left: 1em;
  ${borderTopFn}
  ${borderBottomFn}
`;

const InfoText = styled.div<{ borderTop: boolean; borderBottom: boolean; theme: Theme }>`
  display: flex;
  align-items: center;
  padding-left: 1em;
  text-align: start;
  width: 100%;
  ${borderTopFn}
  ${borderBottomFn}
`;

const CounterBox = ({ bigCount, smallCount, label, theme, infoText, border = true }: CounterBoxProps) => (
  <Container border={border} theme={theme}>
    <Count>
      <BigCount>{bigCount}</BigCount>
      {smallCount && <SmallCount>{smallCount}</SmallCount>}
    </Count>
    <LabelPanel theme={theme} bold={label.bold} borderTop={label.borderTop} borderBottom={label.borderBottom}>
      <FormattedMessage id={label.textId} />
    </LabelPanel>
    <InfoText borderTop={infoText.borderTop} borderBottom={infoText.borderBottom} theme={theme}>
      {infoText.content}
    </InfoText>
  </Container>
);

export default CounterBox;
