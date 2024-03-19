import { behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ariaCheck } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldArray, getFormInitialValues, change as reduxFormChange, reset as reduxFormReset } from 'redux-form';

import { Button } from '@navikt/ds-react';
import NyPeriode from './NyPeriode';
import PeriodeRad from './PeriodeRad';
import SlettPeriodeModal from './SlettPeriodeModal';

const FORM_NAME = 'TilkjentYtelseForm';

const createNewPerioder = (perioder, id: string, values: any) => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

interface OwnProps {
  readOnly: boolean;
  behandlingFormPrefix: string;
  perioder?: any[];
  openForms: boolean;
  reduxFormChange: (...args: any[]) => any;
  reduxFormReset: (...args: any[]) => any;
  submitting: boolean;
  initialValues: {
    perioder?: any[];
  };
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  slettedePerioder?: any[];
  arbeidsgivere?: ArbeidsgiverOpplysningerPerId;
}

export const PeriodeTabell = ({
  behandlingFormPrefix,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  perioder,
  slettedePerioder,
  initialValues,
  arbeidsgivere,
  readOnly,
  openForms,
  submitting,
  reduxFormChange: formChange,
  reduxFormReset: formReset,
}: OwnProps) => {
  const [{ isNyPeriodeFormOpen, showModalSlettPeriode, periodeSlett }, setState] = useState({
    isNyPeriodeFormOpen: false,
    showModalSlettPeriode: false,
    periodeSlett: undefined,
  });

  const newPeriodeResetCallback = useCallback(() => {
    formReset(`${behandlingFormPrefix}.nyPeriodeForm`);
    setState(state => ({ ...state, isNyPeriodeFormOpen: !state.isNyPeriodeFormOpen }));
  }, []);

  const hideModal = useCallback(() => {
    setState(state => ({
      ...state,
      showModalSlettPeriode: false,
    }));
  }, []);

  const newPeriodeCallback = useCallback(
    (nyPeriode: any) => {
      const newPerioder = perioder.concat(nyPeriode).sort((a: any, b: any) => a.fom.localeCompare(b.fom));

      formChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'perioder', newPerioder);

      setState(state => ({ ...state, isNyPeriodeFormOpen: !state.isNyPeriodeFormOpen }));
    },
    [perioder],
  );

  const newArbeidsgiverCallback = useCallback(
    (nyArbeidsgivere: any) => {
      formChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'arbeidsgivere', {
        ...(arbeidsgivere || {}),
        [nyArbeidsgivere.orgNr]: { identifikator: nyArbeidsgivere.orgNr, navn: nyArbeidsgivere.navn },
      });
      formReset(`${behandlingFormPrefix}.nyArbeidsgiverForm`);
    },
    [arbeidsgivere],
  );

  const openSlettPeriodeModalCallback = useCallback(
    (id: string) => {
      setState(state => ({
        ...state,
        showModalSlettPeriode: !state.showModalSlettPeriode,
        periodeSlett: perioder.find((periode: any) => periode.id === id),
      }));
    },
    [perioder],
  );

  const removePeriode = useCallback(
    (values: any) => {
      const hasOriginalPeriode = initialValues.perioder.find((p: any) => p.id === periodeSlett?.id);

      if (hasOriginalPeriode) {
        formChange(
          `${behandlingFormPrefix}.${FORM_NAME}`,
          'slettedePerioder',
          slettedePerioder.concat([
            {
              ...(periodeSlett || {}),
              begrunnelse: values.begrunnelse,
            },
          ]),
        );
      }

      formChange(
        `${behandlingFormPrefix}.${FORM_NAME}`,
        'perioder',
        perioder.filter((periode: any) => periode.id !== periodeSlett?.id),
      );

      hideModal();
    },
    [initialValues, periodeSlett, perioder],
  );

  const cleaningUpForm = useCallback(
    (id: string) => {
      formChange(
        `${behandlingFormPrefix}.${FORM_NAME}`,
        'perioder',
        perioder
          .map((periode: any) => {
            if (periode.id === id) {
              return {
                ...periode,
                begrunnelse: undefined,
                resultat: undefined,
              };
            }
            return { ...periode };
          })
          .sort((a: any, b: any) => a.fom.localeCompare(b.fom)),
      );
    },
    [perioder],
  );

  const editPeriode = useCallback(
    (id: string) => {
      const newPerioder = createNewPerioder(perioder, id, { openForm: true });

      formChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'perioder', newPerioder);
    },
    [perioder],
  );

  const cancelEditPeriode = useCallback(
    (id: string) => {
      const newPerioder = createNewPerioder(perioder, id, { openForm: false });

      formChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'perioder', newPerioder);
    },
    [perioder],
  );

  const updatePeriode = useCallback(
    ({ id, begrunnelse, nyFom, nyTom }: any) => {
      const updatedPeriode = perioder.find((p: any) => p.id === id);
      const newPerioder = createNewPerioder(perioder, id, {
        id,
        tom: nyTom || updatedPeriode.tom,
        fom: nyFom || updatedPeriode.fom,
        begrunnelse,
        openForm: !updatedPeriode.openForm,
        isFromSøknad: updatedPeriode.isFromSøknad,
        updated: true,
      });

      formChange(
        `${behandlingFormPrefix}.${FORM_NAME}`,
        'perioder',
        newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)),
      );
    },
    [perioder],
  );

  const isAnyFormOpen = useCallback(() => perioder.some((p: any) => p.openForm), [perioder]);

  const disableButtons = submitting || openForms || isNyPeriodeFormOpen || readOnly;

  return (
    <>
      <VerticalSpacer twentyPx />
      <FieldArray
        name="perioder"
        // @ts-ignore
        component={PeriodeRad}
        arbeidsgivere={arbeidsgivere}
        openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
        updatePeriode={updatePeriode}
        editPeriode={editPeriode}
        // @ts-ignore
        cleaningUpForm={cleaningUpForm}
        cancelEditPeriode={cancelEditPeriode}
        isAnyFormOpen={isAnyFormOpen}
        isNyPeriodeFormOpen={isNyPeriodeFormOpen}
        perioder={perioder}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
      />
      <VerticalSpacer twentyPx />
      <FlexContainer wrap>
        <FlexRow>
          <FlexColumn>
            <Button variant="primary" size="small" disabled={disableButtons} onClick={ariaCheck} loading={submitting}>
              <FormattedMessage id="TilkjentYtelse.BekreftOgFortsett" />
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={newPeriodeResetCallback}
              disabled={disableButtons}
            >
              <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
            </Button>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />

      {isNyPeriodeFormOpen && (
        <NyPeriode
          newPeriodeCallback={newPeriodeCallback}
          newArbeidsgiverCallback={newArbeidsgiverCallback}
          newPeriodeResetCallback={newPeriodeResetCallback}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          arbeidsgivere={arbeidsgivere}
          readOnly={readOnly}
        />
      )}

      {periodeSlett && (
        <SlettPeriodeModal
          showModal={showModalSlettPeriode}
          periode={periodeSlett}
          cancelEvent={hideModal}
          closeEvent={removePeriode}
        />
      )}
    </>
  );
};

const getSlettedePerioder = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector(FORM_NAME, behandlingId, behandlingVersjon)(state, 'slettedePerioder');
const getPerioder = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector(FORM_NAME, behandlingId, behandlingVersjon)(state, 'perioder');
const getArbeidsgivere = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector(FORM_NAME, behandlingId, behandlingVersjon)(state, 'arbeidsgivere');

const mapStateToProps = (state: any, props: PureOwnProps) => {
  const { behandlingId, behandlingVersjon } = props;
  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

  const perioder = getPerioder(state, behandlingId, behandlingVersjon) || [];

  return {
    behandlingFormPrefix,
    openForms: !!perioder.find(periode => periode.openForm === true),
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.${FORM_NAME}`)(state),
    slettedePerioder: getSlettedePerioder(state, behandlingId, behandlingVersjon) || [],
    perioder,
    arbeidsgivere: getArbeidsgivere(state, behandlingId, behandlingVersjon) || {},
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormReset,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeTabell);
