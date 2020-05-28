import React, { FunctionComponent, useMemo } from 'react';
import { InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg';
import user from '@fpsak-frontend/assets/images/user.svg';
import users from '@fpsak-frontend/assets/images/users.svg';
import { Element } from 'nav-frontend-typografi';
import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types';
import mapDtoTilFormValues from '../dto/mapping';
import FormValues from '../types/FormValues';
import MidlertidigAlene from './MidlertidigAlene';
import { OverføringsretningEnum } from '../types/Overføring';
import { rammevedtakFormName } from './formNames';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Seksjon from './Seksjon';
import FastBreddeAligner from './FastBreddeAligner';
import BarnVisning from './BarnVisning';

interface RammevedtakFaktaFormProps {
  rammevedtak: Rammevedtak[];
  behandlingId: number;
  behandlingVersjon: number;
  formValues?: FormValues;
}

export const RammevedtakFaktaFormImpl: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  rammevedtak,
  formValues,
  behandlingId,
  behandlingVersjon,
}) => {
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () => rammevedtak.filter(rv => rv.type === RammevedtakEnum.UTVIDET_RETT).filter(rv => !rv.utvidetRettFor).length,
    [rammevedtak],
  );

  const uidentifiserteRammevedtak = useMemo(() => rammevedtak.filter(rv => rv.type === RammevedtakEnum.UIDENTIFISERT), [
    rammevedtak,
  ]);

  if (isEmpty(formValues)) {
    return null;
  }

  const {
    barn,
    overføringGir,
    overføringFår,
    fordelingGir,
    fordelingFår,
    koronaoverføringGir,
    koronaoverføringFår,
    midlertidigAleneansvar,
  } = formValues;

  return (
    <>
      {uidentifiserteRammevedtak.length > 0 && (
        <>
          <AlertStripeAdvarsel>
            <FormattedMessage
              id="FaktaRammevedtak.UidentifiserteRammevedtak"
              values={{ antall: uidentifiserteRammevedtak.length }}
            />
          </AlertStripeAdvarsel>
          <VerticalSpacer sixteenPx />
        </>
      )}
      {utvidetRettUidentifiserteBarnAntall > 0 && (
        <>
          <AlertStripeAdvarsel>
            <FormattedMessage
              id="FaktaRammevedtak.UidentifisertUtvidetRett"
              values={{ antallRammevedtak: utvidetRettUidentifiserteBarnAntall }}
            />
          </AlertStripeAdvarsel>
          <VerticalSpacer sixteenPx />
        </>
      )}
      <Seksjon bakgrunn="grå" titleId="FaktaRammevedtak.Overføringer.Tittel" imgSrc={transferIcon}>
        <FastBreddeAligner
          rad={{ padding: '0 0 0 1em' }}
          kolonner={[
            {
              width: '225px',
              id: 'overføring.tittel.totalt',
              content: (
                <Element>
                  <FormattedMessage id="FaktaRammevedtak.Overføringer.Totalt" />
                </Element>
              ),
            },
            {
              width: '150px',
              id: 'overføring.tittel.type',
              content: (
                <Element>
                  <FormattedMessage id="FaktaRammevedtak.Overføringer.Type" />
                </Element>
              ),
            },
          ]}
        />
        <OverføringsdagerPanelgruppe
          overføringer={overføringFår}
          fordelinger={fordelingFår}
          koronaoverføringer={koronaoverføringFår}
          retning={OverføringsretningEnum.INN}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        <VerticalSpacer thirtyTwoPx />
        <OverføringsdagerPanelgruppe
          overføringer={overføringGir}
          fordelinger={fordelingGir}
          koronaoverføringer={koronaoverføringGir}
          retning={OverføringsretningEnum.UT}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      </Seksjon>
      <Seksjon bakgrunn="hvit" titleId="FaktaRammevedtak.Barn.Tittel" imgSrc={users}>
        <>
          {!barn.length && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
          {barn.map((barnet, index) => (
            <BarnVisning barnet={barnet} index={index} key={barnet.fødselsnummer} />
          ))}
        </>
      </Seksjon>
      <Seksjon bakgrunn="grå" titleId="FaktaRammevedtak.ErMidlertidigAlene.Tittel" imgSrc={user}>
        <MidlertidigAlene midlertidigAlene={midlertidigAleneansvar} />
      </Seksjon>
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { rammevedtak } = initialOwnProps;

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const formValues = getBehandlingFormValues(rammevedtakFormName, behandlingId, behandlingVersjon)(state) || {};

    return {
      initialValues: mapDtoTilFormValues(rammevedtak),
      behandlingFormPrefix,
      formValues,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaFormImpl),
);
