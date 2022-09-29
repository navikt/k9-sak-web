import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import edjsHTML from 'editorjs-html';

export default class EditorJSWrapper {
  private editor: EditorJS;

  public async init({ holder }: { holder: string }) {
    const tools = {
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
          levels: [3, 2, 1],
          defaultLevel: 3,
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
    });
  }

  public harEditor() {
    if (this.editor) {
      return true;
    }
    return false;
  }

  public async importer(html) {
    await this.editor.isReady;
    await this.editor.blocks.renderFromHTML(html);
  }

  public async erKlar() {
    if (!this.editor) return false;
    return this.editor;
  }

  public async lagre() {
    return this.editor.save().then(innhold => {
      const edjsParser = edjsHTML();
      return edjsParser.parse(innhold).join('');
    });
  }
}
