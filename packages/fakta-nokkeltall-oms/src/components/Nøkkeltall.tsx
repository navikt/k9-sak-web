import * as React from 'react';
import styled from 'styled-components';
import NavFrontendChevron from 'nav-frontend-chevron';
import { FormattedMessage } from 'react-intl';

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
    border: 1px solid #f3f4f4;
    padding-bottom: 1em;
  `}
`;

const KnappStyle = styled.span`
  color: #0067c5;
  text-decoration: underline;
  padding: 0.2em;
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

const DagerOgTimer = styled.span`
  width: 80px;
  font-size: 1.3em;

  > * {
    display: inline;
  }
`;

const Dager = styled.strong`
  margin-left: 0.5em;
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

const Nøkkeltall: React.FunctionComponent<NøkkeltallProps> = ({
  overskrift,
  detaljer,
  viserDetaljer,
  visDetaljer,
  farge,
}) => {
  return (
    <Container viserDetaljer={viserDetaljer}>
      <Overskrift farge={farge} onClick={visDetaljer}>
        <DagerOgTimer>
          <Dager>{overskrift.antallDager}</Dager>
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
          {/* <Flatknapp mini kompakt onClick={visDetaljer} htmlType="button"> */}
          {/*  {viserDetaljer ? ( */}
          {/*    <FormattedMessage id="Nøkkeltall.SkjulUtregning" /> */}
          {/*  ) : ( */}
          {/*    <FormattedMessage id="Nøkkeltall.VisUtregning" /> */}
          {/*  )} */}
          {/*  <NavFrontendChevron type={viserDetaljer ? 'opp' : 'ned'} /> */}
          {/* </Flatknapp> */}
        </Banner>
      </Overskrift>
      {viserDetaljer &&
        detaljer.map(({ antallDager, antallTimer, overskrifttekstId, infotekstContent }) => (
          <React.Fragment key={overskrifttekstId}>
            <DagerOgTimer>
              <Dager>{antallDager}</Dager>
              {antallTimer && <Timer>{antallTimer}</Timer>}
            </DagerOgTimer>
          </React.Fragment>
        ))}
    </Container>
  );
};

export default Nøkkeltall;
