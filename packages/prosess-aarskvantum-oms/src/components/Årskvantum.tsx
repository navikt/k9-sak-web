import React, { FunctionComponent } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import styled from 'styled-components';
import moment from 'moment';
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
  forbrukteDager?: number;
  forbruktTid?: string;
  restdager?: number;
  restTid?: string;
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
  padding-right: 1em;

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
    timer: timerDesimal !== 0 ? Number.parseFloat((timerDesimal * 7.5).toFixed(1).replace('.0', '')) : null,
  };
};

export const beregnDagerTimer = (dagerTimer: string) => {
  const duration = moment.duration(dagerTimer);
  const totaltAntallTimer = duration.days() * 24 + duration.hours() + duration.minutes() / 60;

  return {
    dager: Math.floor(totaltAntallTimer / 7.5),
    timer: totaltAntallTimer % 7.5,
  };
};

const Årskvantum: FunctionComponent<ÅrskvantumProps> = ({
  totaltAntallDager,
  antallKoronadager = 0,
  restdager,
  restTid,
  forbrukteDager,
  forbruktTid,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd,
  benyttetRammemelding,
}) => {
  const rest = restTid ? beregnDagerTimer(restTid) : konverterDesimalTilDagerOgTimer(restdager);
  const restdagerErSmittevernsdager = rest.dager < 0 || rest.timer < 0;

  const forbrukt = forbruktTid ? beregnDagerTimer(forbruktTid) : konverterDesimalTilDagerOgTimer(forbrukteDager);
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
        {restdagerErSmittevernsdager && (
          <CounterBox
            count={{
              bigCount: Math.abs(rest.dager),
              smallCount: rest.timer ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: Math.abs(rest.timer) }} />
              ) : null,
            }}
            label={{ textId: 'Årskvantum.Smittevernsdager' }}
            theme="lyseblå"
            infoText={{ content: <FormattedMessage id="Årskvantum.Smittevernsdager.InfoText" /> }}
          />
        )}
        <ComboCounterBox
          counterBoxes={[
            {
              count: { bigCount: opprinneligeDager },
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
              count: { bigCount: antallKoronadager, borderBottom: true },
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
              count: { bigCount: opprinneligeDager + antallKoronadager },
              label: { textId: 'Årskvantum.TotaleDager', bold: true, borderRight: true, borderLeft: true },
              theme: 'hvit',
              border: false,
              infoText: {
                content: <FormattedMessage id="Årskvantum.TotaleDager.InfoText" />,
              },
            },
          ]}
        />
        <CounterBox
          count={{
            bigCount: forbrukt.dager,
            smallCount: forbrukt.timer ? (
              <FormattedMessage id="Årskvantum.Timer" values={{ timer: forbrukt.timer }} />
            ) : null,
          }}
          label={{ textId: 'Årskvantum.ForbrukteDager' }}
          theme="rød"
          infoText={{
            content: (
              <FormattedHTMLMessage id="Årskvantum.DagerFraInfotrygd" values={{ dager: antallDagerInfotrygd }} />
            ),
          }}
        />
        <CounterBox
          count={{
            bigCount: restdagerErSmittevernsdager ? 0 : rest.dager,
            smallCount:
              rest.timer && rest.timer > 0 ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: rest.timer }} />
              ) : null,
          }}
          label={{ textId: 'Årskvantum.Restdager' }}
          theme="grønn"
          infoText={{ content: <FormattedMessage id="Årskvantum.Restdager.InfoText" /> }}
        />
      </CounterContainer>
    </BorderedContainer>
  );
};

export default Årskvantum;
