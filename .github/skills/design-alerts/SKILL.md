---
name: design-alerts
description: 'Design decision for alerts in saksbehandling panels: InfoCard with InfoCard.Message instead of Alert, which data-color, and which filled icon with aria-hidden. USE FOR: creating, changing or reviewing alerts, warnings, info boxes or status messages to the saksbehandler (varsler, advarsler, infobokser, statusmeldinger).'
---

# Design decision: alerts

As a rule, use `InfoCard` with `InfoCard.Message` instead of `Alert` when a panel needs to alert the saksbehandler.

- Use only `data-color` `info`, `warning` or `danger`.
- Use the filled icon that belongs to the colour, always with `aria-hidden`. Check that the icon exists with `aksel_find_icons` (filter on `variant: "Fill"`).

  | `data-color` | When                                                         | Icon                              |
  | ------------ | ------------------------------------------------------------ | --------------------------------- |
  | `info`       | Neutral information that requires no action                  | `InformationSquareFillIcon`       |
  | `warning`    | The saksbehandler must act, or something blocks the behandling | `ExclamationmarkTriangleFillIcon` |
  | `danger`     | Something has failed or is invalid                           | `XMarkOctagonFillIcon`            |

- Use `size="small"` in saksbehandling panels.

```tsx
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { InfoCard } from '@navikt/ds-react';

<InfoCard data-color="warning" size="small">
  <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>
    <strong>Overstyring av vilkåret må vurderes.</strong> Bare en saksbehandler med overstyrerrolle kan vurdere den.
  </InfoCard.Message>
</InfoCard>;
```

## Exceptions

- If the alert needs a title, several paragraphs or buttons, use `InfoCard` with `InfoCard.Header`/`InfoCard.Title` and `InfoCard.Content`.
- Error messages that belong to a form field are shown on the field itself (the `error` prop), not in a separate alert.
