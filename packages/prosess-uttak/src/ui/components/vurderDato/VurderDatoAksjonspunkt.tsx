import { Button } from '@navikt/ds-react';
import { Datepicker, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import React from 'react';
import { useForm } from 'react-hook-form';
import ContainerContext from '../../context/ContainerContext';
import styles from './VurderDatoAksjonspunkt.module.css';

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
}

const VurderDatoAksjonspunkt = ({ avbryt, initialValues }: Props) => {
  const { løsAksjonspunktVurderDatoNyRegelUttak } = React.useContext(ContainerContext);
  const formMethods = useForm<FormData>({
    defaultValues: initialValues,
  });

  const onSubmit = (data: FormData) => {
    løsAksjonspunktVurderDatoNyRegelUttak(data);
  };

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className={styles.vurderDatoAksjonspunktContainer}>
        <Datepicker
          name="virkningsdato"
          label="Endringsdato"
          defaultMonth={new Date()}
          fromDate={new Date('1 Jan 2019')}
          toDate={new Date('31 Dec 2025')}
          validate={[required]}
        />
        <TextAreaField
          name="begrunnelse"
          label="Begrunnelse"
          size="small"
          maxLength={1500}
          validate={[required, minLength(5), maxLength(1500)]}
        />
        <div className={styles.knapper}>
          <Button size="small" type="submit" className={styles.bekreft}>
            Bekreft og fortsett
          </Button>
          {avbryt && (
            <Button variant="secondary" type="button" size="small" onClick={avbryt}>
              Avbryt
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

export default VurderDatoAksjonspunkt;
