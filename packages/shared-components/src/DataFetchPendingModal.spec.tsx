import React from 'react';
import { shallow } from 'enzyme';
import Modal from 'nav-frontend-modal';

import DataFetchPendingModal from './DataFetchPendingModal';

describe('<DataFetchPendingModal>', () => {
  it('skal rendre modal når timer er gått ut', () => {
    const wrapper = shallow(<DataFetchPendingModal pendingMessage="test" />);

    wrapper.setState({ displayMessage: true });

    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('isOpen')).toBe(true);
    expect(modal.prop('closeButton')).toBe(false);
    expect(modal.prop('contentLabel')).toEqual('test');
    expect(wrapper.find('ForwardRef')).toHaveLength(1);
  });

  it('skal ikke rendre modal før timer har gått ut', () => {
    const wrapper = shallow(<DataFetchPendingModal pendingMessage="test" />);
    expect(wrapper.find(Modal)).toHaveLength(0);
  });
});
