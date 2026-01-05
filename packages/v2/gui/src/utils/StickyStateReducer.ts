import { useReducer } from 'react';

type Reducer<State, Actions> = (state: State, dispatch: Actions) => State;
type Dispatch<A> = (action: A) => void;

/**
 * Denne klassen er tenkt brukt for å opprette nye instanser av reducer som beheld enkapsulert state mellom unmount + mount av komponent
 * der den er brukt. Instans av denne må derfor opprettast utanom komponenten som skal bruke den, og sendast ned som prop,
 * slik at samme instans blir verande intakt når komponent som bruker den blir unmounta + remounta.
 *
 * Den kan dermed halde på state til ein komponent sjølv om den kanskje midlertidig blir fjerna frå DOM.
 *
 * Sjå Messages.tsx for eksempel på bruk.
 *
 * Prøv å erstatte denne med state beholdt med vanleg useState eller useReducer i parent komponent.
 */
export class StickyStateReducer<State> {
  #state: State | null = null;
  #resetKey: string = '';

  useStickyStateReducer<Actions>(
    reducer: Reducer<State, Actions>,
    initState: State,
    resetKey: string,
  ): [State, Dispatch<Actions>] {
    const changedResetKey = resetKey !== this.#resetKey;
    this.#resetKey = resetKey;
    const [state, dispatch] = useReducer(reducer, changedResetKey ? initState : (this.#state ?? initState));
    this.#state = state;
    return [state, dispatch];
  }
}
