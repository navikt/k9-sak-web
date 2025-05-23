import { Component } from 'react';
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
  beregnBelop: (data: any) => Promise<any>;
  oppdaterSplittedePerioder: (...args: any[]) => any;
  callbackForward: (...args: any[]) => any;
  callbackBackward: (...args: any[]) => any;
  periode: DataForPeriode;
  readOnly: boolean;
}

interface StateProps {
  showDelPeriodeModal: boolean;
  finnesBelopMed0Verdi: boolean;
}

export class PeriodeController extends Component<OwnProps & WrappedComponentProps, StateProps> {
  constructor(props: any) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.splitPeriod = this.splitPeriod.bind(this);

    this.state = {
      showDelPeriodeModal: false,
      finnesBelopMed0Verdi: false,
    };
  }

  showModal(event: any) {
    this.setState((state: any) => ({
      ...state,
      showDelPeriodeModal: true,
    }));
    event.preventDefault();
  }

  hideModal() {
    this.setState((state: any) => ({
      ...state,
      showDelPeriodeModal: false,
    }));
  }

  splitPeriod(formValues: any) {
    this.setState((state: any) => ({
      ...state,
      finnesBelopMed0Verdi: false,
    }));

    const {
      periode,
      beregnBelop: callBeregnBelop,
      behandlingId: selectedBehandlingId,
      oppdaterSplittedePerioder,
    } = this.props;

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
      perioder: [forstePeriode, andrePeriode],
    };

    void callBeregnBelop(params).then(response => {
      const { perioder } = response;
      const harPeriodeMedBelop0 = perioder.some(p => p.belop === 0);
      if (harPeriodeMedBelop0) {
        this.setState((state: any) => ({
          ...state,
          finnesBelopMed0Verdi: true,
        }));
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
        this.hideModal();
        oppdaterSplittedePerioder([forstePeriodeMedBeløp, andrePeriodeMedBeløp]);
      }
    });
  }

  render() {
    const { intl, callbackForward, callbackBackward, periode, readOnly, behandlingId, behandlingVersjon } = this.props;

    const { showDelPeriodeModal, finnesBelopMed0Verdi } = this.state;

    return (
      <HGrid gap="1" columns={{ xs: '2fr 8fr 2fr' }}>
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
              onClick={this.showModal}
            >
              <FormattedMessage id="PeriodeController.DelOppPerioden" />
            </Button>
          )}
          {showDelPeriodeModal && (
            <DelOppPeriodeModal
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              cancelEvent={this.hideModal}
              showModal={showDelPeriodeModal}
              periodeData={periode}
              splitPeriod={this.splitPeriod}
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
  }
}

export default injectIntl(PeriodeController);
