import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import UttakProsessIndex from './UttakProsessIndex';
import { behandlingPersonMap, uttaksplaner as uttaksplanerDto } from './components/types/testdata';
import Uttak from './components/Uttak';
import Uttaksplan from './components/types/Uttaksplan';

describe('<UttakProsessIndex>', () => {
  it('mapper om dto og rendrer Uttak', () => {
    const wrapper = shallow(
      <UttakProsessIndex uttaksplaner={uttaksplanerDto} behandlingPersonMap={behandlingPersonMap} />,
    );

    const UttakComponent = wrapper.find(Uttak);
    expect(UttakComponent).to.have.length(1);

    const uttaksplaner: Uttaksplan[] = UttakComponent.prop('uttaksplaner');
    expect(uttaksplaner).to.have.length(Object.keys(uttaksplanerDto).length);
    uttaksplaner.forEach(uttaksplan => {
      const perioderDto = uttaksplanerDto[uttaksplan.behandlingId].perioder;
      uttaksplan.perioder.forEach(periode => {
        const fomTom = `${periode.fom}/${periode.tom}`;
        const periodeDto = perioderDto[fomTom];
        expect(periode.utfall).to.eql(periodeDto.utfall);
        expect(periode.grad).to.eql(periodeDto.grad);
        expect(periode.årsaker).to.be.a.instanceOf(Array);
      });
      expect(uttaksplan.person).to.eql(behandlingPersonMap[uttaksplan.behandlingId]);
    });
  });
});
