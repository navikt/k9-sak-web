import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ArrowBox, FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { KlageVurdering, Kodeverk, KodeverkMedNavn, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { BodyShort, Detail, Fieldset } from '@navikt/ds-react';
import * as Sentry from '@sentry/browser';
import { Location } from 'history';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';

import { CheckboxField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
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
  const { control } = useFormContext<FormState>();
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });
  return (
    <>
      {fields.map((field, index) => {
        const { aksjonspunktKode, totrinnskontrollGodkjent } = aksjonspunktGodkjenning[index];
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
              return <FormattedMessage id="ToTrinnsForm.Vedtak.Brev" />;
            }
            return skjermlenkeTypeKodeverk.navn;
          } catch (err) {
            Sentry.captureEvent({
              message: 'Kunne ikke hente skjermlenkeTypeKodeverk.navn',
              extra: { skjermlenkeTyper, skjermlenkeTypeKodeverk, skjermlenkeTypeContext: context.skjermlenkeType },
            });
            return '';
          }
        };

        return (
          <React.Fragment key={field.id}>
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
                  radios={[
                    {
                      value: 'true',
                      label: <FormattedMessage id="ApprovalField.Godkjent" />,
                    },
                    {
                      value: 'false',
                      label: <FormattedMessage id="ApprovalField.Vurder" />,
                    },
                  ]}
                />
                {visArsaker && (
                  <ArrowBox alignOffset={erKlageKA ? 1 : 110}>
                    {!visKunBegrunnelse && (
                      <FlexContainer wrap>
                        <FlexRow>
                          <FlexColumn>
                            <Detail className="blokk-xs">
                              <FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Arsak" />
                            </Detail>
                          </FlexColumn>
                        </FlexRow>
                        <FlexRow>
                          <Fieldset legend="" hideLegend>
                            <div className="grid grid-cols-2 gap-20">
                              <div>
                                <CheckboxField
                                  name={`aksjonspunktGodkjenning.${index}.feilFakta`}
                                  label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilFakta" />}
                                  readOnly={readOnly}
                                />
                                <CheckboxField
                                  name={`aksjonspunktGodkjenning.${index}.feilRegel`}
                                  label={
                                    <FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilRegelForstaelse" />
                                  }
                                  readOnly={readOnly}
                                />
                              </div>
                              <div>
                                <CheckboxField
                                  name={`aksjonspunktGodkjenning.${index}.feilLov`}
                                  label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilLovanvendelse" />}
                                  readOnly={readOnly}
                                />
                                <CheckboxField
                                  name={`aksjonspunktGodkjenning.${index}.annet`}
                                  label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Annet" />}
                                  readOnly={readOnly}
                                />
                              </div>
                            </div>
                          </Fieldset>
                        </FlexRow>
                      </FlexContainer>
                    )}
                    <div className="mt-4">
                      <TextAreaField
                        name={`aksjonspunktGodkjenning.${index}.besluttersBegrunnelse`}
                        label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Begrunnelse" />}
                        validate={[required, minLength3, maxLength2000, hasValidText]}
                        readOnly={readOnly}
                        maxLength={2000}
                      />
                    </div>
                  </ArrowBox>
                )}
              </Fieldset>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default AksjonspunktGodkjenningFieldArray;
