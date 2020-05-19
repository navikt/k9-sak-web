import React, { FunctionComponent, useMemo, useState } from 'react';
import { FieldArray, InjectedFormProps, reset, change } from 'redux-form';
import { FormAction } from 'redux-form/lib/actions';
import { bindActionCreators } from 'redux';
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
import { required, hasValidDate } from '@fpsak-frontend/utils';
import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg';
import user from '@fpsak-frontend/assets/images/user.svg';
import users from '@fpsak-frontend/assets/images/users.svg';
import { Element } from 'nav-frontend-typografi';
import OmsorgsdagerGrunnlagDto from '../dto/OmsorgsdagerGrunnlagDto';
import { mapDtoTilFormValues, mapFormValuesTilDto } from '../dto/mapping';
import FormValues from '../types/FormValues';
import MidlertidigAlene from './MidlertidigAlene';
import { OverføringsretningEnum } from '../types/Overføring';
import { rammevedtakFormName } from './formNames';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Seksjon from './Seksjon';
import FastBreddeAligner from './FastBreddeAligner';
import AlleBarn from './AlleBarn';

interface RammevedtakFaktaFormProps {
  omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto;
  behandlingId: number;
  behandlingVersjon: number;
  readOnly?: boolean;
  formValues?: FormValues;
  resetForm?: (formName: string) => void;
  changeForm?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
}

export const RammevedtakFaktaFormImpl: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  omsorgsdagerGrunnlag,
  formValues,
  handleSubmit,
  behandlingId,
  behandlingVersjon,
  changeForm,
}) => {
  const { utvidetRett, uidentifiserteRammevedtak = [] } = omsorgsdagerGrunnlag;
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () => utvidetRett.filter(ur => !ur.fnrKroniskSyktBarn).filter(ur => !ur.idKroniskSyktBarn).length,
    [utvidetRett],
  );
  const [oppdaterteForms, setOppdaterteForms] = useState<string[]>([]);

  if (isEmpty(formValues)) {
    return null;
  }

  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
  const formName = `${behandlingFormPrefix}.${rammevedtakFormName}`;
  const oppdaterForm = (felt, nyVerdi, oppdatertFormName) => {
    changeForm(formName, felt, nyVerdi);
    setOppdaterteForms(verdi => verdi.concat(oppdatertFormName));
  };
  // const tilbakestill = () => {
  //   resetForm(formName);
  //   Object.values(OverføringstypeEnum).forEach(type =>
  //     Object.values(OverføringsretningEnum).forEach(retning => {
  //       resetForm(`${behandlingFormPrefix}.${overføringerFormName(type, retning)}`);
  //     }),
  //   );
  //   setOppdaterteForms([]);
  // };

  const {
    barn,
    overføringGir,
    overføringFår,
    fordelingGir,
    fordelingFår,
    koronaoverføringGir,
    koronaoverføringFår,
  } = formValues;

  return (
    <form onSubmit={handleSubmit}>
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
          oppdaterForm={oppdaterForm}
          oppdaterteForms={oppdaterteForms}
          readOnly
        />
        <VerticalSpacer thirtyTwoPx />
        <OverføringsdagerPanelgruppe
          overføringer={overføringGir}
          fordelinger={fordelingGir}
          koronaoverføringer={koronaoverføringGir}
          retning={OverføringsretningEnum.UT}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          oppdaterForm={oppdaterForm}
          oppdaterteForms={oppdaterteForms}
          readOnly
        />
      </Seksjon>
      <Seksjon bakgrunn="hvit" titleId="FaktaRammevedtak.Barn.Tittel" imgSrc={users}>
        <>
          {!barn.length && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
          <FieldArray name="barn" component={AlleBarn} props={{ barn, readOnly: true }} />
        </>
      </Seksjon>
      <Seksjon bakgrunn="grå" titleId="FaktaRammevedtak.ErMidlertidigAlene.Tittel" imgSrc={user}>
        <MidlertidigAlene readOnly />
      </Seksjon>
      {/* {!pristine && ( */}
      {/*  <> */}
      {/*    <VerticalSpacer twentyPx /> */}
      {/*    <BegrunnBekreftTilbakestillSeksjon */}
      {/*      begrunnField={ */}
      {/*        <TextAreaField */}
      {/*          label={<FormattedMessage id="FaktaRammevedtak.Begrunnelse" />} */}
      {/*          name="begrunnelse" */}
      {/*          validate={[required, minLength(3), maxLength(400), hasValidText]} */}
      {/*        /> */}
      {/*      } */}
      {/*      bekreftKnapp={ */}
      {/*        <Hovedknapp onClick={handleSubmit} htmlType="submit" disabled={!readOnly}> */}
      {/*          <FormattedMessage id="FaktaRammevedtak.Bekreft" /> */}
      {/*        </Hovedknapp> */}
      {/*      } */}
      {/*      tilbakestillKnapp={ */}
      {/*        <Knapp htmlType="button" mini onClick={tilbakestill}> */}
      {/*          <FormattedMessage id="FaktaRammevedtak.Tilbakestill" /> */}
      {/*        </Knapp> */}
      {/*      } */}
      {/*    /> */}
      {/*  </> */}
      {/* )} */}
    </form>
  );
};

const validate = (values: FormValues) => {
  if (isEmpty(values)) {
    return {};
  }
  const { midlertidigAleneansvar } = values;
  if (midlertidigAleneansvar.erMidlertidigAlene) {
    const req = required(midlertidigAleneansvar.tom);
    const tomError = req || hasValidDate(midlertidigAleneansvar.tom);
    if (tomError) {
      return {
        midlertidigAleneansvar: {
          tom: tomError,
        },
      };
    }
  }
  return {};
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { omsorgsdagerGrunnlag } = initialOwnProps;
  const onSubmit = values => mapFormValuesTilDto(values, omsorgsdagerGrunnlag);

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const formValues = getBehandlingFormValues(rammevedtakFormName, behandlingId, behandlingVersjon)(state) || {};

    return {
      initialValues: mapDtoTilFormValues(omsorgsdagerGrunnlag),
      behandlingFormPrefix,
      onSubmit,
      validate,
      formValues,
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetForm: reset,
      changeForm: change,
    },
    dispatch,
  );

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaFormImpl),
);
