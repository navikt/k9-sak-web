import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ArrowBox, FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { KlageVurdering, Kodeverk, KodeverkMedNavn, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { BodyShort, Detail, Fieldset } from '@navikt/ds-react';
import * as Sentry from '@sentry/browser';
import { Location } from 'history';
import { NavLink } from 'react-router-dom';

import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';

import { CheckboxField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import styles from './aksjonspunktGodkjenningFieldArray.module.css';
import { FormState } from './FormState';

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
  klagebehandlingVurdering?: KlageVurdering;
  behandlingStatus: Kodeverk;
  arbeidsforholdHandlingTyper: KodeverkMedNavn[];
  erTilbakekreving: boolean;
  skjermlenkeTyper: KodeverkMedNavn[];
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
  erTilbakekreving,
  skjermlenkeTyper,
  lagLenke,
}: OwnProps) => {
  const { control, formState } = useFormContext<FormState>();
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });

  return (
    <>
      {fields.map((field, index) => {
        const { aksjonspunktKode, totrinnskontrollGodkjent, annet, feilFakta, feilLov, feilRegel } =
          aksjonspunktGodkjenning[index];
        const context = totrinnskontrollSkjermlenkeContext.find(c =>
          c.totrinnskontrollAksjonspunkter.some(ta => ta.aksjonspunktKode === aksjonspunktKode),
        );
        const totrinnskontrollAksjonspunkt = context.totrinnskontrollAksjonspunkter.find(
          c => c.aksjonspunktKode === aksjonspunktKode,
        );

        const erKlageKA = klageKA && totrinnskontrollGodkjent;
        const erAnke =
          aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE && totrinnskontrollGodkjent === true;
        const visKunBegrunnelse = erAnke || erKlageKA ? totrinnskontrollGodkjent : showBegrunnelse;
        const visArsaker = erAnke || erKlageKA || totrinnskontrollGodkjent === false;

        const aksjonspunktText = getAksjonspunkttekst(
          klagebehandlingVurdering,
          behandlingStatus,
          arbeidsforholdHandlingTyper,
          erTilbakekreving,
          totrinnskontrollAksjonspunkt,
        );

        const skjermlenkeTypeKodeverk = skjermlenkeTyper.find(
          skjermlenkeType => skjermlenkeType.kode === context.skjermlenkeType,
        );

        const hentSkjermlenkeTypeKodeverkNavn = () => {
          try {
            if (skjermlenkeTypeKodeverk.navn === 'Vedtak') {
              return 'Brev';
            }
            return skjermlenkeTypeKodeverk.navn;
          } catch {
            Sentry.captureEvent({
              message: 'Kunne ikke hente skjermlenkeTypeKodeverk.navn',
              extra: { skjermlenkeTyper, skjermlenkeTypeKodeverk, skjermlenkeTypeContext: context.skjermlenkeType },
            });
            return '';
          }
        };

        const checkboxRequiredError =
          formState.isSubmitted && !totrinnskontrollGodkjent && !annet && !feilFakta && !feilLov && !feilRegel
            ? 'Feltet må fylles ut'
            : '';

        return (
          <div className={index > 0 && 'mt-2'} key={field.id}>
            <NavLink
              to={lagLenke(context.skjermlenkeType)}
              onClick={() => window.scroll(0, 0)}
              className={styles.lenke}
            >
              {hentSkjermlenkeTypeKodeverkNavn()}
            </NavLink>
            <div className={styles.approvalItemContainer}>
              {aksjonspunktText
                .filter(text => !!text)
                .map((formattedMessage, i) => (
                  <div
                    key={aksjonspunktKode.concat('_'.concat(i.toString()))}
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
                      <FlexContainer wrap>
                        <FlexRow>
                          <FlexColumn>
                            <Detail className="blokk-xs">Årsak</Detail>
                          </FlexColumn>
                        </FlexRow>
                        <FlexRow>
                          <Fieldset legend="" hideLegend>
                            <div className="grid grid-cols-2 gap-20">
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
                            </div>
                            {checkboxRequiredError && (
                              <div className="navds-error-message navds-label navds-label--small">
                                {checkboxRequiredError}
                              </div>
                            )}
                          </Fieldset>
                        </FlexRow>
                      </FlexContainer>
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
