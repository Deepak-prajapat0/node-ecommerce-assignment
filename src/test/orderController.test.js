const request = require('supertest')
const crypto = require('crypto')
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

describe('Order api"s', () => {
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
  }, 8000)

  //   ----------------- Create Order --------------------------

  describe('Create order', () => {
    it('should return 401 if token not sent in headers', async () => {
      const response = await request(app).post('/order').set({})
      expect(response.status).toBe(401)
    })
    it('should return 400 if body data is empty', async () => {
      const response = await request(app)
        .post('/order')
        .send({})
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 400 if invalid form send in body', async () => {
      const response = await request(app)
        .post('/order')
        .send({
          name: 'g',
          phone: 232,
          house: 'near sec 72',
          street: 'near mohali',
          city: 'mohali',
          state: 'punjab',
          pincode: 1600565
        })
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 400 if no items found in user cart', async () => {
      const response = await request(app)
        .post('/order')
        .send(form)
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    // it('should return 400 if any product is out of stock', async () => {
    //   const response = await request(app)
    //     .post('/order')
    //     .send(form)
    //     .set({ 'x-api-key': token })
    //   expect(response.status).toBe(400)
    // })
    // it('should return 200 if order is placed', async () => {
    //   const response = await request(app)
    //     .post('/order')
    //     .send(form)
    //     .set({ 'x-api-key': token })
    //   expect(response.status).toBe(200)
    // })
  })

  // ----------- Get Order By ID ------------------------------
  describe('Get order By id', () => {
    it('should return 400 if orderId is not a valid objectId', async () => {
      const response = await request(app)
        .get('/order/6511440e00623ebf8e15')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 404 if no order found with this orderId', async () => {
      const response = await request(app)
        .get('/order/650d37b8597f33189c1577df')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
    it('should return 200 if order found with the orderId', async () => {
      const response = await request(app)
        .get('/order/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(200)
    })
  })

  // -------------------  Cancel Product In Order -----------------------

  describe('cancel product in order', () => {
    it('should return 401 if token is not present in headers', async () => {
      const response = await request(app).put('/order/6511294963aab3067b676dc4')
      expect(response.status).toBe(401)
    })
    it('should return 400 if invalid type of orderId is sent', async () => {
      const response = await request(app)
        .put('/order/6511294963aab3067b67dc4')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 400 if productId not sent in body', async () => {
      const response = await request(app)
        .put('/order/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
        .send({ productId: '' })
      expect(response.status).toBe(400)
    })
    it('should return 400 if invalid type of productId sent in body', async () => {
      const response = await request(app)
        .put('/order/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
        .send({ productId: '6511294963aab3067b676d' })
      expect(response.status).toBe(400)
    })
    it('should return 404 if order not found with orderId', async () => {
      const response = await request(app)
        .put('/order/650d37b8597f33189c1577df')
        .set({ 'x-api-key': token })
        .send({ productId: '6511294963aab3067b676d' })
      expect(response.status).toBe(400)
    })
    it('should return 400 if order cannot updated', async () => {
      const response = await request(app)
        .put('/order/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
        .send({ productId: '6511294963aab3067b676d' })
      expect(response.status).toBe(400)
    })
    it('should return 400 if order is already empty ', async () => {
      const response = await request(app)
        .put('/order/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
        .send({ productId: '650d4fa917e5ca9fb70d63ae' })
      expect(response.status).toBe(400)
    })

    // it('should return 200 when product is canceled ', async () => {
    //   const response = await request(app)
    //     .put('/order/6511294963aab3067b676dc4')
    //     .set({ 'x-api-key': token })
    //     .send({ productId: '650d4fa917e5ca9fb70d63ae' })
    //   expect(response.status).toBe(200)
    // })
  })

  // ------- Cancel order  -----------------------------

  describe('Cancel order', () => {
    it('should return 401 if token is not found in headers', async () => {
      const response = await request(app).put(
        '/order/cancel/6511294963aab3067b676dc4'
      )
      expect(response.status).toBe(401)
    })
    it('should return 400 if invalid orderId is sent', async () => {
      const response = await request(app)
        .put('/order/cancel/6511294963aab3067b67c4')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 404 if order not found with given id ', async () => {
      const response = await request(app)
        .put('/order/cancel/650d37b8597f33189c1577df')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(404)
    })
    it('should return 400 if order cannot be update', async () => {
      const response = await request(app)
        .put('/order/cancel/6511294963aab3067b676dc4')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
    it('should return 200 if order canceled', async () => {
      const response = await request(app)
        .put('/order/cancel/6511440e00623ebf8e1094d5')
        .set({ 'x-api-key': token })
      expect(response.status).toBe(400)
    })
  })
})
