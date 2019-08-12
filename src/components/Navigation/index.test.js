import React from 'react';
import renderer from 'react-test-renderer';
import {Navigation} from './index';
import { BrowserRouter as Router, Link } from 'react-router-dom';

test('Link changes the class when hovered', () => {
  const testRenderer = renderer.create(
    <Router>
    <div>
    <Navigation  authUser={false}></Navigation>,
    </div>
    </Router>
  );
  let tree = testRenderer.toJSON();
  const root = testRenderer.root
  // console.log(tree,root.findAllByType(Link));
  expect(
    
    root.findAllByType(Link).some((el)=> {
      console.log(el.instance.props.children === 'Sign In');
      return el.instance.props.children === 'Sign In'
        })
  ).toBe(true);



    expect(root.findAllByType(Link).length).toBe(2);

console.log('====================================');
// console.log(testRenderer.toTree());
console.log('====================================');
  

});
test('Show navigation for logged in user', () => {
  const testRenderer = renderer.create(
    <Router>
    <div>
    <Navigation  authUser={true}></Navigation>,
    </div>
    </Router>
  );
  let tree = testRenderer.toJSON();
  const root = testRenderer.root
  expect(
    
    root.findAllByType(Link).some((el)=> {
      console.log(el.instance.props.children === 'Home');
      return el.instance.props.children === 'Home'
        })
  ).toBe(true);

console.log('====================================');
// console.log(testRenderer.toTree());
console.log('====================================');
  

});
