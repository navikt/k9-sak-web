import { EyeWithPupilIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Chat, Label, Tag } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { NotatGjelderType } from '../types/NotatGjelderType';
import { NotatResponse } from '../types/NotatResponse';

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
  postNotat: (data: Inputs, fagsakId?: string, notatGjelderType?: NotatGjelderType) => void;
}

const ChatComponent: React.FunctionComponent<ChatComponentProps> = ({ notat, postNotat }) => {
  const { notatTekst, endretAv, opprettetAv, endretTidspunkt, opprettetTidspunkt, gjelderType, fagsakId } = notat;
  const position = gjelderType === NotatGjelderType.pleietrengende ? ChatPosition.Right : ChatPosition.Left;
  const minLength3 = minLength(3);
  const maxLength2000 = maxLength(1500);
  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst,
      visNotatIAlleSaker: true,
    },
  });
  const [readOnly, setReadOnly] = useState(true);

  const submit = (data: Inputs) => postNotat(data, fagsakId, gjelderType);

  const toggleReadOnly = () => {
    setReadOnly(current => !current);
  };

  return (
    <Form<Inputs> formMethods={formMethods} onSubmit={submit}>
      <Chat
        name={endretAv || opprettetAv}
        timestamp={endretTidspunkt || opprettetTidspunkt}
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
              />
              <CheckboxField
                className="mt-2"
                name="visNotatIAlleSaker"
                label="Vis notat i alle saker tilknyttet pleietrengende"
                readOnly
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <Button type="submit" size="small" variant="primary">
                  <FormattedMessage id="NotatISakIndex.LagreEndringer" />
                </Button>
                <Button onClick={toggleReadOnly} variant="secondary" size="small">
                  <FormattedMessage id="NotatISakIndex.Avbryt" />
                </Button>
              </div>
            </>
          )}
          {readOnly && (
            <div className="flex justify-between items-center mt-5">
              <div className="flex items-baseline">
                <Label as="p" size="small">
                  <FormattedMessage id="NotatISakIndex.Gjelder" />
                </Label>
                <Tag className="ml-2" size="small" variant="neutral">
                  {gjelderType}
                </Tag>
              </div>
              <div className="flex">
                <Button onClick={toggleReadOnly} size="xsmall" variant="tertiary" icon={<PencilIcon aria-hidden />}>
                  <FormattedMessage id="NotatISakIndex.Rediger" />
                </Button>
                <Button className="ml-2.5" size="xsmall" variant="tertiary" icon={<EyeWithPupilIcon aria-hidden />}>
                  <FormattedMessage id="NotatISakIndex.SkjulNotat" />
                </Button>
              </div>
            </div>
          )}
        </Chat.Bubble>
      </Chat>
    </Form>
  );
};
export default ChatComponent;
