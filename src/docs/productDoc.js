const string = {
    type: 'string'
}
const number = {
    type: 'number'
}
const product = {  
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
            createdAt:string,
            updatedAt:string
}


const getAllProducts={
    tags:['Product'],
    description:'Get all product from store',
    responses:{
        '200':{
            description:'Success',
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'boolean',
                                example:true
                            },
                            products:{
                                type:'array',
                                items: {
                                    type:'object',
                                    properties: product
                                }
                            }
                        }
                    }
                }
            }
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
    }
}
const getProductById={
    tags:['Product'],
    description:'Get product By id',
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'id of product that you want to get ',
            required: true,
            type: 'string',
            example:'650d4fa917e5ca9fb70d63ae'
        }
    ],
    responses:{
        '200':{
            description:'Success',
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'boolean',
                                example:true
                            },
                            products:{
                                type:'object',
                                properties: product
                            }
                        }
                    }
                }
            }
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
    }
}

const getSearchedProduct={
    tags:['Product'],
    description:'Get product By id',
    parameters: [
        {
            name: 'q',
            in: 'query',
            description: 'query by which you want the product ',
            required: true,
            type: 'string',
            example:'shirt'
        }
    ],
    responses:{
        '200':{
            description:'Success',
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'boolean',
                                example:true
                            },
                            products:{
                                type:'object',
                                properties: product
                            }
                        }
                    }
                }
            }
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
    }
}


module.exports = { product, getAllProducts, getProductById, getSearchedProduct }