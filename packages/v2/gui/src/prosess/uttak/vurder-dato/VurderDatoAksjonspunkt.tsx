import { AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { useRefetchBehandling } from '@k9-sak-web/gui/context/BehandlingContext.js';
import Datovelger from '@k9-sak-web/gui/shared/datovelger/Datovelger.js';
import { Button } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { dateBeforeOrEqual, hasValidDate, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils.js';
import { useUttakApi } from '../api/UttakApiContext.js';
import { useUttakContext } from '../context/UttakContext.js';
import styles from './VurderDatoAksjonspunkt.module.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { uttakQueryOptions } from '../api/uttakQueryOptions.js';

const SENESTE_VIRKNINGSDATO = '2027-01-01';

interface FormData {
  virkningsdato: string;
  begrunnelse: string;
}

interface Props {
  redigerVirkningsdato: boolean;
  lukkRedigering: () => void;
}

const VurderDatoAksjonspunkt = ({ redigerVirkningsdato, lukkRedigering }: Props) => {
  const { readOnly, behandling, aksjonspunkter, onAksjonspunktBekreftet } = useUttakContext();
  const uttakApi = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;
  const aksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDtoDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
  );
  const oppdaterBehandling = useRefetchBehandling();

  const formMethods = useForm<FormData>({
    defaultValues: {
      begrunnelse: aksjonspunkt?.begrunnelse ?? '',
      virkningsdato: aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status) ? '' : (virkningsdatoUttakNyeRegler ?? ''),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { id: behandlingId, versjon: behandlingVersjon } = behandling;
      const payload = {
        behandlingId: `${behandlingId}`,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [
          {
            '@type': AksjonspunktDtoDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
            kode: AksjonspunktDtoDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
            ...data,
          },
        ],
      };
      return uttakApi.bekreftAksjonspunkt(payload);
    },
    onSuccess: async () => {
      await oppdaterBehandling();
      onAksjonspunktBekreftet?.();
    },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
      <div className={styles.vurderDatoAksjonspunktContainer}>
        <Datovelger
          name="virkningsdato"
          label="Endringsdato"
          defaultMonth={new Date()}
          fromDate={new Date(2019, 0, 1)}
          toDate={new Date(2026, 11, 31)}
          validate={[required, hasValidDate, dateBeforeOrEqual(SENESTE_VIRKNINGSDATO)]}
          readOnly={readOnly}
        />
        <RhfTextarea
          control={formMethods.control}
          name="begrunnelse"
          label="Begrunnelse"
          size="small"
          maxLength={1500}
          validate={[required, minLength(5), maxLength(1500)]}
          readOnly={readOnly}
        />
        {!readOnly && (
          <div className={styles.knapper}>
            <Button size="small" type="submit" className={styles.bekreft}>
              Bekreft og fortsett
            </Button>

            {redigerVirkningsdato && (
              <Button variant="secondary" type="button" size="small" onClick={() => lukkRedigering()}>
                Avbryt
              </Button>
            )}
          </div>
        )}
      </div>
    </RhfForm>
  );
};

export default VurderDatoAksjonspunkt;
