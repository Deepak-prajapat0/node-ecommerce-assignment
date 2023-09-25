const request = require('supertest')
const crypto = require('crypto')
const server = require('../index')

let token = ''
let emailToken = crypto.randomBytes(15).toString('hex')
let app
beforeEach(async () => {
  server.close()
  app = server
})
afterEach(async () => {
  server.close()
})
describe('User apis', () => {
  // register api test------------
  describe('register', () => {
    it('should return 400 error if input is invalid', async () => {
      const response = await request(app).post('/register').send({
        name: 'de',
        phone: 8956326598,
        email: 'jk4497@gmail.com',
        password: '1231213'
      })
      expect(response.status).toBe(400)
    })
    it('should return 409 error if email is registerd', async () => {
      const response = await request(app).post('/register').send({
        name: 'deepak',
        phone: 8956326598,
        email: 'jk4497@gmail.com',
        password: '123456'
      })
      expect(response.status).toBe(409)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'User already exist',
          status: false
        })
      )
    })

    //successfull registered
    it('should return 200 user registerd', async () => {
      const response = await request(app).post('/register').send({
        name: 'deepak',
        phone: 8956326598,
        email: 'jk4497@gmail.com',
        password: '123456'
      })
      expect(response.status).toBe(409)
      token = response.body.token
    })
  })

  // login testing ----------------------

  describe('login api ', () => {
    it('should return 200 if user enter valid credentials', async () => {
      const response = await request(app).post('/login').send({
        email: 'jk4497@gmail.com',
        password: '123456'
      })
      expect(response.status).toBe(200)
      expect(response.body?.msg).toBe('Login successfully')
      token = response.body.token
    })
    it('should return 400 error if input are wrong', async () => {
      const response = await request(app).post('/login').send({
        password: '123456'
      })
      expect(response.status).toBe(400)
    })
    it('should return 404 if user not found with email', async () => {
      const response = await request(app).post('/login').send({
        email: 'jk@gmail.com',
        password: '123456'
      })
      expect(response.status).toBe(404)
    })
    it('should return 401 if user enter invalid password', async () => {
      const response = await request(app).post('/login').send({
        email: 'jk4497@gmail.com',
        password: '1234567'
      })
      expect(response.status).toBe(401)
    })
  })

  // forgot password------------------------------

  describe('forgot password', () => {
    it('should return 400 if user not enter email', async () => {
      const response = await request(app).post('/forgetpassword').send({
        // email:"jk4497@gmail.com",
      })
      expect(response.status).toBe(400)
    }),
      it('should return 400 if email length is less than 10', async () => {
        const response = await request(app).post('/forgetpassword').send({
          email: 'jk44'
        })
        expect(response.status).toBe(400)
      }),
      it('should return 400 if user not found with the email', async () => {
        const response = await request(app).post('/forgetpassword').send({
          email: 'jk1111@gmail.com'
        })
        expect(response.status).toBe(400)
      }),
      it('should return 200 if password reset mail sent to user', async () => {
        const response = await request(app).post('/forgetpassword').send({
          emailToken: emailToken,
          email: 'jk4497@gmail.com'
        })
        expect(response.status).toBe(200)
      })
  })

  //update password ----------------------------

  describe('update password', () => {
    it('should return 400 if await request body is empty', async () => {
      const response = await request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({})
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'Password should have a minimum length of 6',
          status: false
        })
      )
    })
    it('should return 400 if passwords are empty', async () => {
      const response = await request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({
          password: '',
          confirmPassword: ''
        })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'Password should have a minimum length of 6',
          status: false
        })
      )
    })
    it('should return 400 if password is different from updatepassword', async () => {
      // sending wrong emailtoken in params
      // emailToken = '1b8d987ffba72f53e7cfd1053bbab1'
      const response = await request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({
          password: '123456',
          confirmPassword: '1234567'
        })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'password and confirmPassword are not matched',
          status: false
        })
      )
    })
    it('should return 401 if emailToken is expired', async () => {
      // sending wrong emailtoken in params
      emailToken = '1b8d987ffba72f53e7cfd1053bbab1'
      const response = await request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({
          password: '123456',
          confirmPassword: '123456'
        })
      expect(response.status).toBe(401)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'link expired,create a new link',
          status: false
        })
      )
    })
    it('should return 200 when password updated', async () => {
      const response = await request(app)
        .put(`/updatepassword/${emailToken}`)
        .send({
          password: '123456',
          confirmPassword: '123456'
        })
      expect(response.status).toBe(401)
      expect(response.body).toEqual(
        expect.objectContaining({
          msg: 'link expired,create a new link',
          status: false
        })
      )
    })
  })

  // logout user ----------------------------------

  describe('logout', () => {
    it('should return 401 if token not found in headers', async () => {
      const response = await request(app).post('/logout').send({}).set({})
      expect(response.status).toBe(401)
    })
    it('should return 204 if user logout successfully', async () => {
      const response = await request(app)
        .post('/logout')
        .send({})
        .set({ 'x-api-key': token })
      expect(response.status).toBe(204)
    })
  })
})
