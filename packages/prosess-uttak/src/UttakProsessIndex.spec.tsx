import React from 'react';
import { shallow } from 'enzyme';
import UttakProsessIndex from './UttakProsessIndex';
import { behandlingPersonMap, uttaksplaner as uttaksplanerDto } from './components/dto/testdata';
import Uttak from './components/Uttak';
import Uttaksplan from './components/types/Uttaksplan';

describe('<UttakProsessIndex>', () => {
  it('mapper om dto og rendrer Uttak', () => {
    const wrapper = shallow(
      <UttakProsessIndex uttaksplaner={uttaksplanerDto} behandlingPersonMap={behandlingPersonMap} />,
    );

    const UttakComponent = wrapper.find(Uttak);
    expect(UttakComponent).toHaveLength(1);

    const uttaksplaner: Uttaksplan[] = UttakComponent.prop('uttaksplaner');
    expect(uttaksplaner).toHaveLength(Object.keys(uttaksplanerDto).length);
    uttaksplaner.forEach(uttaksplan => {
      const perioderDto = uttaksplanerDto[uttaksplan.behandlingId].perioder;
      uttaksplan.perioder.forEach(periode => {
        const fomTom = `${periode.fom}/${periode.tom}`;
        const periodeDto = perioderDto[fomTom];
        expect(periode.utfall).toEqual(periodeDto.utfall);
        expect(periode.grad).toEqual(periodeDto.grad);
        expect(periode.årsaker).toBeInstanceOf(Array);
      });
      expect(uttaksplan.person).toEqual(behandlingPersonMap[uttaksplan.behandlingId]);
    });
  });
});
