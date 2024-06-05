import { HGrid } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import { DatepickerField, InputField, SelectField } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidDate, hasValidFodselsnummer, hasValidName, required } from '@fpsak-frontend/utils';

import vergeType from '../kodeverk/vergeType';

/**
 * RegistrereVergeFaktaForm
 *
 * Formkomponent. Registrering og oppdatering av verge.
 */
export const RegistrereVergeFaktaForm = ({ intl, readOnly, vergetyper, alleMerknaderFraBeslutter, valgtVergeType }) => (
  <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_VERGE]}>
    <div>
      <HGrid gap="1" columns={{ xs: '5fr 7fr' }}>
        <SelectField
          name="vergeType"
          label={intl.formatMessage({ id: 'Verge.TypeVerge' })}
          placeholder={intl.formatMessage({ id: 'Verge.TypeVerge' })}
          validate={[required]}
          selectValues={vergetyper.map(vt => (
            <option key={vt.kode} value={vt.kode}>
              {vt.navn}
            </option>
          ))}
          readOnly={readOnly}
        />
      </HGrid>
      {valgtVergeType && (
        <>
          <HGrid gap="1" columns={{ xs: '3fr 3fr 6fr' }}>
            <InputField
              bredde="XXL"
              name="navn"
              label={{ id: 'Verge.Navn' }}
              validate={[required, hasValidName]}
              readOnly={readOnly}
            />
            <div>
              {valgtVergeType !== vergeType.ADVOKAT && (
                <InputField
                  htmlSize={14}
                  name="fnr"
                  label={{ id: 'Verge.FodselsNummer' }}
                  validate={[required, hasValidFodselsnummer]}
                  readOnly={readOnly}
                />
              )}
              {valgtVergeType === vergeType.ADVOKAT && (
                <InputField
                  htmlSize={14}
                  name="organisasjonsnummer"
                  label={{ id: 'Verge.Organisasjonsnummer' }}
                  validate={[required]}
                  readOnly={readOnly}
                />
              )}
            </div>
          </HGrid>
          <VerticalSpacer eightPx />
          <HGrid gap="1" columns={{ xs: '2fr 2fr 8fr' }}>
            <DatepickerField
              name="gyldigFom"
              label={{ id: 'Verge.PeriodeFOM' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
            <DatepickerField
              name="gyldigTom"
              label={{ id: 'Verge.PeriodeTOM' }}
              validate={[hasValidDate]}
              readOnly={readOnly}
            />
          </HGrid>
        </>
      )}
    </div>
  </FaktaGruppe>
);

RegistrereVergeFaktaForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  vergetyper: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  valgtVergeType: PropTypes.string,
};

RegistrereVergeFaktaForm.defaultProps = {
  vergetyper: [],
  valgtVergeType: undefined,
};

RegistrereVergeFaktaForm.buildInitialValues = verge => ({
  navn: verge.navn,
  gyldigFom: verge.gyldigFom,
  gyldigTom: verge.gyldigTom,
  fnr: verge.fnr,
  organisasjonsnummer: verge.organisasjonsnummer,
  vergeType: verge.vergeType ? verge.vergeType : undefined,
});

RegistrereVergeFaktaForm.transformValues = values => ({
  vergeType: values.vergeType,
  navn: values.navn,
  fnr: values.fnr,
  organisasjonsnummer: values.organisasjonsnummer,
  gyldigFom: values.gyldigFom,
  gyldigTom: values.gyldigTom,
  kode: aksjonspunktCodes.AVKLAR_VERGE,
});

export default RegistrereVergeFaktaForm;
