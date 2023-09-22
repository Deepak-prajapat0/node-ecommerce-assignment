const request = require('supertest')
const crypto = require('crypto')
const server = require('../index')

let token = ''
let app
beforeEach(async () => {
  server.close()
  app = server
})
afterEach(async () => {
  server.close()
})

describe('Cart api"s', () => {
  //
  // user login to store token -----------------------

  it('should return 200 if user enter valid credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'jk4497@gmail.com',
      password: '123456'
    })
    expect(response.status).toBe(200)
    expect(response.body?.msg).toBe('Login successfully')
    token = response.body.token
  })

  // add to cart -----------------------

  describe('Add to cart', () => {
    it('should return 401 if token not found in headers', async () => {
      const response = await request(app).post('/cart').send({}).set({})
      expect(response.status).toBe(401)
    })
    it('should return 400 if productId not provided in body', async () => {
      const response = await request(app)
        .post('/cart')
        .send({})
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 404 if wrong productId provided in body', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ id: '650d4fa917e5ca9fb70d63a5' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
    it('should return 400 if product is out of stock', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ id: '650d4fa917e5ca9fb70d63ac' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 200 or 201 if product is added in cart', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ id: '650d4fa917e5ca9fb70d63ad' })
        .set({ 'x-api-key': token })
      expect(response.status).toBeGreaterThanOrEqual(200)
      expect(response.status).toBeLessThanOrEqual(202)
    })
  })

  // update cartItems -----------------------

  describe('update cart', () => {
    it('should return 400 if productId and quantity not in body', async () => {
      const response = await request(app)
        .put('/cart')
        // .send({ id: '650d4fa917e5ca9fb70d63ad' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 400 if productId not provide', async () => {
      const response = await request(app)
        .put('/cart')
        // .send({ id: '650d4fa917e5ca9fb70d63ad' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 404 if product not found with given productId', async () => {
      const response = await request(app)
        .put('/cart')
        .send({ id: '650d4fa917e5ca9fb70d63ad',quantity:3 })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
  })
})
