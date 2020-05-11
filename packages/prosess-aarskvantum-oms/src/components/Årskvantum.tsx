import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { FlexRow, Image } from '@fpsak-frontend/shared-components/index';
import pieChart from '@fpsak-frontend/assets/images/pie_chart.svg';
import info from '@fpsak-frontend/assets/images/information-circle.svg';
import CounterBox from './CounterBox';
import BorderedContainer from './BorderedContainer';
import ComboCounterBox from './ComboCounterBox';

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
  const opprinneligeDager = totaltAntallDager - antallDagerArbeidsgiverDekker;

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
        <ComboCounterBox
          counterBoxes={[
            {
              bigCount: opprinneligeDager,
              label: { textId: 'Årskvantum.OpprinneligeDager' },
              theme: 'grå',
              infoText: {
                content: (
                  <FormattedMessage
                    id="Årskvantum.OpprinneligeDager.InfoText"
                    values={{ totaltAntallDager, antallDagerArbeidsgiverDekker }}
                  />
                ),
              },
              border: false,
            },
            {
              bigCount: antallKoronadager,
              label: { textId: 'Årskvantum.Koronadager', borderTop: true, borderBottom: true },
              theme: 'oransje',
              border: false,
              infoText: {
                content: <FormattedMessage id="Årskvantum.Koronadager.InfoText" />,
                borderTop: true,
                borderBottom: true,
              },
            },
            {
              bigCount: opprinneligeDager + antallKoronadager,
              label: { textId: 'Årskvantum.TotaleDager', bold: true },
              theme: 'hvit',
              border: false,
              infoText: {
                content: <FormattedMessage id="Årskvantum.TotaleDager.InfoText" />,
              },
            },
          ]}
        />
        {restdagerErSmittevernsdager && (
          <CounterBox
            bigCount={smittevernsdager.dager}
            smallCount={
              smittevernsdager.timer ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: smittevernsdager.timer }} />
              ) : null
            }
            label={{ textId: 'Årskvantum.Smittevernsdager' }}
            theme="lyseblå"
            infoText={{ content: <FormattedMessage id="Årskvantum.Smittevernsdager.EkstraTekst" /> }}
          />
        )}
        <CounterBox
          bigCount={forbrukt.dager}
          smallCount={
            forbrukt.timer ? <FormattedMessage id="Årskvantum.Timer" values={{ timer: forbrukt.timer }} /> : null
          }
          label={{ textId: 'Årskvantum.ForbrukteDager' }}
          theme="rød"
          infoText={{
            content: dagerInfotrygd.timer ? (
              <FormattedMessage
                id="Årskvantum.DagerOgTimerFraInfotrygd"
                values={{ dager: dagerInfotrygd.dager, timer: dagerInfotrygd.timer }}
              />
            ) : (
              <FormattedMessage id="Årskvantum.DagerFraInfotrygd" values={{ dager: dagerInfotrygd.dager }} />
            ),
          }}
        />
        <CounterBox
          bigCount={rest.dager}
          smallCount={rest.timer ? <FormattedMessage id="Årskvantum.Timer" values={{ timer: rest.timer }} /> : null}
          label={{ textId: 'Årskvantum.Restdager' }}
          theme="grønn"
          infoText={{ content: <FormattedMessage id="Årskvantum.Restdager.InfoText" /> }}
        />
      </CounterContainer>
    </BorderedContainer>
  );
};

export default Årskvantum;
