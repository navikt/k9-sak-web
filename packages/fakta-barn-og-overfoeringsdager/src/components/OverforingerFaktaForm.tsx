import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import isEmpty from 'just-is-empty';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg?react';
import { Element } from 'nav-frontend-typografi';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import mapDtoTilFormValues from '../dto/mapping';
import FormValues from '../types/FormValues';
import { OverføringsretningEnum } from '../types/Overføring';
import { rammevedtakFormName } from './formNames';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Seksjon from './Seksjon';
import FastBreddeAligner from './FastBreddeAligner';

interface OverforingerFaktaFormProps {
  rammevedtak: Rammevedtak[];
  behandlingId: number;
  behandlingVersjon: number;
  formValues?: FormValues;
}

export const OverforingerFaktaFormImpl = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rammevedtak,

  formValues,
  behandlingId,
  behandlingVersjon,
}: OverforingerFaktaFormProps & InjectedFormProps) => {
  if (isEmpty(formValues)) {
    return null;
  }

  const { overføringGir, overføringFår, fordelingGir, fordelingFår, koronaoverføringGir, koronaoverføringFår } =
    formValues;

  const detFinnesOverføringer =
    [
      ...overføringGir,
      ...overføringFår,
      ...fordelingGir,
      ...fordelingFår,
      ...koronaoverføringGir,
      ...koronaoverføringFår,
    ].length > 0;

  return (
    <Seksjon bakgrunn="grå" title={{ id: 'FaktaRammevedtak.Overføringer.Tittel' }} imgSrc={transferIcon} medMarg>
      {detFinnesOverføringer ? (
        <>
          <FlexRow spaceBetween>
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
            <Hjelpetekst>
              <FormattedMessage id="FaktaRammevedtak.Overføringer.Hjelpetekst" values={{ br: <br /> }} />
            </Hjelpetekst>
          </FlexRow>
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
        </>
      ) : (
        <FormattedMessage id="FaktaRammevedtak.Overføringer.IngenOverføringer" />
      )}
    </Seksjon>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverforingerFaktaFormProps) => {
  const { rammevedtak } = initialOwnProps;

  return (state, { behandlingId, behandlingVersjon }: OverforingerFaktaFormProps) => {
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
  })(OverforingerFaktaFormImpl),
);
