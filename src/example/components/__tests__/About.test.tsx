import * as React from 'react';
import { expect } from 'chai';
import About from '../About';
import { shallow, ShallowWrapper } from 'enzyme';
import { RouteComponentProps } from 'react-router-dom';

describe('About component', () => {
    const props: RouteComponentProps<void> = undefined as any;
    it('should have a link to the project on GitHub', () => {
        const wrapper: ShallowWrapper<any, {}> = shallow(<About {...props} />);
        expect(wrapper
            .find('a')
            .find({ href: 'https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit' })
            .length)
            .to.equal(1);
    });
});
