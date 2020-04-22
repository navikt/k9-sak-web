import React, { FunctionComponent, useMemo } from 'react';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form/src/behandlingForm';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import BarnInput from './BarnInput';
import OmsorgsdagerGrunnlagDto from '../dto/OmsorgsdagerGrunnlagDto';
import { mapDtoTilFormValues, mapFormValuesTilDto } from '../dto/mapping';

interface RammevedtakFaktaFormProps {
  omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any) => void;
  readOnly?: boolean;
}

const rammevedtakFormName = 'rammevedtakFormName';

const AlleBarn = ({ fields }) =>
  fields.map(field => <BarnInput barn={field} namePrefix={field} key={field.fødselsnummer} />);

const RammevedtakFaktaForm: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  omsorgsdagerGrunnlag,
}) => {
  const { utvidetRett } = omsorgsdagerGrunnlag;
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () =>
      utvidetRett.filter(ur => !ur.tilleggsinfo.fnrKroniskSyktBarn).filter(ur => !ur.tilleggsinfo.idKroniskSyktBarn)
        .length,
    [utvidetRett],
  );

  return (
    <>
      {utvidetRettUidentifiserteBarnAntall > 0 && (
        <AlertStripeFeil>
          <FormattedMessage
            id="FaktaRammevedtak.UidentifisertUtvidetRett"
            values={{ antallRammevedtak: utvidetRettUidentifiserteBarnAntall }}
          />
        </AlertStripeFeil>
      )}
      <FieldArray name="barn" component={AlleBarn} />
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { submitCallback, omsorgsdagerGrunnlag } = initialOwnProps;
  const onSubmit = values => submitCallback(mapFormValuesTilDto(values, omsorgsdagerGrunnlag));

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

    return {
      initialValues: mapDtoTilFormValues(omsorgsdagerGrunnlag),
      behandlingFormPrefix,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaForm),
);
