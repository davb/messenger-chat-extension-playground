const {expect} = require('./helper')
const boilerplate = require('../src')


describe("boilerplate", () => {
  it("is awesome", () => {
    expect(boilerplate()).to.eq('awesome')
  })
})
