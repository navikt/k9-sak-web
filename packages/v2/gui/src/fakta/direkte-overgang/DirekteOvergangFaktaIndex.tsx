import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { ManglerSøknadForm, type ManglerSøknadSubmitData } from './ManglerSøknadForm.js';

type DirekteOvergangFaktaIndexProps = {
  aksjonspunkter: AksjonspunktDto[];
  readOnly: boolean;
  submittable: boolean;
  submitCallback: (data: ManglerSøknadSubmitData[]) => void | Promise<void>;
};

export const DirekteOvergangFaktaIndex = ({
  aksjonspunkter,
  readOnly,
  submittable,
  submitCallback,
}: DirekteOvergangFaktaIndexProps) => (
  <ManglerSøknadForm
    aksjonspunkter={aksjonspunkter}
    readOnly={readOnly}
    submittable={submittable}
    submitCallback={submitCallback}
  />
);
