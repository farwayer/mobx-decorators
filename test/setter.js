import {observable} from 'mobx'
import {setter} from '../'


describe('setter', () => {
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
});
