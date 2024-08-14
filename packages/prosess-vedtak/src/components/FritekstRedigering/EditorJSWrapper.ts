import EditorJS, { API, type EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import edjsHTML from 'editorjs-html';

export default class EditorJSWrapper {
  private editor: EditorJS;

  constructor({ holder, onChange }: { holder: string; onChange: (api: API, event: CustomEvent<any>) => void }) {
    const tools: EditorConfig['tools'] = {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
          preservedBlank: true,
        },
      },
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          levels: [2, 1],
          defaultLevel: 1,
          preservedBlank: true,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
          preservedBlank: true,
        },
      },
    };
    this.editor = new EditorJS({
      holder,
      minHeight: 0,
      tools,
      onChange,
    });
  }

  public async importer(html) {
    await this.editor.isReady;
    await this.editor.blocks.renderFromHTML(html);
    return true;
  }

  public async erKlar() {
    return this.editor.isReady;
  }

  public async lagre() {
    const innhold = await this.editor.save();
    const edjsParser = edjsHTML();
    return edjsParser.parse(innhold).join('');
  }
}
