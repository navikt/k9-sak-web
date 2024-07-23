import { useReducer } from 'react';

type Reducer<State, Actions> = (state: State, dispatch: Actions) => State;
type Dispatch<A> = (action: A) => void;

/**
 * Denne klassen er tenkt brukt for å opprette nye instanser av reducer som beheld state mellom unmount + mount av komponent
 * der den er brukt. Klassen må derfor opprettast på ein global statisk posisjon i koden, altså utanfor komponenten som
 * skal bruke den, slik at den samme instansen av state blir verande intakt viss komponenten som bruker reducer blir
 * unmounted.
 *
 * Den kan dermed halde på state til ein komponent sjølv om den kanskje midlertidig blir fjerna frå DOM.
 *
 * Ideelt sett bør ikkje denne brukast, ein burde heller løfte state opp i komponent hierarkiet eller unngå å unmounte
 * komponent ein eigentleg ikkje er ferdig med å bruke. Der er ingen opprydding av state minnet etter unmount, så
 * ein bør i alle fall ikkje bruke mange instanser av denne samtidig.
 *
 * Når ein komponent bruker denne må det også heller ikkje opprettast fleire instanser av den, dei vil då dele det samme
 * globale minnet som vil føre til feil.
 */
export class StickyMemoryReducer<State> {
  #state: State | null = null;

  useStickyMemoryReducer<Actions>(reducer: Reducer<State, Actions>, initState: State): [State, Dispatch<Actions>] {
    const [state, dispatch] = useReducer(reducer, this.#state ?? initState);
    this.#state = state;
    return [state, dispatch];
  }
}
