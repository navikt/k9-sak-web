import { useSaksbehandlerOppslag } from '@k9-sak-web/shared-components';
import { NavAnsatt, NotatResponse } from '@k9-sak-web/types';
import { EyeSlashIcon, EyeWithPupilIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Chat, Label, Tag } from '@navikt/ds-react';
import { Form, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import styles from './chatComponent.module.css';

export enum ChatPosition {
  Left = 'left',
  Right = 'right',
}

type Inputs = {
  notatTekst: string;
  visNotatIAlleSaker: boolean;
};

interface ChatComponentProps {
  notat: NotatResponse;
  postNotat: ({
    data,
    id,
    saksnummer,
    versjon,
  }: {
    data: Inputs;
    id: number;
    saksnummer: string;
    versjon: number;
  }) => void;
  navAnsatt: NavAnsatt;
  skjulNotat: ({
    skjul,
    id,
    saksnummer,
    versjon,
  }: {
    skjul: boolean;
    id: number;
    saksnummer: string;
    versjon: number;
  }) => void;
  fagsakId: string;
}

const ChatComponent: React.FunctionComponent<ChatComponentProps> = ({
  notat,
  postNotat,
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

  const formMethods = useForm<Inputs>({
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
  }, [reset, notatTekst]);

  const submit = (data: Inputs) => {
    postNotat({ data, id: notatId, saksnummer: fagsakId, versjon });
  };

  const toggleReadOnly = () => {
    setReadOnly(current => !current);
  };

  const toggleSkjulNotat = () => {
    skjulNotat({ skjul: !skjult, id: notatId, saksnummer: fagsakId, versjon });
  };

  const navnPåOppretter = opprettetAv === navAnsatt.brukernavn ? 'Deg' : hentSaksbehandlerNavn(opprettetAv);

  const tidspunktStreng = () => {
    const formatertOpprettetTidspunkt = format(new Date(opprettetTidspunkt), 'dd.MM.yy H:mm');
    const formatertEndretTidspunkt = endretTidspunkt ? format(new Date(endretTidspunkt), 'dd.MM.yy H:mm') : undefined;
    if (endretTidspunkt) {
      return `${formatertOpprettetTidspunkt} (Endret: ${formatertEndretTidspunkt})`;
    }
    return formatertOpprettetTidspunkt;
  };

  return (
    <Form<Inputs>
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
                <Button type="submit" size="small" variant="primary">
                  <FormattedMessage id="NotatISakIndex.LagreEndringer" />
                </Button>
                <Button onClick={toggleReadOnly} variant="secondary" size="small">
                  <FormattedMessage id="NotatISakIndex.Avbryt" />
                </Button>
              </div>
            </>
          )}
          <div className={styles.notatContainer}>
            <div className={styles.labelTagContainer}>
              <Label as="p" size="small">
                <FormattedMessage id="NotatISakIndex.Gjelder" />
              </Label>
              <Tag className={styles.navnTag} size="small" variant="neutral">
                {gjelderType.navn}
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
                    <FormattedMessage id="NotatISakIndex.Rediger" />
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
                  {skjult ? (
                    <FormattedMessage id="NotatISakIndex.VisNotat" />
                  ) : (
                    <FormattedMessage id="NotatISakIndex.SkjulNotat" />
                  )}
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
