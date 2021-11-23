import { createSelector } from 'reselect';
import { isBehandlingFormDirty, getBehandlingFormInitialValues, getBehandlingFormValues } from '@fpsak-frontend/form';

export const formNameAvklarAktiviteter = 'avklarAktiviteterForm';

export const formNameVurderFaktaBeregning = 'vurderFaktaBeregningForm';

export const MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD = 'manuellOverstyringRapportertInntekt';

const getPeriodeIndex = (state, ownProps) => ownProps.vilkaarPeriodeFieldArrayIndex;

const getBehandlingFormValuesAvklarAktiviteter = (state, ownProps) =>
  getBehandlingFormValues(formNameAvklarAktiviteter, ownProps.behandlingId, ownProps.behandlingVersjon)(state);

export const getFormValuesForAvklarAktiviteter = createSelector(
  [getBehandlingFormValuesAvklarAktiviteter, getPeriodeIndex],
  (values, index) => values?.avklareAktiviteterListe ? values.avklareAktiviteterListe[index] : values,
);

export const getFormValuesAktivitetList = createSelector(
  [getBehandlingFormValuesAvklarAktiviteter],
  values => values?.avklareAktiviteterListe ? values.avklareAktiviteterListe: [values],
);

const getInitialValuesAvklarAktiviteter = (state, ownProps) =>
getBehandlingFormInitialValues(
  formNameAvklarAktiviteter,
  ownProps.behandlingId,
  ownProps.behandlingVersjon,
)(state);

export const getFormInitialValuesForAvklarAktiviteter = createSelector(
  [getInitialValuesAvklarAktiviteter, getPeriodeIndex],
  (values, index) => values?.avklareAktiviteterListe ? values.avklareAktiviteterListe[index] : values,
);

export const getFormInitialValuesAktivitetList = createSelector(
  [getInitialValuesAvklarAktiviteter],
  values => values?.avklareAktiviteterListe ? values.avklareAktiviteterListe: [values],
);

const getBehandlingFormValuesFakta = (state, ownProps) =>
  getBehandlingFormValues(formNameVurderFaktaBeregning, ownProps.behandlingId, ownProps.behandlingVersjon)(state);

export const getFormValuesForBeregning = createSelector(
  [getBehandlingFormValuesFakta, getPeriodeIndex],
  (values, index) => (values?.vurderFaktaListe ? values.vurderFaktaListe[index] : values),
);

export const getFormValuesFaktaList = createSelector(
  [getBehandlingFormValuesFakta],
  (values) => (values?.vurderFaktaListe ? values.vurderFaktaListe : [values]),
);

const getInitialValuesFakta = (state, ownProps) =>
  getBehandlingFormInitialValues(
  formNameVurderFaktaBeregning,
  ownProps.behandlingId,
  ownProps.behandlingVersjon,
)(state);

export const getFormInitialValuesForBeregning = createSelector(
  [getInitialValuesFakta, getPeriodeIndex],
  (values, index) => (values?.vurderFaktaListe ? values.vurderFaktaListe[index] : values),
);

export const isBeregningFormDirty = createSelector(
  [
    (state, ownProps) =>
      isBehandlingFormDirty(formNameVurderFaktaBeregning, ownProps.behandlingId, ownProps.behandlingVersjon)(state),
  ],
  values => values,
);
