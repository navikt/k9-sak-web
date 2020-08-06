import * as React from 'react';
import styled from 'styled-components';
import NavFrontendChevron from 'nav-frontend-chevron';
import { FormattedMessage } from 'react-intl';
import knappStyle from './toggleKnappStyle';

export interface Nøkkeltalldetalj {
  antallDager: number;
  antallTimer?: React.ReactNode;
  overskrifttekstId: string;
  infotekstContent?: React.ReactNode;
}

interface NøkkeltallProps {
  overskrift: {
    antallDager: number;
    antallTimer?: React.ReactNode;
    overskrifttekstId: string;
  };
  detaljer: Nøkkeltalldetalj[];
  viserDetaljer: boolean;
  visDetaljer: () => void;
  farge: string;
}

const Container = styled.article<Pick<NøkkeltallProps, 'viserDetaljer'>>`
  margin-bottom: 0.5em;
  ${({ viserDetaljer }) =>
    viserDetaljer &&
    `
    box-shadow: 0 3px 3px -1px #c6c2bf;
    outline: 1px solid #f3f4f4;
    padding-bottom: 1em;
  `}
`;

const KnappStyle = styled.span`
  ${knappStyle}
`;

const Overskrift = styled.button<Pick<NøkkeltallProps, 'farge'>>`
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

const DagerOgTimer = styled.span<{ erDetalj: boolean }>`
  flex: 0 0 ${({ erDetalj }) => (erDetalj ? `85px` : `80px`)};
  font-size: 1.3em;
  display: flex;
  align-items: baseline;

  > * {
    display: inline;
  }
`;

const Dager = styled.span<{ erDetalj: boolean }>`
  margin-left: ${({ erDetalj }) => (erDetalj ? `calc(0.5em + 5px)` : `0.5em`)};
  ${({ erDetalj }) => !erDetalj && `font-weight: bold;`}
`;

const Timer = styled.span`
  font-size: 0.7em;
  margin: 0 0.5em;
`;

const OverskriftTekst = styled.strong`
  font-size: 0.8em;
`;

const Banner = styled.span`
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

const Detalj = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
`;

const DetaljOverskrift = styled.span`
  flex: 0 0 160px;
  margin: 0 0.5em;
  font-weight: bold;
  font-size: 0.9em;
`;

const DetaljInfotekst = styled.span`
  margin-right: 1em;
  font-size: 0.9em;
`;

const Nøkkeltall: React.FunctionComponent<NøkkeltallProps> = ({
  overskrift,
  detaljer,
  viserDetaljer,
  visDetaljer,
  farge,
}) => {
  return (
    <Container viserDetaljer={viserDetaljer} aria-expanded={viserDetaljer}>
      <Overskrift farge={farge} onClick={visDetaljer}>
        <DagerOgTimer erDetalj={false}>
          <Dager erDetalj={false}>{overskrift.antallDager}</Dager>
          {overskrift.antallTimer && <Timer>{overskrift.antallTimer}</Timer>}
        </DagerOgTimer>
        <Banner>
          <OverskriftTekst>
            <FormattedMessage id={overskrift.overskrifttekstId} />
          </OverskriftTekst>
          <KnappStyle>
            {viserDetaljer ? (
              <FormattedMessage id="Nøkkeltall.SkjulUtregning" />
            ) : (
              <FormattedMessage id="Nøkkeltall.VisUtregning" />
            )}
            <NavFrontendChevron type={viserDetaljer ? 'opp' : 'ned'} />
          </KnappStyle>
        </Banner>
      </Overskrift>
      {viserDetaljer &&
        detaljer.map(({ antallDager, antallTimer, overskrifttekstId, infotekstContent }) => (
          <Detalj key={overskrifttekstId}>
            <DagerOgTimer erDetalj>
              <Dager erDetalj>{antallDager}</Dager>
              {antallTimer && <Timer>{antallTimer}</Timer>}
            </DagerOgTimer>
            <DetaljOverskrift>
              <FormattedMessage id={overskrifttekstId} />
            </DetaljOverskrift>
            <DetaljInfotekst>{infotekstContent}</DetaljInfotekst>
          </Detalj>
        ))}
    </Container>
  );
};

export default Nøkkeltall;
