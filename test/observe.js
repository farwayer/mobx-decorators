import {observable, action} from 'mobx'
import {observe} from '../'


describe('observe', () => {
  it('should fail if @observe called without params', () => {
    (() => class User {
      @observe
      @observable
      loggedIn = false;
    }).should.throw()
  });


  it('should fail if @observe defined after @observable', () => {
    (() => class User {
      @observable
      @observe(() => {})
      loggedIn = false;
    }).should.throw()
  });


  it('should @observe be called', () => {
    let loginCount = -1;

    class User {
      @observe(value => loginCount = value)
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    loginCount.should.be.equal(1);
  });


  it('should @observe chain works', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @observe(() => firstCalled = true)
      @observe(() => secondCalled = true)
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();
  });


  it('should @observe with invokeImmediately called while init', () => {
    let loginCount = -1;

    class User {
      @observe(value => loginCount = value, true)
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);
    loginCount.should.be.equal(0);
  });
});
