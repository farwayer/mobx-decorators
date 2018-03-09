import {observable, action} from 'mobx'
import {save, createSaveDecorator} from '../src'
import {default as basicSave} from '../src/decorators/save/save'


class Storage {
  db = {};

  constructor(state = {}) {
    this.db = state;
  }

  async getItem(key) {
    return this.db[key];
  }
  async setItem(key, value) {
    this.db[key] = value;
  }
}


describe('@save', () => {
  it('should load value from storage', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        onLoaded: (store, property, value) => {
          value.should.be.equal(999);
          store.loginCount.should.be.equal(999);
          done();
        }
      })
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
  });


  it('should save value to storage', done => {
    const storage = new Storage();

    class User {
      storeName = 'user';

      @save({
        storage,
        onInitialized: store => {
          store.login();
          store.loginCount.should.be.equal(1);
        },
        onSaved: async (store, property, value) => {
          value.should.be.equal(1);
          store.loginCount.should.be.equal(1);
          const saved = await storage.getItem('user:loginCount');
          saved.should.be.equal(JSON.stringify(1));
          done();
        }
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
  });


  it('should be possible to specify/override storeName by options', done => {
    const storage = new Storage({
      'myUser:loginCount': JSON.stringify(999),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        storeName: 'myUser',
        onLoaded: (store, property, value) => {
          value.should.be.equal(999);
          store.loginCount.should.be.equal(999);
          done();
        }
      })
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
  });


  it('should set user value while loading', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        onSaved: async (store, property, value) => {
          value.should.be.equal(1);
          store.loginCount.should.be.equal(1);

          const saved = await storage.getItem('user:loginCount');
          saved.should.be.equal(JSON.stringify(1));
          done();
        }
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
    user.login();
    user.loginCount.should.be.equal(1);
  });


  it('should transform works', done => {
    const storage = new Storage({
      'user:lastLogin': JSON.stringify(new Date(2013, 6, 17)),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        transform: value => new Date(value),
        onLoaded: (store, property, value) => {
          value.should.be.Date();
          value.should.be.eql(new Date(2013, 6, 17));
          store.lastLogin.should.be.Date();
          store.lastLogin.should.be.eql(new Date(2013, 6, 17));
          done();
        }
      })
      @observable
      lastLogin = new Date(2017, 3, 15);
    }

    const user = new User();
    user.lastLogin.should.be.eql(new Date(2017, 3, 15));
  });


  it('should set user value if setter called before getter', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        onLoaded: () => done(new Error("onLoaded called")),
        onInitialized: () => done(),
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount = 1;
      }
    }

    const user = new User();
    user.login();
    user.loginCount.should.be.equal(1);
  });


  it('should work with extending', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
      'admin:loginCount': JSON.stringify(888),
    });

    class BaseUser {
      @save({storage})
      @observable
      loginCount = 0;
    }

    class User extends BaseUser {
      storeName = 'user';
    }
    class Admin extends BaseUser {
      storeName = 'admin';
    }

    const user = new User();
    const admin = new Admin();
    user.loginCount.should.be.equal(0);
    admin.loginCount.should.be.equal(0);

    setTimeout(() => {
      user.loginCount.should.be.equal(999);
      admin.loginCount.should.be.equal(888);
      done();
    });
  });


  it('should createSaveDecorator works', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    const save = createSaveDecorator({
      storage,
      storeName: 'user',
      onInitialized: (store, property, value) => {
        value.should.be.equal(999);
        store.loginCount.should.be.equal(999);
        done();
      }
    });

    class User {
      @save
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
  });


  it('should createSaveDecorator works with overriding', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    const save = createSaveDecorator({
      storage,
      storeName: 'non-exist',
    });

    class User {
      @save({
        storeName: 'user',
        onInitialized: (store, property, value) => {
          value.should.be.equal(999);
          store.loginCount.should.be.equal(999);
          done();
        }
      })
      @observable
      loginCount = 0;
    }

    const user = new User();
    user.loginCount.should.be.equal(0);
  });


  it('should throw if no storage defined', () => {
    (() => {
      class User {
        storeName = 'user';

        @basicSave()
        @observable
        loginCount = 0;
      }

      const user = new User();
      user.loginCount.should.be.equal(0);
    }).should.throw();
  });


  it('should run callbacks in store context', done => {
    const storage = new Storage({
      'user:name': JSON.stringify("Alice"),
    });

    function checkStore(store) {
      if (store && store.storeName === 'user') return true;

      done(new Error("this in callback is incorrect"));
      done = null;
      return false;
    }

    class User {
      storeName = 'user';

      @save({
        storage,
        transform: function(value) {
          checkStore(this);
          return value;
        },
        onLoaded: function() {
          checkStore(this);
          this.setName("Bob");
        },
        onInitialized: function() {
          checkStore(this);
        },
        onSaved: function() {
          checkStore(this);
          if (done) done();
        }
      })
      @observable
      name = 'noname';

      @action setName(name) {
        this.name = name;
      }
    }

    const user = new User();
    user.name.should.be.equal("noname");
  });
});
