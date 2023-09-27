const string={
    type:'string'
}
const number={
    type:'number'
}

const product = {
    productId: {
        type: 'object',
        properties: {
            _id: string,
            title: string,
            brand: string,
            description: string,
            stock: number,
            price: {
                type: 'object',
                properties: {
                    mrp: number,
                    cost: number,
                    discount: string
                }
            },
            thumbnail: string,
            image_url: {
                type: 'array',
                items: string
            },
            features: {
                type: 'array',
                items: string
            },
            productDetails: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        key: string,
                        value: string
                    }
                }
            },

        }
    },
    quantity: number
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
            ApiKeyAuth: []
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
                                    _id:string,
                                    userId:string,
                                    cartItems:{
                                            type:'array',
                                            items:{
                                                type:'object',
                                                properties: {
                                                    productId:string,
                                                    quantity: number
                                                }
                                            },
                                            
                                    },
                                    totalPrice:number,
                                    totalItems:number,
                                    createdAt:string,
                                    updatedAt:string
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
    description: 'Get user Cart',
    security: [
        {
            ApiKeyAuth: []
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
                            cart: {
                                type: 'object',
                                properties:{
                                    _id: string,
                                    userId: string,
                                    cartItems: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: product
                                        }
                                    },
                                    totalPrice:number,
                                    totalItems:number,
                                    createdAt:string,
                                    updatedAt:string
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
const updateUserCart = {
    tags: ['Cart'],
    description: 'Get user Cart',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/updateCartBody',
                },
            },
        },
        required: true,
    },
    security: [
        {
            ApiKeyAuth: []
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
                            cart: {
                                type: 'object',
                                properties: {
                                    _id: string,
                                    userId: string,
                                    cartItems: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: product
                                        }
                                    },
                                    totalPrice: number,
                                    totalItems: number,
                                    createdAt: string,
                                    updatedAt: string
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

const updateCartBody={
    type: 'object',
    properties: {
        productId: {
            type: 'string',
            example: '650d4fa917e5ca9fb70d63ae',
        },
        quantity: {
            type: 'number',
            example: '2',
        }
    },
}

module.exports = {product, createCart, createCartBody,getUserCart,updateUserCart,updateCartBody }