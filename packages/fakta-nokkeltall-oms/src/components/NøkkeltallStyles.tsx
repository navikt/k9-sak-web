import styled from 'styled-components';
import knappStyle from './toggleKnappStyle';
import { NøkkeltallProps } from './Nøkkeltall';

export const Container = styled.article<Pick<NøkkeltallProps, 'viserDetaljer'>>`
  margin-bottom: 0.5em;
  ${({ viserDetaljer }) =>
    viserDetaljer &&
    `
    box-shadow: 0 3px 3px -1px #c6c2bf;
    outline: 1px solid #f3f4f4;
    padding-bottom: 1em;
  `}
`;

export const KnappStyle = styled.span`
  ${knappStyle}
`;

export const Overskrift = styled.button<Pick<NøkkeltallProps, 'farge'>>`
  border-left: ${({ farge }) => `5px solid ${farge}`};
  display: flex;
  flex-wrap: nowrap;
  border-right: none;
  border-top: none;
  border-bottom: none;
  width: 100%;
  background-color: inherit;
  align-items: stretch;
  padding: 0;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    ${KnappStyle} {
      outline: 2px solid #0067c5;
      border-radius: 5px;
    }
  }

  > * {
    padding: 0.1em 0;
  }
`;

export const DagerOgTimer = styled.span<{ erDetalj: boolean }>`
  flex: 0 0 ${({ erDetalj }) => (erDetalj ? `85px` : `80px`)};
  font-size: 1.3em;
  display: flex;
  align-items: baseline;

  > * {
    display: inline;
  }
`;

export const Dager = styled.span<{ erDetalj: boolean }>`
  margin-left: ${({ erDetalj }) => (erDetalj ? `calc(0.5em + 5px)` : `0.5em`)};
  ${({ erDetalj }) => !erDetalj && `font-weight: bold;`}
`;

export const Timer = styled.span`
  font-size: 0.7em;
  margin: 0 0.5em;
`;

export const OverskriftTekst = styled.strong`
  font-size: 0.8em;
`;

export const Banner = styled.span`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f4f4;
  > * {
    margin: 0 0.5em;
  }

  ${OverskriftTekst} {
    font-size: 1em;
  }
`;

export const Detalj = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
`;

export const DetaljOverskrift = styled.span`
  flex: 0 0 160px;
  margin: 0 0.5em;
  font-weight: bold;
  font-size: 0.9em;
`;

export const DetaljInfotekst = styled.span`
  margin-right: 1em;
  font-size: 0.9em;
`;
