Retningslinjer:

- Default story skal være interaktiv (args/controls), men uten `play`.
- Opptil flere stories med `play` er fint for å teste ulik funksjonalitet. Disse kjøres i test-runner (`yarn build-storybook-test` + `yarn test-storybook`).
- Hvis det er et interaktivt form burde det testes om det går an å redigere og submitte.
- Validering kan samles i én eller flere stories som viser feilmeldinger og bruker `play` for å trigge dem.

Konvensjoner:

- Unngå MSW for nye stories; bruk mock av klient

Språkpolicy:

- Domenespråk på norsk (f.eks. «Saksoversikt», «Send vedtak»).
- Tekniske begreper på engelsk (f.eks. endpoint, mock, fetch, feature toggle).
