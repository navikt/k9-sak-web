import React, { Fragment } from 'react';
import moment from 'moment';

import { FormattedMessage, useIntl } from 'react-intl';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  DDMMYYYY_DATE_FORMAT,
  hasValidDate,
  decodeHtmlEntity,
  hasValidText,
  maxLength,
  minLength,
  requiredIfNotPristine,
  required,
} from '@fpsak-frontend/utils';

import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { CustomVilkarText, DokumentStatus } from './SoknadsfristVilkarForm';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

interface SoknadsfristVilkarBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  avslagsarsaker: KodeverkMedNavn[];
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
  dokument?: DokumentStatus[];
}

/**
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarBegrunnelse = ({
  erVilkarOk,
  readOnly,
  avslagsarsaker,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  dokument,
}: SoknadsfristVilkarBegrunnelseProps) => {
  const intl = useIntl();

  return (
    <>
      {Array.isArray(dokument) && dokument.length > 0 ? (
        <>
          {dokument.map((dok, index) => (
            <Fragment key={dok.journalpostId}>
              <p>
                {dok.type} innsendt {formatDate(dok.innsendingstidspunkt)}{' '}
                <small>(journalpostId: {dok.journalpostId})</small>
              </p>
              <input name={`avklarteKrav.${index}.journalpostId`} type="hidden" />
              {skalViseBegrunnelse && (
                <>
                  <VerticalSpacer eightPx />
                  <TextAreaField
                    name={`avklarteKrav.${index}.begrunnelse`}
                    label={intl.formatMessage({ id: 'VilkarBegrunnelse.Vilkar' })}
                    validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
                    maxLength={1500}
                    readOnly={readOnly}
                    placeholder={intl.formatMessage({ id: 'VilkarBegrunnelse.BegrunnVurdering' })}
                  />
                </>
              )}
              <VerticalSpacer eightPx />
              <DatepickerField
                name={`avklarteKrav.${index}.fraDato`}
                label={{ id: 'SoknadsfristVilkarForm.Dato' }}
                validate={[required, hasValidDate]}
                readOnly={readOnly}
              />
              <VilkarResultPicker
                fieldNamePrefix={`avklarteKrav.${index}`}
                avslagsarsaker={avslagsarsaker}
                customVilkarOppfyltText={
                  <FormattedMessage
                    id={customVilkarOppfyltText ? customVilkarOppfyltText.id : 'SoknadsfristVilkarForm.ErOppfylt'}
                    values={
                      customVilkarOppfyltText
                        ? {
                            b: chunks => <b>{chunks}</b>,
                            ...customVilkarIkkeOppfyltText.values,
                          }
                        : { b: chunks => <b>{chunks}</b> }
                    }
                  />
                }
                customVilkarIkkeOppfyltText={
                  <FormattedMessage
                    id={
                      customVilkarIkkeOppfyltText
                        ? customVilkarOppfyltText.id
                        : 'SoknadsfristVilkarForm.VilkarIkkeOppfylt'
                    }
                    values={
                      customVilkarIkkeOppfyltText
                        ? {
                            b: chunks => <b>{chunks}</b>,
                            ...customVilkarIkkeOppfyltText.values,
                          }
                        : { b: chunks => <b>{chunks}</b> }
                    }
                  />
                }
                erVilkarOk={erVilkarOk}
                readOnly={readOnly}
                erMedlemskapsPanel={false}
              />
            </Fragment>
          ))}
        </>
      ) : null}
    </>
  );
};

SoknadsfristVilkarBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

SoknadsfristVilkarBegrunnelse.buildInitialValues = (avslagKode, aksjonspunkter, status, periode, dokument) => ({
  avklarteKrav: dokument.map(dok => ({
    ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status),
    begrunnelse: decodeHtmlEntity(dok.overstyrteOpplysninger?.begrunnelse || ''),
    journalpostId: dok.journalpostId,
    fraDato: formatDate(dok.overstyrteOpplysninger?.fraDato || dok.innsendingstidspunkt),
  })),
});

SoknadsfristVilkarBegrunnelse.transformValues = values => ({
  begrunnelse: values.avklarteKrav.map(krav => krav.begrunnelse).join('\n'),
  avklarteKrav: values.avklarteKrav.map(krav => ({ ...krav, godkjent: krav.erVilkarOk })),
  erVilkarOk: !values.avklarteKrav.some(krav => !krav.erVilkarOk),
});

SoknadsfristVilkarBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default SoknadsfristVilkarBegrunnelse;
