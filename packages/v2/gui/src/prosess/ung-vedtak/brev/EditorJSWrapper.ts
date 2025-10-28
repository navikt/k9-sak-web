import EditorJS, { type API, type EditorConfig, type ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import edjsHTML from 'editorjs-html';

export default class EditorJSWrapper {
  private editor: EditorJS;

  constructor({ holder, onChange }: { holder: string; onChange: (api: API, event: CustomEvent<any>) => void }) {
    const tools: EditorConfig['tools'] = {
      paragraph: {
        class: Paragraph as unknown as ToolConstructable,
        inlineToolbar: true,
        config: {
          preservedBlank: true,
        },
      },
      header: {
        class: Header as unknown as ToolConstructable,
        inlineToolbar: true,
        config: {
          levels: [2, 1],
          defaultLevel: 1,
          preservedBlank: true,
        },
      },
      list: {
        class: List as unknown as ToolConstructable,
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

 public async importer(html: string) {
    await this.editor.isReady;
    let sanitizedHtml = html;
    
    // Erstatte alle newlines og multiple spaces med single space
    sanitizedHtml = html.replace(/\s+/g, ' ');
    
    // Fjerne space rett etter opening tags
    sanitizedHtml = sanitizedHtml.replace(/(<[^/>][^>]*>)\s+/g, '$1');
    
    // Fjerne space rett før closing tags
    sanitizedHtml = sanitizedHtml.replace(/\s+(<\/[^>]+>)/g, '$1');
    
    // Fjerne space mellom tags
    sanitizedHtml = sanitizedHtml.replace(/>\s+</g, '><');
    
    await this.editor.blocks.renderFromHTML(sanitizedHtml);
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
