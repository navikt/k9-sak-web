import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { hasValidDate, hasValidFodselsnummer, hasValidName, required } from '@fpsak-frontend/utils';
import { DatepickerField, InputField, SelectField } from '@fpsak-frontend/form';
import { VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import vergeType from '../kodeverk/vergeType';

/**
 * RegistrereVergeFaktaForm
 *
 * Formkomponent. Registrering og oppdatering av verge.
 */
export const RegistrereVergeFaktaForm = ({ intl, readOnly, vergetyper, alleMerknaderFraBeslutter, valgtVergeType }) => (
  <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_VERGE]}>
    <div>
      <Row>
        <Column xs="5">
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
        </Column>
      </Row>
      {valgtVergeType && (
        <>
          <Row>
            <Column xs="3">
              <InputField
                bredde="XXL"
                name="navn"
                label={{ id: 'Verge.Navn' }}
                validate={[required, hasValidName]}
                readOnly={readOnly}
              />
            </Column>
            <Column xs="3">
              {valgtVergeType !== vergeType.ADVOKAT && (
                <InputField
                  bredde="S"
                  name="fnr"
                  label={{ id: 'Verge.FodselsNummer' }}
                  validate={[required, hasValidFodselsnummer]}
                  readOnly={readOnly}
                />
              )}
              {valgtVergeType === vergeType.ADVOKAT && (
                <InputField
                  bredde="S"
                  name="organisasjonsnummer"
                  label={{ id: 'Verge.Organisasjonsnummer' }}
                  validate={[required]}
                  readOnly={readOnly}
                />
              )}
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <Row>
            <Column xs="2">
              <DatepickerField
                name="gyldigFom"
                label={{ id: 'Verge.PeriodeFOM' }}
                validate={[required, hasValidDate]}
                readOnly={readOnly}
              />
            </Column>
            <Column xs="2">
              <DatepickerField
                name="gyldigTom"
                label={{ id: 'Verge.PeriodeTOM' }}
                validate={[hasValidDate]}
                readOnly={readOnly}
              />
            </Column>
          </Row>
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
