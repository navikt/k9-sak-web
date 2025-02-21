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

  private cleanHtmlForEditor(html: string): string {
    // Rense HTML for å fjerne unødvendige tags og mellomrom
    return html
      .replace(/\s{2,}/g, ' ') // Erstatt alle mellomrom med enkelt mellomrom
      .replace(/>\s+</g, '><') // Fjern mellomrom mellom tags
      .replace(/<p>\s*<\/p>/g, '') // Fjerne tomme <p> tags
      .replace(/<div>\s*<\/div>/g, '') // Fjerne tomme <div> tags
      .replace(/<br\s*\/?>/g, '') // Fjern <br> tags
      .trim();
  }

  public async importer(html: string) {
    await this.editor.isReady;
    const cleanedHtml = this.cleanHtmlForEditor(html);
    await this.editor.blocks.renderFromHTML(cleanedHtml);
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
