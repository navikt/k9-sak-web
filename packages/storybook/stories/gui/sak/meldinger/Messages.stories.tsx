import React, { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Messages, { BackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.tsx'
import { withKnobs } from "@storybook/addon-knobs";
import { FritekstbrevDokumentdata } from "@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js";
import ytelseTyper from "@k9-sak-web/backend/k9sak/extra/ytelseTyper.js";
import { templates } from "../../../mocks/brevmaler.js";
import arbeidsgivere from '../../../mocks/arbeidsgivere.json';
import personopplysninger from '../../../mocks/personopplysninger';

const meta: Meta<typeof Messages> = {
  title: 'gui/sak/meldinger/Messages.tsx',
  component: Messages,
  decorators: [withKnobs],
}
export default meta

type Story = StoryObj<typeof Messages>

const WidthLimit = ({maxWidthPx, children}: {maxWidthPx: number, children: ReactNode}) => <div style={{maxWidth: maxWidthPx}}>{children}</div>

const api: BackendApi = {
  async hentInnholdBrevmal(sakstype: string, eksternReferanse: string, maltype: string): Promise<FritekstbrevDokumentdata[]> {
    if(sakstype === ytelseTyper.OMP && maltype === "VARSEL_FRITEKST") {
      return [
        {tittel: "Varsel nr 1", fritekst: "Hei, du må sende inn ditt og datt før frist."},
        {tittel: "Varsel nr 2", fritekst: "Brev tekst forslag nr 2."},
      ]
    }
    return []
  }
}

export const DefaultStory: Story = {
  args: {
    sakstype: "OMP",
    eksternReferanse: "xxx-uuuu-iiii--dddd",
    maler: templates,
    personopplysninger,
    arbeidsgiverOpplysningerPerId: arbeidsgivere,
    api,
  },
  render: args =>
    <WidthLimit maxWidthPx={420}><Messages {...args} /></WidthLimit>
}
