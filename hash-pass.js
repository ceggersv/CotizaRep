const bcrypt = require('bcrypt');

const password = 'epeople';
bcrypt.hash(password, 10, function(err, hash) {
  console.log(hash);
});