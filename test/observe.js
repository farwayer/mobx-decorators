import {observable, action} from 'mobx'
import {observe} from '../src'


describe('@observe', () => {
  it('should throw if @observe called without params', () => {
    (() => class User {
      @observe
      @observable
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


  it('should work if @observable defined before @observe', () => {
    let loginCount = -1;

    class User {
      @observable
      @observe(change => loginCount = change.newValue)
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


  it('should chain works if @observable defined before @observe', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @observable
      @observe(() => firstCalled = true)
      @observe(() => secondCalled = true)
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


  it('should attachInitializer works with several instances', () => {
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


    const user1 = new User();
    user1.should.have.property('loginCount').which.is.equal(0);

    user1.login();
    user1.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();


    firstCalled = false;
    secondCalled = false;

    const user2 = new User();
    user2.should.have.property('loginCount').which.is.equal(0);

    user2.login();
    user2.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();
  });


  it('should attachInitializer works with extending', () => {
    let firstCalled = false, secondCalled = false;

    class BaseUser {
      @observe(() => firstCalled = true)
      @observe(() => secondCalled = true)
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    class User extends BaseUser {}
    class Admin extends BaseUser {}


    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();


    firstCalled = false;
    secondCalled = false;

    const admin = new Admin();
    admin.should.have.property('loginCount').which.is.equal(0);

    admin.login();
    admin.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();
  });
});
