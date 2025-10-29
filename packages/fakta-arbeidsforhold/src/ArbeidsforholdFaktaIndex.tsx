import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId, Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import messages from '../i18n/nb_NO.json';
import ArbeidsforholdInfoPanel from './components/ArbeidsforholdInfoPanel';

type StandardFaktaProps = Readonly<{
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  submitCallback?: (aksjonspunktData: any) => Promise<any>;
}>;

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  arbeidsforhold: ArbeidsforholdV2[];
}

const ArbeidsforholdFaktaIndex = ({
  behandling,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  harApneAksjonspunkter,
  submitCallback,
  readOnly,
}: OwnProps & StandardFaktaProps) => (
      {arbeidsforhold && arbeidsgiverOpplysningerPerId && (
      <ArbeidsforholdInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        aksjonspunkter={aksjonspunkter}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
      />
    )});

export default ArbeidsforholdFaktaIndex;
