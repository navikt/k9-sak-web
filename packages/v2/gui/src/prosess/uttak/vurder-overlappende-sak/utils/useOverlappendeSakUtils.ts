import { addDays, formatISO, isAfter, isBefore, isSameDay, startOfDay, subDays } from 'date-fns';
import { useFormContext, type FieldArrayWithId, type UseFieldArrayReplace } from 'react-hook-form';
import type { VurderOverlappendeSakFormData } from '../VurderOverlappendeSak';

export const useOverlappendeSakUtils = (
  fields: FieldArrayWithId<VurderOverlappendeSakFormData, 'perioder', 'id'>[],
  replace: UseFieldArrayReplace<VurderOverlappendeSakFormData, 'perioder'>,
) => {
  const { getValues } = useFormContext<VurderOverlappendeSakFormData>();

  const splittPeriode = (nyFom: Date, nyTom: Date, indexToSplit: number) => {
    const newFields: FieldArrayWithId<VurderOverlappendeSakFormData, 'perioder', 'id'>[] = [];

    fields.forEach((field, index) => {
      if (index < indexToSplit || index > indexToSplit) {
        // Behold perioder før og etter den som skal splittes
        newFields.push({ ...field, endretAutomatisk: false });
      } else if (index === indexToSplit) {
        const periodToSplit = fields[indexToSplit];
        if (!periodToSplit) throw new Error('Fant ikke perioden som skulle deles');
        const søkersUttaksgrad = getValues(`perioder.${index}.søkersUttaksgrad`);
        const valg = getValues(`perioder.${index}.valg`);

        if (
          isSameDay(new Date(nyFom), new Date(periodToSplit.periode.fom)) &&
          isSameDay(new Date(nyTom), new Date(periodToSplit.periode.tom))
        ) {
          // Ny periode er lik den gamle
          newFields.push({ ...field, endretAutomatisk: false });
          return;
        }

        // Hvis nyFom er senere en fom i perioden som skal splittes
        // Legg til en periode for å fylle ut starten av perioden som skal splittes.
        if (isAfter(startOfDay(new Date(nyFom)), startOfDay(new Date(periodToSplit.periode.fom)))) {
          newFields.push({
            ...field,
            periode: { fom: periodToSplit.periode.fom, tom: formatISO(subDays(nyFom, 1)) },
            id: '',
            søkersUttaksgrad,
            valg,
            endretAutomatisk: true,
          });
        }

        // Legg til den nye definerte perioden
        newFields.push({
          ...field,
          periode: { fom: formatISO(nyFom), tom: formatISO(nyTom) },
          id: '',
          søkersUttaksgrad,
          valg,
          endretAutomatisk: true,
        });

        // Hvis nyTom er tidligere enn tom i perioden som skal splittes
        // Legg til en periode for å fylle ut slutten av perioden som skal splittes.
        if (isBefore(startOfDay(new Date(nyTom)), startOfDay(new Date(periodToSplit.periode.tom)))) {
          newFields.push({
            ...field,
            periode: { fom: formatISO(addDays(nyTom, 1)), tom: formatISO(periodToSplit.periode.tom) },
            id: '',
            søkersUttaksgrad,
            valg,
            endretAutomatisk: true,
          });
        }
      }
    });
    console.log('replace', newFields);
    replace(newFields);
  };

  const slettPeriode = (indexToDelete: number) => {
    const periodeSomSkalSlettes = fields[indexToDelete];
    if (!periodeSomSkalSlettes) throw new Error('Fant ikke perioden som skulle slettes');

    const newFields: FieldArrayWithId<VurderOverlappendeSakFormData, 'perioder', 'id'>[] = [];

    fields.forEach((field, index) => {
      if (indexToDelete === 0) {
        // Hvis det er første periode som slettes, forleng neste periode
        if (index === 1) {
          newFields.push({
            ...field,
            periode: { fom: periodeSomSkalSlettes.periode.fom, tom: field.periode.tom },
            endretAutomatisk: true,
          });
        } else if (index !== indexToDelete) {
          // bare legge til perioder som ikke skal slettes
          newFields.push({ ...field, endretAutomatisk: false });
        }
      } else {
        // Hvis det ikke er første periode som slettes, forleng perioden før den som slettes
        if (index === indexToDelete - 1) {
          newFields.push({
            ...field,
            periode: { fom: field.periode.fom, tom: periodeSomSkalSlettes.periode.tom },
            endretAutomatisk: true,
          });
        } else if (index !== indexToDelete) {
          // ellers bare legge til perioder som ikke skal slettes
          newFields.push({ ...field, endretAutomatisk: false });
        }
      }
    });
    console.log('replace', newFields);
    replace(newFields);
  };

  return { splittPeriode, slettPeriode };
};
