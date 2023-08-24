import { EyeWithPupilIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, Chat, Label, Tag } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export enum ChatPosition {
  Left = 'left',
  Right = 'right',
}

interface ChatComponentProps {
  text: string;
  name: string;
  timestamp: string;
  subject: string;
  position?: ChatPosition;
}

const ChatComponent: React.FunctionComponent<ChatComponentProps> = ({
  text,
  name,
  timestamp,
  subject,
  position = ChatPosition.Left,
}) => (
  <Chat
    name={name}
    timestamp={timestamp}
    position={position}
    variant={position === ChatPosition.Right ? 'info' : 'neutral'}
  >
    <Chat.Bubble>
      {text}
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-baseline">
          <Label as="p" size="small">
            <FormattedMessage id="NotatISakIndex.Gjelder" />
          </Label>
          <Tag className="ml-2" size="small" variant="neutral">
            {subject}
          </Tag>
        </div>
        <div className="flex">
          <Button size="xsmall" variant="tertiary" icon={<PencilIcon aria-hidden />}>
            <FormattedMessage id="NotatISakIndex.Rediger" />
          </Button>
          <Button className="ml-2.5" size="xsmall" variant="tertiary" icon={<EyeWithPupilIcon aria-hidden />}>
            <FormattedMessage id="NotatISakIndex.SkjulNotat" />
          </Button>
        </div>
      </div>
    </Chat.Bubble>
  </Chat>
);

export default ChatComponent;
