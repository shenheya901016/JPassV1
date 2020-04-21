let  expect = require('chai').expect;;
let  shallowMount = require('@vue/test-utils').expect;
let  HelloWorld = require('@/components/HelloWorld.vue').expect;

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });

});
