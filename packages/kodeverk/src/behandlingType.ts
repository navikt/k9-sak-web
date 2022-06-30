const behandlingType = {
  FORSTEGANGSSOKNAD: 'BT-002',
  KLAGE: 'BT-003',
  UNNTAK: 'BT-010',
  REVURDERING: 'BT-004',
  SOKNAD: 'BT-005',
  DOKUMENTINNSYN: 'BT-006',
  TILBAKEKREVING: 'BT-007',
  ANKE: 'BT-008',
  TILBAKEKREVING_REVURDERING: 'BT-009',
};

export const erTilbakekrevingType = (type: string) =>
  behandlingType.TILBAKEKREVING === type || behandlingType.TILBAKEKREVING_REVURDERING === type;

export default behandlingType;
