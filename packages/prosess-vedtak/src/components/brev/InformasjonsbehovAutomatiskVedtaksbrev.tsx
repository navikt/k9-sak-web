import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import { Kodeverk } from '@k9-sak-web/types';
import { Alert, Heading } from '@navikt/ds-react';
import { useFormikContext } from 'formik';
import React from 'react';
import { IntlShape } from 'react-intl';
import VedtakFritekstPanel from '../VedtakFritekstPanel';
import styles from './informasjonsbehovAutomatiskVedtaksbrev.less';

interface InformasjonsbehovVedtaksbrev {
  informasjonsbehov: { kode: string; beskrivelse: string; type: string }[];
  mangler: string[];
}

interface Props {
  intl: IntlShape;
  sprakkode: Kodeverk;
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

  return (
    <>
      {!readOnly && (
        <>
          <Heading className={styles.heading} level="3" size="small">
            {intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.Fritekstbeskrivelse' })}
          </Heading>
          <Alert className={styles.alert} variant="warning" size="small">
            {intl.formatMessage({ id: 'InformasjonsbehovAutomatiskVedtaksbrev.SupplerMedFritekst' })}
          </Alert>
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
            <CheckboxFieldFormik
              label={{ id: 'InformasjonsbehovAutomatiskVedtaksbrev.IkkeRelevantMedFritekst' }}
              name="ikkeRelevantMedFritekst"
              validate={value => {
                const harBegrunnelse = aktiverteInformasjonsbehov.some(behov => values[behov.kode]?.length > 0);
                if (!harBegrunnelse && !value) {
                  return 'Du må bekrefte at det ikke er relevant med fritekstbeskrivelse i brevet';
                }
                return null;
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InformasjonsbehovAutomatiskVedtaksbrev;
