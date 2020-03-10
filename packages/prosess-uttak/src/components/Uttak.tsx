import React, { FunctionComponent, useState } from 'react';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import svgKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import svgMann from '@fpsak-frontend/assets/images/mann.svg';
import TimeLineControl from '@fpsak-frontend/tidslinje/src/components/TimeLineControl';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';

import Behandlinger from './types/UttakTypes';
import BehandlingPersonMap from './types/BehandlingPersonMap';
import { ResultattypeEnum } from './types/Resultattype';
import UttakPeriode from './types/UttakPeriode';

interface UttakkProps {
  behandlinger: Behandlinger;
  behandlingPersonMap: BehandlingPersonMap;
}

const erKvinne = kjønnkode => kjønnkode === navBrukerKjonn.KVINNE;

export const mapRader = (
  behandlinger: Behandlinger,
  behandlingPersonMap: BehandlingPersonMap,
  intl,
): TidslinjeRad<UttakPeriode>[] =>
  Object.entries(behandlinger).map(([behandlingsId, behandling]) => {
    const { kjønnkode } = behandlingPersonMap[behandlingsId];
    const kvinne = erKvinne(kjønnkode);
    const ikon = {
      imageText: intl.formatMessage({ id: 'Person.ImageText' }),
      title: intl.formatMessage({ id: kvinne ? 'Person.Woman' : 'Person.Man' }),
      src: kvinne ? svgKvinne : svgMann,
    };

    const perioder = Object.entries(behandling.perioder).map(([fomTom, periode], index) => {
      const [fom, tom] = fomTom.split('/');
      const resultat = periode.resultat_type;

      return {
        fom,
        tom,
        id: `${behandlingsId}-${index}`,
        hoverText: `${periode.grad}% ${intl.formatMessage({ id: 'UttakPanel.Gradering' })}`,
        className: classNames({
          gradert: periode.grad < 100,
          godkjentPeriode: resultat === ResultattypeEnum.INNVILGET,
          avvistPeriode: resultat === ResultattypeEnum.AVSLÅTT,
          undefined: resultat === ResultattypeEnum.UAVKLART,
        }),
        periodeinfo: {
          ...periode,
          behandlingsId,
        },
      };
    });

    return {
      ikon,
      id: behandlingsId,
      perioder,
    };
  });

const Uttak: FunctionComponent<UttakkProps> = ({ behandlinger, behandlingPersonMap }) => {
  const [valgtPeriode, velgPeriode] = useState<UttakPeriode | null>();
  const [timelineRef, setTimelineRef] = useState();
  const intl = useIntl();

  const rader = mapRader(behandlinger, behandlingPersonMap, intl);

  const selectHandler = eventProps => {
    const nyValgtPeriode = rader.flatMap(rad => rad.perioder).find(item => item.id === eventProps.items[0]);
    velgPeriode(nyValgtPeriode);
    eventProps.event.preventDefault();
  };

  const openPeriodInfo = () => {
    // TODO: er det vits i å ha en egen knapp for å velge/lukke første periode. lukker selv om det ikke er første som er valgt
  };

  const goBackward = () => {
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };
    timeline.setWindow(newWindowTimes);
  };

  const goForward = () => {
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  };

  const zoomIn = () => {
    const timeline = timelineRef.current.$el;
    timeline.zoomIn(0.5);
  };

  const zoomOut = () => {
    const timeline = timelineRef.current.$el;
    timeline.zoomOut(0.5);
  };

  // TODO (Anders): bruk kodeverk for tekster
  const resultattekst = () => {
    switch (valgtPeriode.periodeinfo.resultat_type) {
      case ResultattypeEnum.INNVILGET:
        return 'Resultat: Innvilget';
      case ResultattypeEnum.AVSLÅTT:
        return 'Resultat: Avslått';
      default:
        return 'Resultat: Uavklart';
    }
  };

  return (
    <Row>
      <Column xs="12">
        <Tidslinje
          rader={rader}
          velgPeriode={selectHandler}
          valgtPeriode={valgtPeriode}
          setTimelineRef={setTimelineRef}
        />
        <TimeLineControl
          goBackwardCallback={goBackward}
          goForwardCallback={goForward}
          zoomInCallback={zoomIn}
          zoomOutCallback={zoomOut}
          openPeriodInfo={openPeriodInfo}
          selectedPeriod={valgtPeriode}
        />
        {valgtPeriode && (
          <>
            <Undertittel>
              <FormattedMessage id="UttakPanel.ValgtPeriode" />
            </Undertittel>
            <Normaltekst>
              {`Fødselsnummer: ${behandlingPersonMap[valgtPeriode.periodeinfo.behandlingsId].fnr}`}
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage
                id="UttakPanel.FOM"
                values={{ fom: moment(valgtPeriode.fom).format(DDMMYYYY_DATE_FORMAT) }}
              />
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage
                id="UttakPanel.TOM"
                values={{ tom: moment(valgtPeriode.tom).format(DDMMYYYY_DATE_FORMAT) }}
              />
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage id="UttakPanel.GraderingProsent" values={{ grad: valgtPeriode.periodeinfo.grad }} />
            </Normaltekst>
            <Normaltekst>{resultattekst()}</Normaltekst>
            {valgtPeriode.periodeinfo.årsak && <Normaltekst>{`Årsak: ${valgtPeriode.periodeinfo.årsak}`}</Normaltekst>}
          </>
        )}
      </Column>
    </Row>
  );
};

export default Uttak;
