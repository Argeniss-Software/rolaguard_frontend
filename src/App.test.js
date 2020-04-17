import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import Router from "./App.router"

// Inside your general `Describe`
// let appWrapper;
// const props = {
//   // Your props goes here..
// };
// beforeEach(() => {
//   appWrapper = shallow(<YourComponent {...props} />);
// });

test('App renders correctly', () => {
  const wrapper = shallow(<App />);

  const instance = wrapper.instance(); // you assign your instance of the wrapper
  jest.spyOn(instance, 'initReCaptcha'); // You spy on the randomFunction
  instance.componentDidMount();
  expect(instance.initReCaptcha).toHaveBeenCalledTimes(1); // You check if the condition you want to match is correct.

  // expect(wrap).toContainReact(<Router style={{ height: "100vh" }}/>);
});
