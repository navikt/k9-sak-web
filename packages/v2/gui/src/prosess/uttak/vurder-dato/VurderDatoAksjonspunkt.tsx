import { Button } from '@navikt/ds-react';
import { Datepicker, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidDate, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import styles from './VurderDatoAksjonspunkt.module.css';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import { AksjonspunktDtoDefinisjon, type BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';

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

  const onSubmit = async (data: FormData) => {
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
    await api.bekreftAksjonspunkt(payload);
    oppdaterBehandling();
  };

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className={styles['vurderDatoAksjonspunktContainer']}>
        <Datepicker
          name="virkningsdato"
          label="Endringsdato"
          defaultMonth={new Date()}
          fromDate={new Date('1 Jan 2019')}
          toDate={new Date('31 Dec 2025')}
          validate={[required, hasValidDate]}
          isReadOnly={readOnly}
        />
        <TextAreaField
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
    </Form>
  );
};

export default VurderDatoAksjonspunkt;
