import {observable, action} from 'mobx'
import {intercept, observe} from '../../src'


describe('@intercept', () => {
  it('should handler be called', () => {
    let loginCount = -1;

    class User {
      @intercept(change => {
        loginCount = change.newValue;
        return change;
      })
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
      @intercept(change => {
        firstCalled = true;
        return change;
      })
      @intercept(change => {
        secondCalled = true;
        return change;
      })
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


  it('should change ignore works', () => {
    class User {
      @intercept(change => {
        if (change.newValue !== 0) return;
        return change;
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(0);
  });


  it('should work in chain with @observe', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @observe(() => firstCalled = true)
      @intercept(change => {
        secondCalled = true;
        return change;
      })
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


  it('should work with extending', () => {
    class Store {
      @intercept(change => change)
      @observable
      name = "Store";
    }

    class User extends Store {
      @intercept(change => change)
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    class Post extends Store {
      @intercept(change => change)
      @observable
      text = 0;
    }

    (() => {
      const post = new Post();
      const user = new User();
      user.login()
    }).should.not.throw()
  });

  it('should work if non-intercept property accessed before', () => {
    let loginCount = -1;

    class User {
      @intercept(change => {
        loginCount = change.newValue;
        return change;
      })
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


  it('should work if @observable defined before @intercept', () => {
    let loginCount = -1;

    class User {
      @observable
      @intercept(change => {
        loginCount = change.newValue;
        return change;
      })
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


  it('should work in chain with @observe if @observable defined before', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @observable
      @observe(() => firstCalled = true)
      @intercept(change => {
        secondCalled = true;
        return change;
      })
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
});
