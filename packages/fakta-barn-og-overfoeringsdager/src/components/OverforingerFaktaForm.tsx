import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { HelpText, Label } from '@navikt/ds-react';
import isEmpty from 'just-is-empty';
import React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import mapDtoTilFormValues from '../dto/mapping';
import FormValues from '../types/FormValues';
import { OverføringsretningEnum } from '../types/Overføring';
import FastBreddeAligner from './FastBreddeAligner';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Seksjon from './Seksjon';
import { rammevedtakFormName } from './formNames';

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
                    <Label size="small" as="p">
                      Totalt
                    </Label>
                  ),
                },
                {
                  width: '150px',
                  id: 'overføring.tittel.type',
                  content: (
                    <Label size="small" as="p">
                      Type
                    </Label>
                  ),
                },
              ]}
            />
            <HelpText>
              <FormattedMessage id="FaktaRammevedtak.Overføringer.Hjelpetekst" values={{ br: <br /> }} />
            </HelpText>
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
        Det er ikke registrert noen overføringer eller fordelinger av dager
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
