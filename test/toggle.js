import {observable} from 'mobx'
import {toggle} from '../'


describe('@toggle', () => {
  it('should define toggle with default name', () => {
    class User {
      @toggle
      @observable
      loggedIn = false;
    }

    const user = new User();
    user.should.have.property('loggedIn').which.is.false();
    user.should.have.property('toggleLoggedIn').which.is.a.Function();

    user.toggleLoggedIn();
    user.should.have.property('loggedIn').which.is.true();
  });


  it('should define toggle with custom name', () => {
    class User {
      @toggle('swapLoggedIn')
      @observable
      loggedIn = false;
    }

    const user = new User();
    user.should.have.property('loggedIn').which.is.false();
    user.should.have.property('swapLoggedIn').which.is.a.Function();

    user.swapLoggedIn();
    user.should.have.property('loggedIn').which.is.true();
  });
});
