import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import medlemskapAksjonspunkterPropType from '../propTypes/medlemskapAksjonspunkterPropType';
import medlemskapMedlemskaPropType from '../propTypes/medlemskapMedlemskapPropType';
import medlemskapSoknadPropType from '../propTypes/medlemskapSoknadPropType';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

const { OVERSTYR_AVKLAR_STARTDATO } = aksjonspunktCodes;

const avklarStartdatoAp = [OVERSTYR_AVKLAR_STARTDATO];

const hasOpen = aksjonspunkt => aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode);

/**
 * MedlemskapInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å vise faktapanelene for medlemskap.
 */
const MedlemskapInfoPanel = ({
  submittable,
  aksjonspunkter,
  readOnly,
  submitCallback,
  alleMerknaderFraBeslutter,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  soknad,
  alleKodeverk,
  medlemskap,
  fagsakPerson,
  saksbehandlere,
}) => {
  const avklarStartdatoOverstyring = aksjonspunkter.find(ap => ap.definisjon.kode === OVERSTYR_AVKLAR_STARTDATO);
  const aksjonspunkterMinusAvklarStartDato = useMemo(
    () => aksjonspunkter.filter(ap => !avklarStartdatoAp.includes(ap.definisjon.kode)),
    [aksjonspunkter],
  );

  return (
    !hasOpen(avklarStartdatoOverstyring) && (
      <OppholdInntektOgPerioderForm
        soknad={soknad}
        readOnly={readOnly}
        submitCallback={submitCallback}
        submittable={submittable}
        aksjonspunkter={aksjonspunkterMinusAvklarStartDato}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingType={behandlingType}
        alleKodeverk={alleKodeverk}
        medlemskap={medlemskap}
        fagsakPerson={fagsakPerson}
        saksbehandlere={saksbehandlere}
      />
    )
  );
};

MedlemskapInfoPanel.propTypes = {
  submittable: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(medlemskapAksjonspunkterPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  soknad: medlemskapSoknadPropType,
  alleKodeverk: PropTypes.shape().isRequired,
  medlemskap: medlemskapMedlemskaPropType.isRequired,
  saksbehandlere: PropTypes.shape(),
};

export default MedlemskapInfoPanel;
