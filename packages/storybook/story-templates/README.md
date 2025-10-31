# Story templates

- Bruk `component.stories.template.tsx` som utgangspunkt når du lager nye stories.
- Filendelsen `.stories.template.tsx` gjør at Storybook ikke plukker den opp; kopier og gi filen et navn som ender på `.stories.tsx` i pakken der komponenten bor.

Retningslinjer:

- Default story skal være interaktiv (args/controls), men uten `play`.
- Opptil flere stories med `play` er fint for å teste ulik funksjonalitet. Disse kjøres i test-runner (`yarn build-storybook-test` + `yarn test-storybook`).
- Hvis det er et interaktivt form burde det testes om det går an å redigere og submitte.
- Validering samles i én story som viser feilmeldinger og gjerne bruker `play` for å trigge dem.

Hva malen inneholder:

- `Default`: Interaktiv story uten `play`.
- `SuccessfulSubmission`: Eksempel på funksjonalitetstest med `play`.
- `Validation`: Én story som demonstrerer validering med `play`.
- `PrototypeMock`: Eksempel på prototype-basert mock av klasse-klient i `play`.

Konvensjoner:

- Unngå MSW for nye stories; bruk byggere/fixtures eller prototype-basert mocking.

Språkpolicy:

- Domenespråk på norsk (f.eks. «Saksoversikt», «Send vedtak»).
- Tekniske begreper på engelsk (f.eks. endpoint, mock, fetch, feature toggle).
