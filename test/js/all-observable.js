import {isObservable, isObservableProp, observable} from 'mobx'
import {allObservable, observe, setter} from '../../src'


describe('@allObservable', () => {
  it('should make all class properties observable', () => {
    @allObservable
    class User {
      name = 'unknown';
      loginCount = 0;
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'name').should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();
  });


  it('should work with constructor', () => {
    @allObservable
    class User {
      name = 'unknown';
      loginCount = 0;

      constructor(count) {
        this.loginCount = count;
      }
    }

    const user = new User(1);
    isObservable(user).should.be.true();
    isObservableProp(user, 'name').should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();
    user.should.have.property('loginCount').which.is.equal(1);
  });


  it('should make only some properties observable', () => {
    @allObservable({only: ['name']})
    class User {
      name = 'unknown';
      loginCount = 0;
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'name').should.be.true();
    isObservableProp(user, 'loginCount').should.be.false();
  });


  it('should make all class properties observable except some', () => {
    @allObservable({except: ['loginCount']})
    class User {
      name = 'unknown';
      loginCount = 0;
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'name').should.be.true();
    isObservableProp(user, 'loginCount').should.be.false();
  });


  it('should only work with except', () => {
    @allObservable({
      only: ['name', 'loginCount'],
      except: ['loginCount'],
    })
    class User {
      name = 'unknown';
      loginCount = 0;
      age = 17;
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'name').should.be.true();
    isObservableProp(user, 'loginCount').should.be.false();
    isObservableProp(user, 'age').should.be.false();
  });


  it('should work with @observable', () => {
    @allObservable
    class User {
      @observable
      loginCount = 0;

      name = 'unknown';
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);
    isObservable(user).should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();
    isObservableProp(user, 'name').should.be.true();
  });


  it('should work with extra property decorators', () => {
    @allObservable
    class User {
      @setter
      loginCount = 0;
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);
    isObservable(user).should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();

    user.setLoginCount(1);
    user.should.have.property('loginCount').which.is.equal(1);
  });


  it('should work with @observe', done => {
    @allObservable
    class User {
      @observe(() => done())
      @setter
      loginCount = 0;
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);
    isObservable(user).should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();

    user.setLoginCount(1);
    user.should.have.property('loginCount').which.is.equal(1);
  });


  it('should work with extending', () => {
    @allObservable
    class BaseUser {
      loginCount = 0;
    }

    class User extends BaseUser {
      name = 'unknown';
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();
    isObservableProp(user, 'name').should.be.false();
  });


  it('should work with extending when @allObservable at child class', () => {
    class BaseUser {
      loginCount = 0;
    }

    @allObservable
    class User extends BaseUser {
      name = 'unknown';
    }

    const user = new User();
    isObservable(user).should.be.true();
    isObservableProp(user, 'loginCount').should.be.true();
    isObservableProp(user, 'name').should.be.true();
  });


  it('should getter and setter for each observable property be defined', () => {
    @allObservable
    class User {
      loginCount = 0;
    }

    const user = new User();
    const desc = Object.getOwnPropertyDescriptor(user, 'loginCount');
    desc.should.has.property('get').which.is.Function();
    desc.should.has.property('set').which.is.Function();
  });


  it('should work as function without arguments', () => {
    (() => {
      @allObservable()
      class User {
        name = 'unknown';
        loginCount = 0;
      }
    }).should.not.throw();
  });
});
