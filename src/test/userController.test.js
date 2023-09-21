const request = require('supertest')
const crypto = require('crypto')

let emailToken = crypto.randomBytes(15).toString('hex')
let app
beforeEach(async () => {
  require('../index').close()
  app = require('../index')
})
afterEach(async () => {
  await app.close()
})
describe('User apis', () => {
  // register api test------------

  describe('register', () => {
    it('should return 400 error if input is invalid', () => {
      return request(app)
        .post('/register')
        .send({
          name: 'de',
          phone: 8956326598,
          email: 'jk4497@gmail.com',
          password: '1231213'
        })
        .expect(400)
    }),
      it('should return 409 error if email is registerd', () => {
        return request(app)
          .post('/register')
          .send({
            name: 'deepak',
            phone: 8956326598,
            email: 'jk4497@gmail.com',
            password: '123456'
          })
          .expect(409)
          .then(res => {
            expect(res.body).toEqual(
              expect.objectContaining({
                msg: 'User already exist',
                status: false
              })
            )
          })
      }),
      // register
      it('should return 200 user registerd', () => {
        return request(app)
          .post('/register')
          .send({
            name: 'deepak',
            phone: 8956326598,
            email: 'jk449712@gmail.com',
            password: '123456'
          })
          .expect(409)
      })
  })

  // login testing

  describe('login api ', () => {
    it('should return 200 if user enter valid credentials', () => {
      return request(app)
        .post('/login')
        .send({
          email: 'jk4497@gmail.com',
          password: '123456'
        })
        .expect(200)
    }),
      it('should return 400 error if input are wrong', () => {
        return request(app)
          .post('/login')
          .send({
            password: '123456'
          })
          .expect(400)
      }),
      it('should return 404 if user not found with email', () => {
        return request(app)
          .post('/login')
          .send({
            email: 'jk@gmail.com',
            password: '123456'
          })
          .expect(404)
      }),
      it('should return 401 if user enter invalid password', () => {
        return request(app)
          .post('/login')
          .send({
            email: 'jk4497@gmail.com',
            password: '1234567'
          })
          .expect(401)
      })
  })

  // forgot password
  describe('forgot password', () => {
    it('should return 400 if user not enter email', () => {
      return request(app)
        .post('/forgetpassword')
        .send({
          // email:"jk4497@gmail.com",
        })
        .expect(400)
    }),
      it('should return 400 if email length is less than 10', () => {
        return request(app)
          .post('/forgetpassword')
          .send({
            email: 'jk44'
          })
          .expect(400)
      }),
      it('should return 400 if user not found with the email', () => {
        return request(app)
          .post('/forgetpassword')
          .send({
            email: 'jk1111@gmail.com'
          })
          .expect(400)
      }),
      it('should return 200 if password reset mail sent to user', () => {
        return request(app)
          .post('/forgetpassword')
          .send({
            emailToken: emailToken,
            email: 'jk4497@gmail.com'
          })
          .expect(200)
      })
  })

  //update password

  describe('update password', () => {
    it('should return 400 if request body is empty', () => {
      return request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              msg: 'Password should have a minimum length of 6',
              status: false
            })
          )
        })
    }),
      it('should return 400 if passwords are empty', () => {
        return request(app)
          .put(`/updatepassword/${emailToken}`)
          .send({
            password: '',
            confirmPassword: ''
          })
          .expect(400)
          .then(res => {
            expect(res.body).toEqual(
              expect.objectContaining({
                msg: 'Password should have a minimum length of 6',
                status: false
              })
            )
          })
      }),
         it('should return 400 if password is different from updatepassword', () => {
        // sending wrong emailtoken in params
        // emailToken = '1b8d987ffba72f53e7cfd1053bbab1'
        return request(app)
          .put(`/updatepassword/${emailToken}`)
          .send({
            password: '123456',
            confirmPassword: '1234567'
          })
          .expect(400)
          .then(res => {
            expect(res.body).toEqual(
              expect.objectContaining({
                msg: 'password and confirmPassword are not matched',
                status: false
              })
            )
          })
      }),
      it('should return 401 if emailToken is expired', () => {
        // sending wrong emailtoken in params
        emailToken = '1b8d987ffba72f53e7cfd1053bbab1'
        return request(app)
          .put(`/updatepassword/${emailToken}`)
          .send({
            password: '123456',
            confirmPassword: '123456'
          })
          .expect(401)
          .then(res => {
            expect(res.body).toEqual(
              expect.objectContaining({
                msg: 'link expired,create a new link',
                status: false
              })
            )
          })
      })
   
  })
})
