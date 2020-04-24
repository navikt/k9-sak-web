import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { VerticalSpacer, Image } from '@fpsak-frontend/shared-components/index';
import pieChart from '@fpsak-frontend/assets/images/pie_chart.svg';
import ÅrskvantumForbrukteDager from '../dto/ÅrskvantumForbrukteDager';
import CounterBox from './CounterBox';
import BorderedContainer from './BorderedContainer';

interface ÅrskvantumProps {
  årskvantum: ÅrskvantumForbrukteDager;
}

const CounterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 0.5em;
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

const Årskvantum: FunctionComponent<ÅrskvantumProps> = ({ årskvantum }) => {
  const { totaltAntallDager, restdager, forbrukteDager, antallDagerArbeidsgiverDekker } = årskvantum;
  const forbrukt = konverterDesimalTilDagerOgTimer(forbrukteDager);
  const rest = konverterDesimalTilDagerOgTimer(restdager);

  return (
    <BorderedContainer
      heading={
        <Undertittel tag="h3">
          <Image src={pieChart} />
          <FormattedMessage id="Årskvantum.Heading" />
        </Undertittel>
      }
    >
      <CounterContainer>
        <div>
          <CounterBox
            bigCount={`${totaltAntallDager - antallDagerArbeidsgiverDekker}*`}
            label={<FormattedMessage id="Årskvantum.TotaleDager" />}
            theme="standard"
          />
          <VerticalSpacer eightPx />
          <FormattedMessage
            id="Årskvantum.TotaldagerInfo"
            values={{ totaltAntallDager, antallDagerArbeidsgiverDekker }}
          />
        </div>
        <CounterBox
          bigCount={forbrukt.dager}
          smallCount={forbrukt.timer ? `${forbrukt.timer}t` : null}
          label={<FormattedMessage id="Årskvantum.ForbrukteDager" />}
          theme="rød"
        />
        <CounterBox
          bigCount={rest.dager}
          smallCount={rest.timer ? `${rest.timer}t` : null}
          label={<FormattedMessage id="Årskvantum.Restdager" />}
          theme="grønn"
        />
      </CounterContainer>
    </BorderedContainer>
  );
};

export default Årskvantum;
