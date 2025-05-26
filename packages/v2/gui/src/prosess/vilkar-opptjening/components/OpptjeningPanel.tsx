import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import AksjonspunktBox from '../../../shared/aksjonspunktBox/AksjonspunktBox';
import type { VilkårFieldFormValues } from '../types/VilkårFieldFormValues';
import styles from './opptjeningPanel.module.css';

interface OwnProps {
  title: string;
  behandlingId: number;
  behandlingVersjon: number;
  lovReferanse?: string;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
  originalErVilkarOk?: boolean;
  readOnly: boolean;
  isDirty?: boolean;
  children: ReactNode | ReactNode[];
  isPeriodisertFormComplete?: boolean;
  skjulAksjonspunktVisning?: boolean;
  aksjonspunktErLøst?: boolean;
  redigerOpptjening: boolean;
  setRedigerOpptjening: (redigerOpptjening: boolean) => void;
}

/*
 * OpptjeningPanel
 *
 * Presentasjonskomponent.
 */
const OpptjeningPanel = ({
  lovReferanse,
  title,
  originalErVilkarOk,
  isAksjonspunktOpen,
  readOnly,
  children,
  skjulAksjonspunktVisning,
  aksjonspunktErLøst,
  redigerOpptjening,
  setRedigerOpptjening,
}: OwnProps) => {
  const formMethods = useFormContext<VilkårFieldFormValues>();
  return (
    <>
      <VStack gap="4">
        <HStack gap="4">
          {aksjonspunktErLøst ? (
            originalErVilkarOk ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            )
          ) : null}
          <Heading size="small" level="2">
            {title}
          </Heading>
          {lovReferanse && (
            <Detail className={styles.vilkar}>
              <Lovreferanse>{lovReferanse}</Lovreferanse>
            </Detail>
          )}
        </HStack>

        <div>
          {aksjonspunktErLøst && (
            <>
              {originalErVilkarOk && (
                <Label size="small" as="p">
                  Vilkåret er oppfylt
                </Label>
              )}
              {originalErVilkarOk === false && (
                <Label size="small" as="p">
                  Vilkåret er avslått
                </Label>
              )}
            </>
          )}
          {!isAksjonspunktOpen && originalErVilkarOk === undefined && (
            <BodyShort size="small">Ikke behandlet</BodyShort>
          )}
        </div>
      </VStack>
      {isAksjonspunktOpen && <div className="mt-2" />}
      <AksjonspunktBox erAksjonspunktApent={isAksjonspunktOpen && !skjulAksjonspunktVisning}>
        {children}
        {!readOnly && <div className="mt-4" />}
        {!skjulAksjonspunktVisning && !readOnly && (
          <div className="flex gap-2">
            <Button variant="primary" size="small" loading={formMethods.formState.isSubmitting} type="submit">
              Bekreft og fortsett
            </Button>
            {redigerOpptjening && (
              <Button
                variant="tertiary"
                size="small"
                type="button"
                onClick={() => setRedigerOpptjening(!redigerOpptjening)}
              >
                Avbryt
              </Button>
            )}
          </div>
        )}
      </AksjonspunktBox>
    </>
  );
};

export default OpptjeningPanel;
