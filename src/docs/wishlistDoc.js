const {product} = require('./productDoc')

const string = {
    type:'string'
}

const createWishlist = {
    tags: ['Wishlist'],
    description: 'Create user wishlist',
    requestBody: {
        content: {
            'application/json': {
                schema:{
                    type:'object',
                    properties:{
                        productId: {
                            type: 'string',
                            example: '650d4fa917e5ca9fb70d63ae'
                        }
                    }
                }
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
            description: 'On Succeessfully add product in wishlist',
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
                                example: 'Added to wishlist',
                            },
                            wishlist:{
                                type:'object',
                                properties:{
                                    _id:string,
                                    userId:string,
                                    products:{
                                        type:'array',
                                        items:string
                                    },
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
const getWishlist = {
    tags: ['Wishlist'],
    description: 'Get user wishlist',
    security: [
        {
            ApiKeyAuth: []
        },
    ],
    responses: {
        '200': {
            description: 'On Succeessfully get wishlist',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: true
                            },
                            wishlist:{
                                type:'object',
                                properties:{
                                    _id:string,
                                    userId:string,
                                    products:{
                                        type:'array',
                                        items:{
                                            type:'object',
                                            properties:product
                                        }
                                    },
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


const updateWishlist = {
    tags: ['Wishlist'],
    description: 'update user wishlist',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        productId: {
                            type: 'string',
                            example: '650d4fa917e5ca9fb70d63ae'
                        }
                    }
                }
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
            description: 'On Succeessfully update wishlist',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'boolean',
                                example: true
                            },
                            wishlist: {
                                type: 'object',
                                properties: {
                                    _id: string,
                                    userId: string,
                                    products: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: product
                                        }
                                    },
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


module.exports = { createWishlist, getWishlist, updateWishlist }