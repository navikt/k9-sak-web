import { CheckboxGroupFormik } from '@fpsak-frontend/form';
import { Alert, Heading } from '@navikt/ds-react';
import { useFormikContext } from 'formik';
import React from 'react';
import { IntlShape } from 'react-intl';
import VedtakFritekstPanel from '../VedtakFritekstPanel';
import InformasjonsbehovKode from './InformasjonsbehovKode';
import styles from './informasjonsbehovAutomatiskVedtaksbrev.module.css';

export interface InformasjonsbehovVedtaksbrev {
  informasjonsbehov: { kode: string; beskrivelse: string; type: string }[];
  mangler: string[];
}

interface Props {
  intl: IntlShape;
  sprakkode: string;
  readOnly: boolean;
  begrunnelse: string;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
}

const InformasjonsbehovAutomatiskVedtaksbrev: React.FC<Props> = ({
  intl,
  sprakkode,
  readOnly,
  begrunnelse,
  informasjonsbehovVedtaksbrev,
}) => {
  const { values } = useFormikContext();

  const aktiverteInformasjonsbehov =
    (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(({ type }) => type === 'FRITEKST') ?? [];

  if (aktiverteInformasjonsbehov.length === 0) {
    return null;
  }

  const harBegrunnelse = aktiverteInformasjonsbehov.some(behov => values[behov.kode]?.length > 0);

  const getAksjonspunktInfoboks = () => {
    let tekst = '';
    if (informasjonsbehovVedtaksbrev.mangler.includes(InformasjonsbehovKode.BEREGNING_SKJONNSMESSIG)) {
      tekst = intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.SupplerMedFritekstSkjønnsmessig' });
    } else if (informasjonsbehovVedtaksbrev.mangler.includes(InformasjonsbehovKode.REVURDERING_ENDRING)) {
      tekst = intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.SupplerMedFritekstEndring' });
    } else {
      return null;
    }

    return (
      <Alert className={styles.alert} variant="warning" size="small">
        {tekst}
      </Alert>
    );
  };

  return (
    <>
      {!readOnly && (
        <>
          <Heading className={styles.heading} level="3" size="small">
            {intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.Fritekstbeskrivelse' })}
          </Heading>
          {getAksjonspunktInfoboks()}
        </>
      )}
      <div className={readOnly ? '' : styles.textAreaContainer}>
        {aktiverteInformasjonsbehov.map(behov => (
          <VedtakFritekstPanel
            key={behov.kode}
            intl={intl}
            readOnly={readOnly}
            sprakkode={sprakkode}
            label={behov.beskrivelse}
            begrunnelse={begrunnelse}
            begrunnelseFieldName={behov.kode}
          />
        ))}
        {!readOnly && (
          <div className={styles.checkbox}>
            <CheckboxGroupFormik
              name="ikkeRelevantMedFritekst"
              legend={intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.ErDetRelevantMedFritekst' })}
              hideLegend
              checkboxes={[
                {
                  value: 'ikkeRelevantMedFritekst',
                  label: intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.IkkeRelevantMedFritekst' }),
                },
              ]}
              validate={[
                value => {
                  if (!harBegrunnelse && (!value || value.length === 0)) {
                    return [intl.formatMessage({ id: 'ValidationMessage.BekreftIkkeRelevantFritekst' })];
                  }
                  return null;
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InformasjonsbehovAutomatiskVedtaksbrev;
