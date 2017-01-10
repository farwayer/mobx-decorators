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


  it('should handler be called', () => {
    let loginCount = -1;

    class User {
      @observe(change => loginCount = change.newValue)
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


  it('should chain works', () => {
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


  it('should @observe with invokeBeforeFirstAccess called while access', () => {
    let loginCount = -1;

    class User {
      @observe(change => loginCount = change.newValue, true)
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);
    loginCount.should.be.equal(0);
  });

  it('should work with extending', () => {
    class Store {
      @observe(() => {})
      @observable
      name = "Store";
    }

    class User extends Store {
      @observe(() => {})
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    class Post extends Store {
      @observe(() => {})
      @observable
      text = 0;
    }

    (() => {
      const post = new Post();
      const user = new User();
      user.login()
    }).should.not.throw()
  });


  it('should work if non-observe property accessed before', () => {
    let loginCount = -1;

    class User {
      @observe(change => loginCount = change.newValue)
      @observable
      loginCount = 0;

      @observable
      name = "John";

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    const name = user.name;

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    loginCount.should.be.equal(1);
  });
});
