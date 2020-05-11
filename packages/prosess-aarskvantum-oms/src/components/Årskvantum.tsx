import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { FlexRow, Image } from '@fpsak-frontend/shared-components/index';
import pieChart from '@fpsak-frontend/assets/images/pie_chart.svg';
import info from '@fpsak-frontend/assets/images/information-circle.svg';
import CounterBox from './CounterBox';
import BorderedContainer from './BorderedContainer';

interface ÅrskvantumProps {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number;
  restdager: number;
  antallDagerInfotrygd: number;
  benyttetRammemelding: boolean;
}

const CounterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 0.25em 0.5em;
  }
`;

const InfoRammemelding = styled.span`
  font-size: 17px;
  font-weight: 400;
  display: flex;
  align-items: center;

  & img {
    width: 20px;
    height: 20px;
  }
`;

export const konverterDesimalTilDagerOgTimer = (desimal: number) => {
  const dager = Math.floor(desimal);
  const timerDesimal = desimal % 1;

  return {
    dager,
    timer: timerDesimal > 0 ? Number.parseFloat((timerDesimal * 7.5).toFixed(1).replace('.0', '')) : null,
  };
};

const Årskvantum: FunctionComponent<ÅrskvantumProps> = ({
  totaltAntallDager,
  antallKoronadager = 0,
  restdager,
  forbrukteDager,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd,
  benyttetRammemelding,
}) => {
  const restdagerErSmittevernsdager = restdager < 0;

  const forbrukt = konverterDesimalTilDagerOgTimer(forbrukteDager);
  const rest = restdagerErSmittevernsdager ? { dager: 0, timer: 0 } : konverterDesimalTilDagerOgTimer(restdager);
  const dagerInfotrygd = konverterDesimalTilDagerOgTimer(antallDagerInfotrygd);
  const smittevernsdager = restdagerErSmittevernsdager && konverterDesimalTilDagerOgTimer(Math.abs(restdager));

  return (
    <BorderedContainer
      heading={
        <Undertittel tag="h3">
          <FlexRow spaceBetween>
            <span>
              <Image src={pieChart} />
              <FormattedMessage id="Årskvantum.Heading" />
            </span>
            {benyttetRammemelding && (
              <InfoRammemelding>
                <Image src={info} />
                <FormattedMessage id="Årskvantum.Rammemelding" />
              </InfoRammemelding>
            )}
          </FlexRow>
        </Undertittel>
      }
    >
      <CounterContainer>
        <CounterBox
          bigCount={totaltAntallDager - antallDagerArbeidsgiverDekker}
          label={<FormattedMessage id="Årskvantum.TotaleDager" />}
          theme="grå"
          infoText={
            <FormattedMessage
              id="Årskvantum.TotaldagerInfo"
              values={{ totaltAntallDager, antallDagerArbeidsgiverDekker }}
            />
          }
        />
        <CounterBox
          bigCount={antallKoronadager}
          label={<FormattedMessage id="Årskvantum.Koronadager" />}
          theme="oransje"
        />
        {restdagerErSmittevernsdager && (
          <CounterBox
            bigCount={smittevernsdager.dager}
            smallCount={
              smittevernsdager.timer ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: smittevernsdager.timer }} />
              ) : null
            }
            label={<FormattedMessage id="Årskvantum.Smittevernsdager" />}
            theme="lyseblå"
            infoText={<FormattedMessage id="Årskvantum.Smittevernsdager.EkstraTekst" />}
          />
        )}
        <CounterBox
          bigCount={forbrukt.dager}
          smallCount={
            forbrukt.timer ? <FormattedMessage id="Årskvantum.Timer" values={{ timer: forbrukt.timer }} /> : null
          }
          label={<FormattedMessage id="Årskvantum.ForbrukteDager" />}
          theme="rød"
          infoText={
            dagerInfotrygd.timer ? (
              <FormattedMessage
                id="Årskvantum.DagerOgTimerFraInfotrygd"
                values={{ dager: dagerInfotrygd.dager, timer: dagerInfotrygd.timer }}
              />
            ) : (
              <FormattedMessage id="Årskvantum.DagerFraInfotrygd" values={{ dager: dagerInfotrygd.dager }} />
            )
          }
        />
        <CounterBox
          bigCount={rest.dager}
          smallCount={rest.timer ? <FormattedMessage id="Årskvantum.Timer" values={{ timer: rest.timer }} /> : null}
          label={<FormattedMessage id="Årskvantum.Restdager" />}
          theme="grønn"
        />
      </CounterContainer>
    </BorderedContainer>
  );
};

export default Årskvantum;
