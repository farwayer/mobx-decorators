import {strictEqual} from 'assert'
import {observable, action} from 'mobx'
import {save, createSaveDecorator} from '../../src'


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
      loginCount;
    }

    const user = new User();
    user.loginCount;
  });


  it('should save value to storage', done => {
    const storage = new Storage();

    class User {
      storeName = 'user';

      @save({
        storage,
        onInitialized: store => {
          store.login();
        },
        onSaved: async function(store, property, value) {
          value.should.be.equal(1);
          store.loginCount.should.be.equal(1);
          const saved = await storage.getItem('user:loginCount');
          saved.should.be.equal(JSON.stringify(1));
          done();
        }
      })
      @observable
      loginCount;

      @action login() {
        this.loginCount = (this.loginCount || 0) + 1;
      }
    }

    const user = new User();
    user.loginCount
  });


  it('should work if storeName defined after observable', done => {
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
      loginCount;
    }

    const user = new User();
    user.loginCount
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
      loginCount;
    }

    const user = new User();
    user.loginCount
  });


  it('should set user value while loading', done => {
    const storage = new Storage({
      'user:loginCount': JSON.stringify(999),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        onSaved: async function(store, property, value) {
          value.should.be.equal(1);
          store.loginCount.should.be.equal(1);

          const saved = await storage.getItem('user:loginCount');
          saved.should.be.equal(JSON.stringify(1));
          done();
        }
      })
      @observable
      loginCount;

      @action login() {
        this.loginCount = (this.loginCount || 0) + 1;
      }
    }

    const user = new User();
    user.login();
    user.loginCount.should.be.equal(1);
  });


  it('should serializer works', done => {
    const storage = new Storage({
      'user:lastLogin': 'XXX' + JSON.stringify(new Date(2013, 6, 17)),
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        serializer: {
          load: data => new Date(JSON.parse(data.slice(3))),
          save: value => 'XXX' + JSON.stringify(value),
        },
        onLoaded: (store, property, value) => {
          value.should.be.Date();
          value.should.be.eql(new Date(2013, 6, 17));
          store.lastLogin.should.be.Date();
          store.lastLogin.should.be.eql(new Date(2013, 6, 17));

          store.lastLogin = new Date(2018, 1, 6);
        },
        onSaved: () => {
          storage.db['user:lastLogin'].should.startWith('XXX');
          done();
        },
      })
      @observable
      lastLogin;
    }

    const user = new User();
    user.lastLogin
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
      loginCount;

      @action login() {
        this.loginCount = (this.loginCount || 0) + 1;
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
      loginCount;
    }

    class User extends BaseUser {
      storeName = 'user';
    }
    class Admin extends BaseUser {
      storeName = 'admin';
    }

    const user = new User();
    const admin = new Admin();
    user.loginCount
    admin.loginCount

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
      loginCount;
    }

    const user = new User();
    user.loginCount
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
      loginCount;
    }

    const user = new User();
    user.loginCount
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
        serializer: {
          save(data) {
            checkStore(this);
            return data;
          },
          load(value) {
            checkStore(this);
            return value;
          },
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
      name;

      @action setName(name) {
        this.name = name;
      }
    }

    const user = new User();
    user.name
  });

  it('should interpret null value as non-exists', done => {
    const storage = new Storage({
      'user:loginCount': null,
    });

    class User {
      storeName = 'user';

      @save({
        storage,
        onInitialized: (store, property, value) => {
          strictEqual(value, undefined);
          strictEqual(store.loginCount, undefined);
          done();
        },
      })
      @observable loginCount;
    }

    const user = new User();
    user.loginCount;
  });
});
