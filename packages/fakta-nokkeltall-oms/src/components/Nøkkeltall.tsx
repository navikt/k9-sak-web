import * as React from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { FormattedMessage } from 'react-intl';
import {
  Banner,
  Container,
  Dager,
  DagerOgTimer,
  KnappStyle,
  Overskrift,
  OverskriftTekst,
  Timer,
  DetaljOverskrift,
  Detalj,
  DetaljInfotekst,
} from './NøkkeltallStyles';

export interface Nøkkeltalldetalj {
  antallDager: number;
  antallTimer?: React.ReactNode;
  overskrifttekstId: string;
  infotekstContent?: React.ReactNode;
}

export interface NøkkeltallProps {
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
