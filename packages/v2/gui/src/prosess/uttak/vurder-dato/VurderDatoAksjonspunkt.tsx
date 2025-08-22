import { Button } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidDate, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import styles from './VurderDatoAksjonspunkt.module.css';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon,
  type k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

interface FormData {
  virkningsdato: string;
  begrunnelse: string;
}

interface Props {
  avbryt?: () => void;
  initialValues?: {
    virkningsdato: string;
    begrunnelse: string;
  };
  readOnly: boolean;
  api: BehandlingUttakBackendClient;
  behandling: Pick<BehandlingDto, 'id' | 'versjon'>;
  oppdaterBehandling: () => void;
}

const VurderDatoAksjonspunkt = ({ avbryt, initialValues, readOnly, api, behandling, oppdaterBehandling }: Props) => {
  const formMethods = useForm<FormData>({
    defaultValues: initialValues,
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
      return api.bekreftAksjonspunkt(payload);
    },
    onSuccess: () => {
      oppdaterBehandling();
    },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
      <div className={styles['vurderDatoAksjonspunktContainer']}>
        <RhfDatepicker
          control={formMethods.control}
          name="virkningsdato"
          label="Endringsdato"
          defaultMonth={new Date()}
          fromDate={new Date('1 Jan 2019')}
          toDate={new Date('31 Dec 2025')}
          validate={[required, hasValidDate]}
          isReadOnly={readOnly}
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
          <div className={styles['knapper']}>
            <Button size="small" type="submit" className={styles['bekreft']}>
              Bekreft og fortsett
            </Button>
            {avbryt && (
              <Button variant="secondary" type="button" size="small" onClick={avbryt}>
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
