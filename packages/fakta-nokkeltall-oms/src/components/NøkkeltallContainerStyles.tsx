import styled from 'styled-components';
import knappStyle from './toggleKnappStyle';

export const OverskriftContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const Overskrift = styled.h3`
  font-size: 1em;
  font-weight: bold;
  margin: 0;
  color: black;

  img {
    height: 24px;
    width: 24px;
    margin-right: 0.5em;
    margin-bottom: 0.1ex;
  }
`;

export const ToggleDetaljerKnapp = styled.button`
  ${knappStyle}
  &:focus {
    outline: 2px solid #0067c5;
  }
  img {
    margin-left: 0.5em;
    height: 24px;
    width: 24px;
    pointer-events: none;
  }
`;
