
require('angular');

module.exports = function(Account, $q, APP_CONF) {
  var accounts = APP_CONF.accounts
    .map(function(attributes) {
      try {
        return new Account(attributes);
      } catch (err) {
        console.log('Failed to load account: ' + attributes.alias);
      }
    })
    .filter(function(a) { return a });

  var service = {
    accounts: function() {
      return accounts;
    },
    add: function(alias) {
      if (accounts[alias]) throw new Error('Account with alias ' + alias + ' already exists');

      var account = new Account({
        alias: alias
      });

      accounts.push(account);
      service.save();
      return account;
    },
    remove: function(account) {
      var idx = accounts.indexOf(account);
      if (idx !== -1) {
        accounts.splice(idx, 1);
        service.save();
      }
    },
    save: function() {
      chrome.storage.local.set({
        accounts: accounts.map(function(account) {
          return account.toJSON();
        })
      });
    },
    withId: function(id) {
      var match;
      accounts.some(function(account) {
        if (account.id === id) return match = account;
      })

      return match;
    },
    withAlias: function(alias) {
      var match;
      accounts.some(function(account) {
        if (account.alias === alias) return match = account;
      });

      return match;
    },
    wipeSensitiveData: function() {
      accounts.forEach(function(account, i) {
        accounts[i] = new Account(account.toJSON());
      });

      service.save();
    }
  }

  return service;
}
