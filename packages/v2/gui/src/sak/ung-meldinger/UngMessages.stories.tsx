import {
  InformasjonsbrevMottakerValgResponseIdType,
  KodeverdiSomObjektDokumentMalTypeKilde,
} from '@k9-sak-web/backend/ungsak/generated';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { asyncAction } from '../../storybook/asyncAction';
import withMaxWidth from '../../storybook/decorators/withMaxWidth';
import { FakeUngMessagesBackendApi } from '../../storybook/mocks/FakeUngMessagesBackendApi';
import { UngMessages } from './UngMessages';
import type { UngMessagesFormState } from './UngMessagesFormState';

const meta: Meta<typeof UngMessages> = {
  title: 'gui/sak/ung-meldinger/UngMessages',
  decorators: [withMaxWidth(420)],
  component: UngMessages,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [formValues, setFormValues] = useState<UngMessagesFormState | undefined>(undefined);
    const mockApi = new FakeUngMessagesBackendApi();
    const brevmaler = [
      {
        malType: {
          kode: 'GENERELT_FRITEKSTBREV',
          kodeverk: 'DOKUMENT_MAL_TYPE',
          navn: 'Fritekst generelt brev',
          kilde: KodeverdiSomObjektDokumentMalTypeKilde.GENERELT_FRITEKSTBREV,
        },
        mottakere: [
          {
            id: '9904458010078',
            idType: InformasjonsbrevMottakerValgResponseIdType.AKTØRID,
            navn: 'Kolibir Nina',
            fnr: '04458010078',
          },
        ],
        støtterFritekst: false,
        støtterTittelOgFritekst: true,
      },
    ];
    return (
      <UngMessages
        api={mockApi}
        behandlingId={1}
        språkkode="nb"
        onMessageSent={() => asyncAction('Melding er sendt')}
        brevmaler={brevmaler}
        ungMessagesFormValues={formValues}
        setUngMessagesFormValues={setFormValues}
      />
    );
  },
};
