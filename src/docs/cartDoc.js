const type={
    type:'string'
}



const createCart = {
    tags: ['Cart'],
    description: 'Create user cart or add item if already cart created',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/createCartBody',
                },
            },
        },
        required: true,
    },
    security: [
        {
            bearerAuth: []
        },
    ],
    responses: {
        '200': {
            description: 'On Succeessfully add product in cart',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: true
                            },
                            msg: {
                                type: 'string',
                                example: 'Item added to cart',
                            },
                            cart:{
                                type:'object',
                                properties:{
                                    _id:type,
                                    userId:type,
                                    cartItems:[
                                        {
                                            productId:{
                                                type:'string'
                                            },
                                            quantity:type
                                        }
                                    ],
                                    totalPrice:type,
                                    totalItems:type,
                                    createdAt:type,
                                    updatedAt:type
                                }
                            }
                        },
                    },
                },
            },
        },
        '500': {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: false
                            },
                            error: {
                                type: 'string',
                                example: 'Internal Server Error',
                            },
                        },
                    },
                },
            },
        },
    },
}

const createCartBody = {
    type: 'object',
    properties: {
        productId: {
            type: 'string',
            example: '650d4fa917e5ca9fb70d63ae',
        }
    },
}

const getUserCart = {
    tags: ['Cart'],
    description: 'get user Cart by authentication',
    security: [
        {
            bearerAuth: []
        },
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: true
                            },
                            msg: {
                                type: 'string',
                                example: 'User Cart',
                            },
                            cart: {
                                type: 'object',
                                properties: {
                                    _id: type,
                                    userId: type,
                                    // cartItems: [
                                    //     {
                                    //         productId: {
                                    //             type: 'object',
                                    //             properties:{
                                    //                 _id:'string',
                                    //                 brand:'string',
                                    //                 title:'string',
                                    //                 description:'string',
                                    //                 tagline:'string',
                                    //                 stock:'number',
                                    //                 price:{
                                    //                     type:'object',
                                    //                     properties:{
                                    //                         mrp:'number',
                                    //                         cost:'number',
                                    //                         discount:'string'
                                    //                     }
                                    //                 },
                                    //                 thumbnail:'string',
                                    //                 // image_url:[
                                    //                 //     'string'
                                    //                 // ]

                                    //             }
                                    //         },
                                    //         quantity: 'number'
                                    //     }
                                    // ],
                                    totalPrice: type,
                                    totalItems: type,
                                    createdAt: type,
                                    updatedAt: type
                                }
                            }
                        },
                    },
                },
            },
        },
    
        '500': {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: false
                            },
                            error: {
                                type: 'string',
                                example: 'Internal Server Error',
                            },
                        },
                    },
                },
            },
        },
    },
}

module.exports = { createCart, createCartBody,getUserCart }