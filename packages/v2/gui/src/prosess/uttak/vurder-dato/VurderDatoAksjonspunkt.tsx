import { Button } from '@navikt/ds-react';
import { hasValidDate, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import styles from './VurderDatoAksjonspunkt.module.css';
import { useUttakContext } from '../context/UttakContext';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { RhfDatepicker, RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';

interface FormData {
  virkningsdato: string;
  begrunnelse: string;
}

interface Props {
  initialValues?: {
    virkningsdato: string;
    begrunnelse: string;
  };
}

const VurderDatoAksjonspunkt = ({ initialValues }: Props) => {
  const { readOnly, behandling, uttakApi, oppdaterBehandling, setRedigervirkningsdato, virkningsdatoUttakNyeRegler } =
    useUttakContext();

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
      return uttakApi.bekreftAksjonspunkt(payload);
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

            {virkningsdatoUttakNyeRegler && (
              <Button variant="secondary" type="button" size="small" onClick={() => setRedigervirkningsdato(false)}>
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
