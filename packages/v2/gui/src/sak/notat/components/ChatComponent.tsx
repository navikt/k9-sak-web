import type { InnloggetAnsattDto, NotatDto } from '@k9-sak-web/backend/k9sak/generated';
import { EyeSlashIcon, EyeWithPupilIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Chat, Label, Tag } from '@navikt/ds-react';
import { Form, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSaksbehandlerOppslag } from '../../../shared/hooks/useSaksbehandlerOppslag';
import type { FormState } from '../types/FormState';
import styles from './chatComponent.module.css';

export enum ChatPosition {
  Left = 'left',
  Right = 'right',
}

export interface EndreNotatPayload {
  formState: FormState;
  id: string;
  saksnummer: string;
  versjon: number;
}

export interface SkjulNotatPayload {
  skjul: boolean;
  id: string;
  saksnummer: string;
  versjon: number;
}

interface ChatComponentProps {
  notat: NotatDto;
  endreNotat: ({ formState, id, saksnummer, versjon }: EndreNotatPayload) => void;
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  skjulNotat: ({ skjul, id, saksnummer, versjon }: SkjulNotatPayload) => void;
  fagsakId: string;
}

const ChatComponent: React.FunctionComponent<ChatComponentProps> = ({
  notat,
  endreNotat,
  navAnsatt,
  skjulNotat,
  fagsakId,
}) => {
  const {
    endretTidspunkt,
    gjelderType,
    notatId,
    notatTekst,
    opprettetAv,
    opprettetTidspunkt,
    versjon,
    skjult,
    kanRedigere,
  } = notat;
  const position = opprettetAv === navAnsatt.brukernavn ? ChatPosition.Right : ChatPosition.Left;

  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  const minLength3 = minLength(3);
  const maxLength2000 = maxLength(1500);

  const formMethods = useForm<FormState>({
    defaultValues: {
      notatTekst,
    },
    shouldUnregister: true,
  });
  const { reset } = formMethods;
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    reset({
      notatTekst,
    });
    setReadOnly(true);
  }, [reset, notatTekst, versjon]);

  const submit = (data: FormState) => {
    if (notatId) {
      endreNotat({ formState: data, id: notatId, saksnummer: fagsakId, versjon });
    }
  };

  const toggleReadOnly = () => {
    setReadOnly(current => !current);
  };

  const toggleSkjulNotat = () => {
    if (notatId) {
      skjulNotat({ skjul: !skjult, id: notatId, saksnummer: fagsakId, versjon });
    }
  };

  const navnPåOppretter =
    opprettetAv === navAnsatt.brukernavn ? 'Deg' : opprettetAv ? hentSaksbehandlerNavn(opprettetAv) : 'Saksbehandler';

  const tidspunktStreng = () => {
    const formatertOpprettetTidspunkt = opprettetTidspunkt ? format(new Date(opprettetTidspunkt), 'dd.MM.yy H:mm') : '';
    const formatertEndretTidspunkt = endretTidspunkt ? format(new Date(endretTidspunkt), 'dd.MM.yy H:mm') : undefined;
    if (endretTidspunkt) {
      return `${formatertOpprettetTidspunkt} (Endret: ${formatertEndretTidspunkt})`;
    }
    return formatertOpprettetTidspunkt;
  };

  return (
    <Form<FormState>
      formMethods={formMethods}
      onSubmit={submit}
      className={position === ChatPosition.Right ? styles.chatRight : styles.chatLeft}
    >
      <Chat
        name={navnPåOppretter}
        timestamp={tidspunktStreng()}
        position={position}
        variant={position === ChatPosition.Right ? 'info' : 'neutral'}
      >
        <Chat.Bubble>
          {readOnly ? (
            <BodyLong size="small">{notatTekst}</BodyLong>
          ) : (
            <>
              <TextAreaField
                name="notatTekst"
                validate={[required, minLength3, maxLength2000]}
                hideLabel
                label="Har du noen tilbakemeldinger?"
                className={styles.nyttNotatTekst}
                maxLength={2000}
              />
              <div className={styles.nyttNotatKnappContainer}>
                <Button size="small" variant="primary">
                  Lagre endringer
                </Button>
                <Button onClick={toggleReadOnly} variant="secondary" size="small">
                  Avbryt
                </Button>
              </div>
            </>
          )}
          <div className={styles.notatContainer}>
            <div className={styles.labelTagContainer}>
              <Label as="p" size="small">
                Gjelder:
              </Label>
              <Tag className={styles.navnTag} size="small" variant="neutral">
                {gjelderType}
              </Tag>
            </div>
            {readOnly && (
              <div className={styles.redigerSkjulNotatKnappContainer}>
                {kanRedigere && (
                  <Button
                    className={styles.redigerSkjulKnapp}
                    onClick={toggleReadOnly}
                    size="xsmall"
                    variant="tertiary"
                    icon={<PencilIcon aria-hidden />}
                  >
                    Rediger
                  </Button>
                )}
                <Button
                  onClick={toggleSkjulNotat}
                  className={styles.redigerSkjulKnapp}
                  size="xsmall"
                  variant="tertiary"
                  icon={skjult ? <EyeSlashIcon aria-hidden /> : <EyeWithPupilIcon aria-hidden />}
                  type="button"
                >
                  {skjult ? 'Vis notat' : 'Skjul notat'}
                </Button>
              </div>
            )}
          </div>
        </Chat.Bubble>
      </Chat>
    </Form>
  );
};
export default ChatComponent;
