import { Button, Modal } from '@navikt/ds-react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createIntl, IntlShape, RawIntlProvider } from 'react-intl';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import messages from '../../../i18n/nb_NO.json';
import FritekstEditor from './FritekstEditor.js';

const withRawIntlProvider =
  (intl: IntlShape): Decorator =>
  Story => {
    const [visRedigering, setVisRedigering] = React.useState(true);
    return (
      <RawIntlProvider value={intl}>
        <Button onClick={() => setVisRedigering(true)} size="small">
          Rediger brev
        </Button>
        <Modal open={visRedigering} onClose={() => setVisRedigering(false)} width="53.75rem" aria-label="Rediger brev">
          <Story />
        </Modal>
      </RawIntlProvider>
    );
  };

const intl = createIntl({
  locale: 'nb-NO',
  messages,
});

const meta = {
  title: 'prosess/prosess-vedtak/FritekstRedigering',
  component: FritekstEditor,
  decorators: [withRawIntlProvider(intl)],
} satisfies Meta<typeof FritekstEditor>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    kanInkludereKalender: true,
    skalBrukeOverstyrendeFritekstBrev: false,
    readOnly: false,
    redigerbartInnholdKlart: true,
    redigerbartInnhold: 'Storybook default scenario',
    originalHtml: 'OriginalHtml',
    prefiksInnhold: '',
    suffiksInnhold: '',
    brevStiler: '',
    handleSubmit: fn(),
    lukkEditor: fn(),
    handleForhåndsvis: fn(),
    setFieldValue: fn(),
  },
};

const customizedContent = 'Storybook customized scenario';
const addedContent = ' Added text';
export const AvansertMedPlayTest: StoryObj<typeof FritekstEditor> = {
  args: {
    ...Default.args,
    redigerbartInnhold: customizedContent,
    originalHtml: 'Storybook customized scenario originalt innhold',
    prefiksInnhold: 'Prefiks',
    suffiksInnhold: 'Suffiks',
  },
  play: async ({ canvas, args, canvasElement }) => {
    const prefixEl = canvas.getByText('Prefiks');
    await expect(prefixEl).toBeInTheDocument();
    const suffixEl = canvas.getByText('Suffiks');
    await expect(suffixEl).toBeInTheDocument();
    const contentBlock = canvasElement.querySelector('#rediger-brev');
    await expect(contentBlock).toBeInTheDocument();

    const submitBtn = canvas.getByRole('button', { name: 'Lagre og lukk' });
    await expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn, { delay: 100 });
    await waitFor(() => expect(args.handleSubmit).toHaveBeenCalledWith(`<p>${customizedContent}</p>`));
    const para = contentBlock.querySelector('.ce-paragraph.cdx-block');
    await userEvent.type(para, addedContent);
    await userEvent.click(submitBtn);
    await waitFor(() => expect(args.handleSubmit).toHaveBeenCalledWith(`<p>${customizedContent}${addedContent}</p>`));
  },
};
