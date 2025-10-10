import { useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import { FloatRight, Image } from '@fpsak-frontend/shared-components';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';
import { Button, HGrid, Label } from '@navikt/ds-react';
import DataForPeriode from '../../types/dataForPeriodeTsType';
import DelOppPeriodeModal from './DelOppPeriodeModal';

import { EditedIcon } from '@k9-sak-web/gui/shared/EditedIcon.js';
import styles from './periodeController.module.css';

const isEdited = false;

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingUuid: string;
  beregnBelop: (data: any) => Promise<any>;
  oppdaterSplittedePerioder: (...args: any[]) => any;
  callbackForward: (...args: any[]) => any;
  callbackBackward: (...args: any[]) => any;
  periode: DataForPeriode;
  readOnly: boolean;
}

export const PeriodeController = (props: OwnProps & WrappedComponentProps) => {
  const [showDelPeriodeModal, setShowDelPeriodeModal] = useState(false);
  const [finnesBelopMed0Verdi, setFinnesBelopMed0Verdi] = useState(false);

  const showModal = (event: any) => {
    setShowDelPeriodeModal(true);
    event.preventDefault();
  };

  const hideModal = () => {
    setShowDelPeriodeModal(false);
  };

  const splitPeriod = (formValues: any) => {
    setFinnesBelopMed0Verdi(false);

    const {
      periode,
      beregnBelop: callBeregnBelop,
      behandlingId: selectedBehandlingId,
      behandlingUuid,
      oppdaterSplittedePerioder,
    } = props;

    const forstePeriode = {
      belop: periode.feilutbetaling,
      fom: formValues.forstePeriode.fom,
      tom: formValues.forstePeriode.tom,
      begrunnelse: periode.begrunnelse ? periode.begrunnelse : ' ',
    };
    const andrePeriode = {
      belop: periode.feilutbetaling,
      fom: formValues.andrePeriode.fom,
      tom: formValues.andrePeriode.tom,
      begrunnelse: periode.begrunnelse ? periode.begrunnelse : ' ',
    };

    const params = {
      behandlingId: selectedBehandlingId,
      behandlingUuid,
      perioder: [forstePeriode, andrePeriode],
    };

    void callBeregnBelop(params).then(response => {
      const { perioder } = response;
      const harPeriodeMedBelop0 = perioder.some(p => p.belop === 0);
      if (harPeriodeMedBelop0) {
        setFinnesBelopMed0Verdi(true);
      } else {
        const forstePeriodeMedBeløp = {
          fom: forstePeriode.fom,
          tom: forstePeriode.tom,
          feilutbetaling: perioder[0].belop,
        };
        const andrePeriodeMedBeløp = {
          fom: andrePeriode.fom,
          tom: andrePeriode.tom,
          feilutbetaling: perioder[1].belop,
        };
        hideModal();
        oppdaterSplittedePerioder([forstePeriodeMedBeløp, andrePeriodeMedBeløp]);
      }
    });
  };

  const { intl, callbackForward, callbackBackward, periode, readOnly, behandlingId, behandlingVersjon } = props;

  return (
    <HGrid gap="space-4" columns={{ xs: '2fr 8fr 2fr' }}>
      <div>
        <Label size="small" as="p">
          <FormattedMessage id="PeriodeController.Detaljer" />
          {isEdited && <EditedIcon />}
        </Label>
      </div>
      <div>
        {!readOnly && (
          <Button
            size="small"
            variant="tertiary"
            icon={
              <Image
                src={splitPeriodImageUrl}
                srcHover={splitPeriodImageHoverUrl}
                alt={intl.formatMessage({ id: 'PeriodeController.DelOppPerioden' })}
              />
            }
            className={styles.splitPeriodPosition}
            onClick={showModal}
          >
            <FormattedMessage id="PeriodeController.DelOppPerioden" />
          </Button>
        )}
        {showDelPeriodeModal && (
          <DelOppPeriodeModal
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            cancelEvent={hideModal}
            showModal={showDelPeriodeModal}
            periodeData={periode}
            splitPeriod={splitPeriod}
            finnesBelopMed0Verdi={finnesBelopMed0Verdi}
          />
        )}
      </div>
      <div>
        <FloatRight>
          <TimeLineButton
            text={intl.formatMessage({ id: 'PeriodeController.ForrigePeriode' })}
            type="prev"
            callback={callbackBackward}
          />
          <TimeLineButton
            text={intl.formatMessage({ id: 'PeriodeController.NestePeriode' })}
            type="next"
            callback={callbackForward}
          />
        </FloatRight>
      </div>
    </HGrid>
  );
};

export default injectIntl(PeriodeController);
