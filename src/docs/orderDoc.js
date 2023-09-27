
const {product}=require('./cartDoc')

const string = {
    type: 'string'
}
const number = {
    type: 'number'
}

const shippingAddress={
    name: string,
    phone: string,
    address: {
        type: 'object',
        properties: {
            house: string,
            street: string,
            city: string,
            state: string,
            pincode: number
        }
    }
}



const createOrder ={
    tags:['Order'],
    description:"Create user order",
    requestBody:{
        content:{
            'application/json':{
                schema:{
                    $ref:'#/components/schemas/createOrderBody',
                }
            }
        },
        required:true
    },
    security:[
        {
            ApiKeyAuth:[]
        }
    ],
    responses:{
        '201':{
            description:"On Successfully order placed",
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'boolean',
                                example:true
                            },
                            msg:{
                                type:'string',
                                example:'Order Done'
                            },
                            userOrder:{
                                type:'object',
                                properties:{
                                    _id:string,
                                    userId:string,
                                    orderDetails:{
                                        type:'object',
                                        properties:{
                                            products:{
                                                type:'array',
                                                items:{
                                                    type:'object',
                                                    properties:{
                                                        productId:string,
                                                        quantity:number,
                                                        canceled:{
                                                            type:'boolean',
                                                            example:false
                                                        }
                                                    }
                                                }
                                            },
                                            totalItems:number,
                                            totalPrice:number,
                                        }
                                    },
                                    shippingDetails:{
                                        type:'object',
                                        properties: shippingAddress                                        
                                    },
                                    status:string,
                                    paymentStatus:string,
                                    paymentId:string,
                                    createdAt:string,
                                    updatedAt:string
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


const getUserOrder={
    tags:['Order'],
    description:'Get User Order',
    security:[
        {
            ApiKeyAuth:[]
        }
    ],
    responses:{
        '200':{
            description:'On Successfully get user order',
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'string',
                                example:true
                            },
                            msg:{
                                type:'string',
                                exapmle:'User Order'
                            },
                            order:{
                              type:'array',
                              items:{
                                  type: 'object',
                                  properties: {
                                      _id: string,
                                      userId: string,
                                      orderDetails: {
                                          type: 'object',
                                          properties: {
                                              products: {
                                                  type: 'array',
                                                  items: {
                                                      type: 'object',
                                                      properties: product
                                                  }
                                              },
                                              totalItems: number,
                                              totalPrice: number
                                          }
                                      },
                                      shippingDetails: {
                                          type: 'object',
                                          properties: shippingAddress
                                      },
                                      status: string,
                                      paymentStatus: string,
                                      paymentId: string,
                                      createdAt: string,
                                      updatedAt: string
                                  }
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
        }
    }
}


const getOrderWithId={
    tags:['Order'],
    description:'Get order of user by orderId',
    parameters:[
        {
            name:'orderId',
            in:'path',
            description:'Id of order that you want to get ',
            required:true,
            type:'string',
            example:'6513d633638d4576306d272d'
        }
    ],
    responses:{
        '200':{
            description:'Success , when order found with id',
            content:{
                'application/json':{
                    schema:{
                        type:'object',
                        properties:{
                            status:{
                                type:'boolean',
                                example:true
                            },
                            msg:{
                                type:'string',
                                example:''
                            },
                            order: {
                                    type: 'object',
                                    properties: {
                                        _id: string,
                                        userId: string,
                                        orderDetails: {
                                            type: 'object',
                                            properties: {
                                                products: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: product
                                                    }
                                                },
                                                totalItems: number,
                                                totalPrice: number
                                            }
                                        },
                                        shippingDetails: {
                                            type: 'object',
                                            properties: shippingAddress
                                        },
                                        status: string,
                                        paymentStatus: string,
                                        paymentId: string,
                                        createdAt: string,
                                        updatedAt: string
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
        }
    }
}


const cancelProductInOrder = {
    tags: ['Order'],
    description: 'Cancel product in an order by productId',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/cancelProductBody',
                }
            }
        },
        required: true
    },
    security: [
        {
            ApiKeyAuth: []
        }
    ],
    parameters: [
        {
            name: 'orderId',
            in: 'path',
            description: 'Id of order that you want to get ',
            required: true,
            type: 'string',
            example: '6513d633638d4576306d272d'
        }
    ],
    responses: {
        '200': {
            description: 'Success , when product cancel in a order',
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
                                example: 'Order updated'
                            },
                            order: {
                                type: 'object',
                                properties: {
                                    _id: string,
                                    userId: string,
                                    orderDetails: {
                                        type: 'object',
                                        properties: {
                                            products: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: product
                                                }
                                            },
                                            totalItems: number,
                                            totalPrice: number
                                        }
                                    },
                                    shippingDetails: {
                                        type: 'object',
                                        properties: shippingAddress
                                    },
                                    status: string,
                                    paymentStatus: string,
                                    paymentId: string,
                                    createdAt: string,
                                    updatedAt: string
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
        }
    }
}


const cancelOrder ={
    tags: ['Order'],
    description: 'Cancel Order by orderId',
    security: [
        {
            ApiKeyAuth: []
        }
    ],
    parameters: [
        {
            name: 'orderId',
            in: 'path',
            description: 'Id of order that you want to get ',
            required: true,
            type: 'string',
            example: '6513d633638d4576306d272d'
        }
    ],
    responses: {
        '200': {
            description: 'Success , when order cancel',
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
                                example: 'Order canceled'
                            },
                            order: {
                                type: 'object',
                                properties: {
                                    _id: string,
                                    userId: string,
                                    orderDetails: {
                                        type: 'object',
                                        properties: {
                                            products: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: product
                                                }
                                            },
                                            totalItems: number,
                                            totalPrice: number
                                        }
                                    },
                                    shippingDetails: {
                                        type: 'object',
                                        properties: shippingAddress
                                    },
                                    status: string,
                                    paymentStatus: string,
                                    paymentId: string,
                                    createdAt: string,
                                    updatedAt: string
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
        }
    }
}




const createOrderBody={
    type:'object',
    properties:{
        name:{
            type:'string',
            example:'John'
        },
        phone:{
            type:'number',
            example:'9874563214'
        },
        house:{
            type:'string',
            example:'House number 123'
        },
        street:{
            type:'string',
            example:'Round street'
        },
        city:{
            type:'string',
            example:'Mohali'
        },
        state:{
            type:'string',
            example:'Punjab'
        },
        pincode:{
            type:'number',
            example:'123456'
        },
    }
}

const cancelProductBody={
    type:'object',
    properties:{
        productId:{
            type:'string',
            example:'650d4fa917e5ca9fb70d63ae'
        }
    }
}

module.exports = { createOrder, createOrderBody, getUserOrder, getOrderWithId, cancelProductInOrder ,cancelProductBody,cancelOrder}