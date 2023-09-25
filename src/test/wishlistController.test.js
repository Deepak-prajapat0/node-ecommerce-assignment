const request = require('supertest')
const server = require('../index')

let token = ''
let app
let form = {
  name: 'Deepak',
  phone: 8956235689,
  house: 'near sec 72',
  street: 'near mohali',
  city: 'mohali',
  state: 'punjab',
  pincode: 160056
}
beforeEach(async () => {
  server.close()
  app = server
})
afterEach(async () => {
  server.close()
})

describe('Wishlist api"s', () => {
  // user login to store token -----------------------

  it('should return 200 if user enter valid credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'jk4497@gmail.com',
      password: '123456'
    })
    expect(response.status).toBe(200)
    expect(response.body?.msg).toBe('Login successfully')
    token = response.body.token
  }, 8000)

  // ---------- creating wishlist -----------------------------

  describe('Add to wishlist', () => {
    it('should return 401 if token is not present in headers', async () => {
      const response = await request(app).post('/wishlist')
      expect(response.status).toBe(401)
    })
    it('should return 400 if sent invalid request body', async () => {
      const response = await request(app)
        .post('/wishlist')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 404 if product not found with given productId', async () => {
      const response = await request(app)
        .post('/wishlist')
        .send({ productId: '6511294963aab3067b676dc4' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
    it('should return 404 if product not found with given productId', async () => {
      const response = await request(app)
        .post('/wishlist')
        .send({ productId: '6511294963aab3067b676dc4' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
    it('should return 400 if product is already added to wishlist', async () => {
      const response = await request(app)
        .post('/wishlist')
        .send({ productId: '650d4fa917e5ca9fb70d63ae' })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    // it('should return 200 or 201 if product is added to wishlist', async () => {
    //   const response = await request(app)
    //     .post('/wishlist')
    //     .send({ productId: '650d4fa917e5ca9fb70d63ac' })
    //     .set({ 'x-api-key': token })
    //   expect(response.status).toBeGreaterThanOrEqual(200)
    //   expect(response.status).toBeLessThanOrEqual(201)
    // })
  })
})
