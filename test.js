import test from 'ava';
import request from 'supertest-as-promised';
import app from './server';
import Faker from 'faker';
import users from './users.json';

test('Get all users', async t=> {
  t.plan(3)
  const res = await request(app)
    .get('/api/users')
    .expect(200)

  t.is(res.status, 200, 'Status is not 200');
  t.deepEqual(res.body[0], users[0], "No user returned");
  t.truthy(res.body, 'Something is wrong with the response body');
})

test('Get user by language', async t => {
  let req = await request(app)
    .get('/api/users?language=klingon')
    .expect(200)

  t.truthy(req.body, 'Request body not found');

  req.body.forEach(function(user) {
    t.is(user.language, 'klingon')
  })

  req = await request(app)
    .get('/api/users?language=french')
    .expect(200)

  t.truthy(req.body);

  req.body.forEach(user => {
    t.is(user.language, 'french');
  })

  req = await request(app)
    .get('/api/users?language=foo')

  t.is(req.status, 200);
  t.falsy(req.body[0])
})

test('Get user by privilege', async t => {
  const req = await request(app)
    .get('/api/users/admin')

  t.plan(3+req.body.length);
  t.is(req.status, 200);
  t.truthy(req.body, 'Something is wrong with the request body');
  t.truthy(req.body[0], 'No results returned');

  req.body.forEach(user => {
    t.is(user.type, 'admin')
  });
})

test('Create new user', async t => {
  let colLength = users.length;
  let newUser = fakeUser();
  const req = await request(app)
    .post('/api/users')
    .send(newUser)

  t.is(req.status, 200, 'Make sure you are using bodyParser');
})

test('Create a new admin user', async t => {
  let newUser = fakeUser();
  const req = await request(app)
    .post('/api/users/admin')
    .send(newUser)

  t.is(req.status, 200)
})

test('Change a users language', async t => {
  let newUser = fakeUser();
  let id;
  let req = await request(app)
    .post('/api/users')
    .send(newUser)

  t.is(req.status, 200);
  t.truthy(req.body.id);
  id = req.body.id;

  req = await request(app)
    .post('/api/users/language/' + id)
    .send({language: 'french'})

  t.is(req.status, 200, 'error changing language');

  req = await request(app)
    .get('/api/users/' + id)

  t.is(req.status, 200);
  t.truthy(req.body.language);
  t.is(req.body.language, 'french');

  req = await request(app)
    .post('/api/users/language/' + id)
    .send({language: 'klingon'})

  t.is(req.status, 200, 'error changing language to Klingon')

  req = await request(app)
    .get('/api/users/' + id)

  t.is(req.status, 200);
  t.truthy(req.body.language);
  t.is(req.body.language, 'klingon');
})

test('add to a users favorite forums', async t => {
  let newUser = fakeUser();
  let id;

  // CREATE A NEW USER
  let res = await request(app)
    .post('/api/users')
    .send(newUser)

  t.is(res.status, 200);
  t.truthy(res.body.id);
  id = res.body.id;

  // ADD TO FAVORITE FORUMS
  res = await request(app)
    .post('/api/users/forums/' + id)
    .send({add: 'foo'})

  t.is(res.status, 200);

  // CHECK IF USER HAS NEW FORUM
  res = await request(app)
    .get('/api/users/' + id)

  t.is(res.status, 200);
  t.is(true, Array.isArray(res.body.favorites))

  t.is(
    true,
    res.body.favorites.reduce((a, b) => {
      if (b === 'foo') return true;
      else return false;
    }, false)
  )

})

test('remove from a users favorite forums', async t => {
  let newUser = fakeUser();
  let id;

  // CREATE NEW FORUM
  let res = await request(app)
    .post('/api/users')

  t.is(res.status, 200);
  t.truthy(res.body.id);
  id = res.body.id;

  // ADD TO USER FORUMS
  res = await request(app)
    .post('/api/users/forums/' + id)
    .send('foo')

  t.is(res.status, 200);

  // Remove from user forums
  res = await request(app)
    .delete('/api/users/forums/' + id + '?favorite=foo')

  t.is(res.status, 200);

  // Check that forum has been deleted
  res = await request(app)
    .get('/api/users/' + id);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body.favorites));

  res.body.favorites.reduce((a,b) => {
    return b !== 'foo';
  }, false)
})

test('ban(delete) a user', async t => {
  let user = fakeUser();

  // Create a new user
  let res = await request(app)
    .post('/api/users')
    .send(user)

  t.is(res.status, 200);
  t.truthy(res.body.id);
  user.id = res.body.id;

  // Delete that user
  res = await request(app)
    .delete('/api/users/' + user.id)

  t.is(res.status, 200);

  // Make sure user does not exist
  res = await request(app)
    .get('/api/users/' + user.id)

  t.is(res.status, 404, 'Make sure that when a user is not found that the server returns 404');
  t.truthy(res.body);
  t.falsy(res.body[0], 'User still exists, delete endpoint is not working');

})

test('Use queries for get all users', async t => {
  // age
  let res = await request(app)
    .get('/api/users?age=49')

  t.is(res.status, 200);
  t.truthy(res.body);
  res.body.forEach(user => {
    t.true(user.age == 49, 'Age query failed')
  })

  // Location
  res = await request(app)
    .get('/api/users?language=english')

  t.is(res.status, 200);
  t.truthy(res.body);
  t.truthy(res.body[0], 'Nothing returned from language query');
  res.body.forEach(user => {
    t.true(user.language === 'english', 'Language query failed');
  })

  // City
  res = await request(app)
    .get('/api/users?city=scranton')

  t.is(res.status, 200);
  t.truthy(res.body);
  t.truthy(res.body[0], 'Nothing returned from city query');

  res.body.forEach(user => {
    t.true(user.city == 'Scranton', 'City query failed')
  })

  // State
  res = await request(app)
    .get('/api/users?state=pennsylvania')

  t.is(res.status, 200);
  t.truthy(res.body);
  t.truthy(res.body[0], 'Nothing returned from state query');

  res.body.forEach(user => {
    t.true(user.state == 'Pennsylvania', 'State query failed')
  })

  // Gender
  res = await request(app)
    .get('/api/users?gender=female')

  t.is(res.status, 200);
  t.truthy(res.body);
  t.truthy(res.body[0], 'Nothing returned from gender query');

  res.body.forEach(user => {
    t.true(user.gender == 'Female');
  })
})

test('Update one user', async t => {
  let user = fakeUser();

  let res = await request(app)
    .post('/api/users')

  t.is(res.status, 200);
  t.truthy(res.body.id);
  user.id = res.body.id;

  // Update user
  res = await request(app)
    .put('/api/users/' + user.id)
    .send({
      first_name: 'foo',
      last_name: 'bar'
    })

  t.is(res.status, 200, 'Check that put endpoint exists');

  // Check that update was successful
  res = await request(app)
    .get('/api/users/' + user.id)

  t.is(res.status, 200);
  t.truthy(res.body);
  t.is(res.body.first_name, 'foo', 'User was not changed');
  t.is(res.body.last_name, 'bar', 'User was not changed');

})






function fakeUser() {
  let languages = ['english', 'french', 'spanish', 'klingon'];
  let types = ['admin', 'moderator', 'user'];
  let faves = ['cats', 'dogs', 'angular'];
  function getRand(l) {
    return Math.floor(Math.random() * l);
  }
  return {
    first_name: Faker.name.firstName(),
    last_name: Faker.name.lastName(),
    email: Faker.internet.email(),
    gender: Math.random() >= .5 ? "Male" : "Female",
    language: languages[getRand(languages.length)],
    age: Math.floor(Math.random() * 70) + 20,
    city: Faker.address.city(),
    state: Faker.address.state(),
    type: types[getRand(types.length)],
    favorites: faves[getRand(faves.length)]
  }
}
