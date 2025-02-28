import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { type KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { BodyShort, Detail, Fieldset, HStack, VStack } from '@navikt/ds-react';
import { CheckboxField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { ArrowBox } from '@navikt/ft-ui-komponenter';
import { type KlagebehandlingDto } from '@navikt/k9-klage-typescript-client';
import * as Sentry from '@sentry/browser';
import { type Location } from 'history';
import { NavLink } from 'react-router';

import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';

import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import { useContext } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { type Behandling } from '../types/Behandling';
import styles from './aksjonspunktGodkjenningFieldArray.module.css';
import { type FormState } from './FormState';

const MANUELL_VURDERING_AV_ANKE = '5093';

const minLength3 = minLength(3);
const maxLength2000 = maxLength(2000);

export type AksjonspunktGodkjenningData = {
  aksjonspunktKode: string;
  annet?: boolean;
  besluttersBegrunnelse?: string;
  feilFakta?: boolean;
  feilLov?: boolean;
  feilRegel?: boolean;
  totrinnskontrollGodkjent?: boolean;
};

interface OwnProps {
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  readOnly: boolean;
  showBegrunnelse?: boolean;
  klageKA?: boolean;
  klagebehandlingVurdering?: KlagebehandlingDto;
  behandlingStatus: Behandling['status'];
  arbeidsforholdHandlingTyper: KodeverkObject[];
  skjermlenkeTyper: KodeverkObject[];
  lagLenke: (skjermlenkeCode: string) => Location;
}

export const AksjonspunktGodkjenningFieldArray = ({
  totrinnskontrollSkjermlenkeContext,
  readOnly,
  showBegrunnelse = false,
  klageKA = false,
  klagebehandlingVurdering,
  behandlingStatus,
  arbeidsforholdHandlingTyper,
  skjermlenkeTyper,
  lagLenke,
}: OwnProps) => {
  const featureToggles = useContext(FeatureTogglesContext);
  const { control, formState } = useFormContext<FormState>();
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });

  return (
    <>
      {fields.map((field, index) => {
        const { aksjonspunktKode, totrinnskontrollGodkjent, annet, feilFakta, feilLov, feilRegel } =
          aksjonspunktGodkjenning[index] || {};
        const context = totrinnskontrollSkjermlenkeContext.find(c =>
          c.totrinnskontrollAksjonspunkter.some(ta => ta.aksjonspunktKode === aksjonspunktKode),
        );
        const totrinnskontrollAksjonspunkt = context?.totrinnskontrollAksjonspunkter.find(
          c => c.aksjonspunktKode === aksjonspunktKode,
        );

        const erKlageKA = klageKA && totrinnskontrollGodkjent;
        const erAnke = aksjonspunktKode === MANUELL_VURDERING_AV_ANKE && totrinnskontrollGodkjent === true;
        const visKunBegrunnelse = erAnke || erKlageKA ? totrinnskontrollGodkjent : showBegrunnelse;
        const visArsaker = erAnke || erKlageKA || totrinnskontrollGodkjent === false;

        const aksjonspunktText =
          totrinnskontrollAksjonspunkt &&
          getAksjonspunkttekst(
            behandlingStatus,
            arbeidsforholdHandlingTyper,
            totrinnskontrollAksjonspunkt,
            klagebehandlingVurdering,
          );

        const skjermlenkeTypeKodeverk = skjermlenkeTyper.find(
          skjermlenkeType => skjermlenkeType.kode === context?.skjermlenkeType,
        );

        const isNyInntektEgetPanel =
          featureToggles?.NY_INNTEKT_EGET_PANEL &&
          skjermlenkeTypeKodeverk?.navn === 'Fordeling' &&
          aksjonspunktKode === aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD;

        const hentSkjermlenkeTypeKodeverkNavn = () => {
          try {
            if (skjermlenkeTypeKodeverk?.navn === 'Vedtak') {
              return 'Brev';
            }

            if (isNyInntektEgetPanel) {
              return 'Ny inntekt';
            }
            return skjermlenkeTypeKodeverk?.navn;
          } catch {
            Sentry.captureEvent({
              message: 'Kunne ikke hente skjermlenkeTypeKodeverk.navn',
              extra: { skjermlenkeTyper, skjermlenkeTypeKodeverk, skjermlenkeTypeContext: context?.skjermlenkeType },
            });
            return '';
          }
        };

        const checkboxRequiredError =
          formState.isSubmitted && !totrinnskontrollGodkjent && !annet && !feilFakta && !feilLov && !feilRegel
            ? 'Feltet må fylles ut'
            : '';

        const lenke = () => {
          if (isNyInntektEgetPanel) {
            return lagLenke(skjermlenkeCodes.FAKTA_OM_NY_INNTEKT.kode);
          }
          return lagLenke(context.skjermlenkeType);
        };

        return (
          <div className={index > 0 ? 'mt-2' : ''} key={field.id}>
            <NavLink to={lenke()} onClick={() => window.scroll(0, 0)} className={styles.lenke}>
              {hentSkjermlenkeTypeKodeverkNavn()}
            </NavLink>
            <div className={styles.approvalItemContainer}>
              {aksjonspunktText
                ?.filter(text => !!text)
                .map((formattedMessage, i) => (
                  <div
                    key={aksjonspunktKode?.concat('_'.concat(i.toString()))}
                    className={styles.aksjonspunktTextContainer}
                  >
                    <BodyShort size="small">{formattedMessage}</BodyShort>
                  </div>
                ))}
              <Fieldset legend="" hideLegend>
                <RadioGroupPanel
                  name={`aksjonspunktGodkjenning.${index}.totrinnskontrollGodkjent`}
                  isReadOnly={readOnly}
                  isTrueOrFalseSelection
                  isHorizontal
                  radios={[
                    {
                      value: 'true',
                      label: 'Godkjent',
                    },
                    {
                      value: 'false',
                      label: 'Vurder på nytt',
                    },
                  ]}
                />
                {visArsaker && (
                  <ArrowBox alignOffset={erKlageKA ? 1 : 110}>
                    {!visKunBegrunnelse && (
                      <VStack gap="2">
                        <Detail className="blokk-xs">Årsak</Detail>
                        <Fieldset legend="" hideLegend>
                          <HStack gap="20">
                            <div>
                              <CheckboxField
                                name={`aksjonspunktGodkjenning.${index}.feilFakta`}
                                label="Feil fakta"
                                readOnly={readOnly}
                              />
                              <CheckboxField
                                name={`aksjonspunktGodkjenning.${index}.feilRegel`}
                                label="Feil regelforståelse"
                                readOnly={readOnly}
                              />
                            </div>
                            <div>
                              <CheckboxField
                                name={`aksjonspunktGodkjenning.${index}.feilLov`}
                                label="Feil lovanvendelse"
                                readOnly={readOnly}
                              />
                              <CheckboxField
                                name={`aksjonspunktGodkjenning.${index}.annet`}
                                label="Annet"
                                readOnly={readOnly}
                              />
                            </div>
                          </HStack>
                          {checkboxRequiredError && (
                            <div className="navds-error-message navds-label navds-label--small">
                              {checkboxRequiredError}
                            </div>
                          )}
                        </Fieldset>
                      </VStack>
                    )}
                    <div className="mt-4">
                      <TextAreaField
                        name={`aksjonspunktGodkjenning.${index}.besluttersBegrunnelse`}
                        label="Begrunnelse"
                        validate={[required, minLength3, maxLength2000, hasValidText]}
                        readOnly={readOnly}
                        maxLength={2000}
                      />
                    </div>
                  </ArrowBox>
                )}
              </Fieldset>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AksjonspunktGodkjenningFieldArray;
