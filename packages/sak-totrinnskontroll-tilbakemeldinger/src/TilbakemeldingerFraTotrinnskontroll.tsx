import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { AlleKodeverk, Approval, BehandlingKlageVurdering, BehandlingStatusType } from '@k9-frontend/types';
import * as React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { NavLink } from 'react-router-dom';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import Tilbakemelding from './Tilbakemelding';

/*
 * ToTrinnsFormReadOnly
 *
 * Presentasjonskomponent. Shows the approved and not approved issues from the manager
 *
 * Eksempel:
 * ```html
 * <ToTrinnsForm data={listOfApprovals}/>
 * ```
 */

interface TilbakemeldingerFraTotrinnskontrollProps {
  approvalList: Approval[];
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  behandlingStatus: BehandlingStatusType;
  alleKodeverk: AlleKodeverk;
}

type Props = TilbakemeldingerFraTotrinnskontrollProps & WrappedComponentProps;

const TilbakemeldingerFraTotrinnskontroll: React.FunctionComponent<Props> = props => {
  const { approvalList, isForeldrepengerFagsak, behandlingKlageVurdering, behandlingStatus, alleKodeverk } = props;
  if (!approvalList || approvalList.length === 0) {
    return null;
  }
  return (
    <div>
      {approvalList.map(({ contextCode, skjermlenke, skjermlenkeNavn, aksjonspunkter }) => {
        if (aksjonspunkter.length > 0) {
          return (
            <ElementWrapper key={contextCode}>
              <NavLink to={skjermlenke}>{skjermlenkeNavn}</NavLink>
              {aksjonspunkter.map(aksjonspunkt => (
                <Tilbakemelding
                  key={aksjonspunkt.aksjonspunktKode}
                  aksjonspunkt={aksjonspunkt}
                  isForeldrepengerFagsak={isForeldrepengerFagsak}
                  behandlingKlageVurdering={behandlingKlageVurdering}
                  behandlingStatus={behandlingStatus}
                  arbeidsforholdHandlingTyper={alleKodeverk[kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE]}
                />
              ))}
            </ElementWrapper>
          );
        }
        return null;
      })}
    </div>
  );
};

export default injectIntl(TilbakemeldingerFraTotrinnskontroll);
