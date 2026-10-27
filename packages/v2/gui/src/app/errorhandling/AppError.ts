export interface AppErrorInput {
  /**
   * Kort tittel på feil. Max 40 tegn, ellers blir teksten kutta
   */
  readonly title?: string;
  readonly message?: string;
  readonly cause?: Error;
}

/**
 * Istadenfor å kaste rein Error kan denne, eller subtype brukast. Kan då sette kort title tekst som blir vist som samandrag av feil.
 */
export class AppError extends Error {
  #title: string | undefined;

  constructor({ title, message, cause }: AppErrorInput) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message ?? cause?.message ?? title ?? 'Ingen feilmelding', options);
    if (title != null) {
      // Kort ned til 38 tegn pluss ellipsis viss over 40
      this.#title = title.length > 40 ? title.slice(0, 38) + '…' : title;
    }
    this.name = this.constructor.name;
  }

  get title() {
    return this.#title;
  }
}
