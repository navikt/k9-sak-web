import React from 'react';
import { OpptjeningAktiviteter } from '@k9-sak-web/types';

import OpptjeningTotrinnText from './OpptjeningTotrinnText';
import shallowWithIntl from '../../../i18n/index';

const lagOpptjeningAktivitetArbeidMedNavn = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: 'Andersen Transport AS',
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitetArbeidUtenNavn = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: null,
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitet = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Aktivitet',
  arbeidsgiverNavn: null,
  orgnr: null,
  godkjent: resultat === 'GODKJENT',
});

describe('<OpptjeningTotrinnnText>', () => {
  it('skal vise korrekt tekst for opptjening med endring av arbeid med navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('ENDRING')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.EndringArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med endring av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('ENDRING')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.EndringArbeidUtenNavn');
  });

  it('skal vise korrekt tekst for opptjening med endring av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('ENDRING')} />);
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.EndringAktivitet');
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid med navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('GODKJENT')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.GodkjenningArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('GODKJENT')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.GodkjenningArbeidUtenNavn');
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('GODKJENT')} />);
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.GodkjenningAktivitet');
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid med navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('UNDERKJENNING')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(
      <OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('UNDERKJENNING')} />,
    );
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn');
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('UNDERKJENNING')} />);
    const normaltekstFields = wrapper.find('MemoizedFormattedMessage');
    expect(normaltekstFields).toHaveLength(1);
    expect(normaltekstFields.at(0).prop('id')).toEqual('ToTrinnsForm.Opptjening.UnderkjenningAktivitet');
  });
});
