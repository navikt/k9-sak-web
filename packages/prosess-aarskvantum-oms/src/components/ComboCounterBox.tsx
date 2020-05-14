import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import CounterBox, { CounterBoxProps } from './CounterBox';

interface ComboCounterBoxProps {
  counterBoxes: CounterBoxProps[];
}

const ComboContainer = styled.div`
  border: 1px solid;
  width: 100%;
`;

const ComboCounterBox: FunctionComponent<ComboCounterBoxProps> = ({ counterBoxes }) => (
  <ComboContainer>
    {counterBoxes.map(props => (
      <CounterBox {...props} />
    ))}
  </ComboContainer>
);

export default ComboCounterBox;
