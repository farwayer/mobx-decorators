import {observable} from 'mobx'
import {setter} from '../src'


describe('@setter', () => {
  it('should define setter with default name', () => {
    class User {
      @setter
      @observable
      loggedIn = false;
    }

    const user = new User();
    user.should.have.property('loggedIn').which.is.false();
    user.should.have.property('setLoggedIn').which.is.a.Function();

    user.setLoggedIn(true);
    user.should.have.property('loggedIn').which.is.true();
  });


  it('should define setter with custom name', () => {
    class User {
      @setter('updateLoggedIn')
      @observable
      loggedIn = false;
    }

    const user = new User();
    user.should.have.property('loggedIn').which.is.false();
    user.should.have.property('updateLoggedIn').which.is.a.Function();

    user.updateLoggedIn(true);
    user.should.have.property('loggedIn').which.is.true();
  });


  it('should define const setter', () => {
    class User {
      @setter('login', true)
      @observable
      loggedIn = false;
    }

    const user = new User();
    user.should.have.property('loggedIn').which.is.false();
    user.should.have.property('login').which.is.a.Function();

    user.login();
    user.should.have.property('loggedIn').which.is.true();
  });


  it('should transform works', () => {
    class User {
      @setter(value => value.toUpperCase())
      @observable
      name;
    }

    const user = new User();
    user.should.have.property('setName').which.is.a.Function();

    user.setName('Alice');
    user.should.have.property('name').which.is.equal('ALICE');
  });

  it('should transform works with custom name', () => {
    class User {
      @setter('updateName', value => value.toUpperCase())
      @observable
      name;
    }

    const user = new User();
    user.should.have.property('updateName').which.is.a.Function();

    user.updateName('Bob');
    user.should.have.property('name').which.is.equal('BOB');
  });
});
