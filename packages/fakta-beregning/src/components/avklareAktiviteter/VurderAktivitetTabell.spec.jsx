import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { RadioGroupField } from '@fpsak-frontend/form';
import { EditedIcon, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import VurderAktiviteterTabell, { lagAktivitetFieldId, skalVurdereAktivitet } from './VurderAktiviteterTabell';

const aktivitet1 = {
    arbeidsgiverIdent: '384723894723',
    fom: '2019-01-01',
    tom: null,
    skalBrukes: null,
    arbeidsforholdType: {kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE'},
};

const aktivitet2 = {
    arbeidsgiverIdent: '334534623342',
    eksternArbeidsforholdId: '123456',
    arbeidsforholdId: '45fse23324',
    fom: '2019-01-01',
    tom: '2019-02-02',
    skalBrukes: true,
    arbeidsforholdType: {kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE'},
};

const aktivitet3 = {
    arbeidsgiverIdent: '324234234234',
    eksternArbeidsforholdId: '56789',
    arbeidsforholdId: '63f3f32',
    fom: '2019-01-01',
    tom: '2019-02-02',
    skalBrukes: false,
    arbeidsforholdType: {kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE'},
};

const aktivitetAAP = {
    arbeidsgiverIdent: null,
    arbeidsforholdType: {kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE'},
    fom: '2019-01-01',
    tom: '2020-02-02',
    skalBrukes: null,
};

const aktivitetVentelonnVartpenger = {
    arbeidsgiverIdent: null,
    arbeidsforholdType: {kode: 'VENTELØNN_VARTPENGER', kodeverk: 'OPPTJENING_AKTIVITET_TYPE'},
    fom: '2019-01-01',
    tom: '2020-02-02',
    skalBrukes: null,
};

const arbeidsgiverOpplysningerPerId = {
    384723894723: {
        identifikator: '384723894723',
        referanse: '384723894723',
        navn: 'Arbeidsgiveren',
        fødselsdato: null,
        arbeidsforholdreferanser: [],
    },
    334534623342: {
        identifikator: '334534623342',
        referanse: '334534623342',
        navn: 'Arbeidsgiveren2',
        fødselsdato: null,
        arbeidsforholdreferanser: [{
            eksternArbeidsforholdId: '123456',
            internArbeidsforholdId: '45fse23324'
        }],
    },
    324234234234: {
        identifikator: '324234234234',
        referanse: '324234234234',
        navn: 'Arbeidsgiveren3',
        fødselsdato: null,
        arbeidsforholdreferanser: [
            {
                eksternArbeidsforholdId: '56789',
                internArbeidsforholdId: '63f3f32',
            }
        ]
    },
};

const aktiviteter = [aktivitet1, aktivitet2, aktivitet3, aktivitetAAP];

const alleKodeverk = {
    [kodeverkTyper.OPPTJENING_AKTIVITET_TYPE]: [
        {
            kode: opptjeningAktivitetType.ARBEID,
            navn: 'Arbeid',
        },
        {
            kode: opptjeningAktivitetType.FRILANS,
            navn: 'Frilans',
        },
        {
            kode: opptjeningAktivitetType.DAGPENGER,
            navn: 'Dagpenger',
        },
        {
            kode: opptjeningAktivitetType.NARING,
            navn: 'Næring',
        },
        {
            kode: opptjeningAktivitetType.AAP,
            navn: 'Arbeidsavklaringspenger',
        },
    ],
};

describe('<VurderAktiviteterTabell>', () => {
    it('skal vise tabell', () => {
        const wrapper = shallow(
            <VurderAktiviteterTabell
                readOnly={false}
                isAvklaringsbehovClosed
                aktiviteter={aktiviteter}
                skjaeringstidspunkt="2019-02-01"
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                erOverstyrt={false}
                harAvklaringsbehov
                fieldArrayID="dummyId"
            />,
        );

        const heading = wrapper.find(FormattedMessage).first();
        expect(heading.props().id).to.equal('VurderAktiviteterTabell.FullAAPKombinert.Overskrift');

        const table = wrapper.find(Table);
        expect(table).has.length(1);
        const rows = table.find(TableRow);
        expect(rows).has.length(4);

        const cols = rows.first().find(TableColumn);
        expect(cols).has.length(4);
        const radios1 = rows.first().find(RadioGroupField);
        expect(radios1).has.length(2);
        radios1.forEach(radio => {
            expect(radio.props().readOnly).to.equal(false);
        });

        const cols2 = rows.at(1).find(TableColumn);
        expect(cols2).has.length(4);
        const radios2 = rows.at(1).find(RadioGroupField);
        expect(radios2).has.length(2);
        radios2.forEach(radio => {
            expect(radio.props().readOnly).to.equal(false);
        });

        const cols3 = rows.last().find(TableColumn);
        expect(cols3).has.length(4);
        const radios3 = rows.last().find(RadioGroupField);
        expect(radios3).has.length(2);
        radios3.forEach(radio => {
            expect(radio.props().readOnly).to.equal(true);
        });
    });

    it('skal vise tabell med ventelønn/vartpenger overskrift', () => {
        const utenAAP = [aktivitet1, aktivitet2, aktivitetVentelonnVartpenger];
        const wrapper = shallow(
            <VurderAktiviteterTabell
                readOnly={false}
                isAvklaringsbehovClosed
                aktiviteter={utenAAP}
                skjaeringstidspunkt="2019-02-01"
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                erOverstyrt={false}
                harAvklaringsbehov
                fieldArrayID="dummyId"
            />,
        );

        const heading = wrapper.find(FormattedMessage).first();
        expect(heading.props().id).to.equal('VurderAktiviteterTabell.VentelonnVartpenger.Overskrift');

        const table = wrapper.find(Table);
        expect(table).has.length(1);
        const rows = table.find(TableRow);
        expect(rows).has.length(3);

        rows.forEach(row => {
            const radios = row.find(RadioGroupField);
            expect(radios).has.length(2);
            radios.forEach(radio => {
                expect(radio.props().readOnly).to.equal(false);
            });
        });
    });

    it('skal vise tabell med gul mann kolonne for alle rader unntatt AAP', () => {
        const wrapper = shallow(
            <VurderAktiviteterTabell
                readOnly
                isAvklaringsbehovClosed
                aktiviteter={aktiviteter}
                skjaeringstidspunkt="2019-02-01"
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                erOverstyrt={false}
                harAvklaringsbehov
                fieldArrayID="dummyId"
            />,
        );

        const heading = wrapper.find(FormattedMessage).first();
        expect(heading.props().id).to.equal('VurderAktiviteterTabell.FullAAPKombinert.Overskrift');

        const table = wrapper.find(Table);
        expect(table).has.length(1);
        const rows = table.find(TableRow);
        expect(rows).has.length(4);

        const cols = rows.first().find(TableColumn);
        expect(cols).has.length(5);
        const radios1 = rows.first().find(RadioGroupField);
        expect(radios1).has.length(2);
        radios1.forEach(radio => {
            expect(radio.props().readOnly).to.equal(true);
        });
        const edited1 = rows.first().find(EditedIcon);
        expect(edited1).has.length(1);

        const cols2 = rows.at(1).find(TableColumn);
        expect(cols2).has.length(5);
        const radios2 = rows.at(1).find(RadioGroupField);
        expect(radios2).has.length(2);
        radios2.forEach(radio => {
            expect(radio.props().readOnly).to.equal(true);
        });
        const edited2 = rows.at(1).find(EditedIcon);
        expect(edited2).has.length(1);

        const cols3 = rows.last().find(TableColumn);
        expect(cols3).has.length(5);
        const radios3 = rows.last().find(RadioGroupField);
        expect(radios3).has.length(2);
        radios3.forEach(radio => {
            expect(radio.props().readOnly).to.equal(true);
        });
        const edited3 = rows.last().find(EditedIcon);
        expect(edited3).has.length(0);
    });

    const id1 = '3847238947232019-01-01';
    it('skal lage id for arbeid', () => {
        const idArbeid = lagAktivitetFieldId(aktivitet1);
        expect(idArbeid).to.equal(id1);
    });

    const id2 = '3345346233421234562019-01-01';
    it('skal lage id for arbeid med arbeidsforholdId', () => {
        const idArbeid = lagAktivitetFieldId(aktivitet2);
        expect(idArbeid).to.equal(id2);
    });

    const id3 = '324234234234567892019-01-01';

    const idAAP = 'AAP2019-01-01';
    it('skal lage id for AAP', () => {
        const idArbeid = lagAktivitetFieldId(aktivitetAAP);
        expect(idArbeid).to.equal(idAAP);
    });

    it('skal bygge initial values', () => {
        const initialValues = VurderAktiviteterTabell.buildInitialValues(
            aktiviteter,
            false,
            true,
        );

        expect(initialValues[id1].fom).to.equal('2019-01-01');
        expect(initialValues[id1].tom).to.equal(null);
        expect(initialValues[id1].skalBrukes).to.equal(null);

        expect(initialValues[id2].fom).to.equal('2019-01-01');
        expect(initialValues[id2].tom).to.equal('2019-02-02');
        expect(initialValues[id2].skalBrukes).to.equal(true);

        expect(initialValues[id3].fom).to.equal('2019-01-01');
        expect(initialValues[id3].tom).to.equal('2019-02-02');
        expect(initialValues[id3].skalBrukes).to.equal(false);

        expect(initialValues[idAAP].fom).to.equal('2019-01-01');
        expect(initialValues[idAAP].tom).to.equal('2020-02-02');
        expect(initialValues[idAAP].skalBrukes).to.equal(true);
    });

    it('skal bygge initial values for overstyrer', () => {
        const initialValues = VurderAktiviteterTabell.buildInitialValues(
            aktiviteter,
            false,
            false,
        );
        expect(initialValues[id1].fom).to.equal('2019-01-01');
        expect(initialValues[id1].tom).to.equal(null);
        expect(initialValues[id1].skalBrukes).to.equal(true);

        expect(initialValues[id2].fom).to.equal('2019-01-01');
        expect(initialValues[id2].tom).to.equal('2019-02-02');
        expect(initialValues[id2].skalBrukes).to.equal(true);

        expect(initialValues[id3].fom).to.equal('2019-01-01');
        expect(initialValues[id3].tom).to.equal('2019-02-02');
        expect(initialValues[id3].skalBrukes).to.equal(false);

        expect(initialValues[idAAP].fom).to.equal('2019-01-01');
        expect(initialValues[idAAP].tom).to.equal('2020-02-02');
        expect(initialValues[idAAP].skalBrukes).to.equal(true);
    });

    it('skal transform values', () => {
        const values = {};
        values[id1] = {skalBrukes: true};
        values[id2] = {skalBrukes: false};
        values[id3] = {skalBrukes: false};
        values[idAAP] = {skalBrukes: true};
        const transformed = VurderAktiviteterTabell.transformValues(values, aktiviteter);
        expect(transformed.length).to.equal(2);
        expect(transformed[0].arbeidsforholdRef).to.equal(aktivitet2.arbeidsforholdId);
        expect(transformed[0].fom).to.equal('2019-01-01');
        expect(transformed[0].tom).to.equal('2019-02-02');
        expect(transformed[0].arbeidsgiverIdentifikator).to.equal('334534623342');
        expect(transformed[0].skalBrukes).to.equal(false);

        expect(transformed[1].arbeidsforholdRef).to.equal(aktivitet3.arbeidsforholdId);
        expect(transformed[1].fom).to.equal('2019-01-01');
        expect(transformed[1].tom).to.equal('2019-02-02');
        expect(transformed[1].arbeidsgiverIdentifikator).to.equal('324234234234');
        expect(transformed[1].skalBrukes).to.equal(false);
    });

    it('skal ikkje vurdere AAP for ikkje overstyring', () => {
        const skalVurderes = skalVurdereAktivitet(aktivitetAAP, false, true);
        expect(skalVurderes).to.equal(false);
    });

    it('skal vurdere annen aktivitet for overstyring', () => {
        const skalVurderes = skalVurdereAktivitet(aktivitet1, true, true);
        expect(skalVurderes).to.equal(true);
    });

    it('skal vurdere annen aktivitet for ikkje overstyring', () => {
        const skalVurderes = skalVurdereAktivitet(aktivitet1, false, true);
        expect(skalVurderes).to.equal(true);
    });

    it('skal ikkje vurdere annen aktivitet for ikkje overstyring uten aksjonspunkt', () => {
        const skalVurderes = skalVurdereAktivitet(aktivitet1, false, false);
        expect(skalVurderes).to.equal(false);
    });
});
