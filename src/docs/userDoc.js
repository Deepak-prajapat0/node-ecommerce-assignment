const registerUser = {
    tags: ['Users'],
    description: 'Create a new user',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/registerUserBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '201': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status:{
                                type:'boolean',
                                example:true
                            },
                            msg:{
                                type:"string",
                                example:'Account created successfully'
                            },
                            user:{
                                type:'object',
                                properties:{
                                    _id: {
                                        type: 'string',
                                        description:'mongodb object id',
                                    },
                                    name: {
                                        type: 'string',
                                    },
                                    phone: {
                                        type: 'string',
                                    },
                                    email: {
                                        type: 'string',
                                    },
                                    password: {
                                        type: 'string',
                                        description: "unencrypted user's password",
                                    },
                                    emailToken: {
                                        type: 'string',
                                        description: "emailtoken when user request reset link",
                                    },
                                    emailTokenExp: {
                                        type: 'Date',
                                        description: "emailtoken expire time",
                                    },
                                    tokens:{
                                        type:'array',
                                        description:"all token that are generated when login"
                                    },
                                    createdAt: {
                                        type: 'string',
                                    },
                                    updatedAt: {
                                        type: 'string',
                                    },
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
                            message: {
                                type: 'string',
                                example: 'Internal Server Error',
                            },
                        },
                    },
                },
            },
        },
    },
};

const registerUserBody = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            required: true,
            example: 'John Snow',
        },
        phone: {
            type: 'string',
            example: '9865784565'
        },
        email: {
            type: 'string',
            unique: true,
            example: 'john.snow@email.com',
        },
        password: {
            type: 'string',
            description: "unencrypted user's password",
            example: '!1234aWe1Ro3$#',
        }
    },
};


const loginUser = {
    tags: ['Users'],
    description: 'User login',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/loginUserBody',
                },
            },
        },
        required: true,
    },
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
                            msg:{
                                type:'string',
                                example:'Login successful'
                            }
                            // user: {
                            //     type: 'object',
                            //     properties: {
                            //         _id: {
                            //             type: 'string',
                            //             description: 'mongodb object id'
                            //         },
                            //         name: {
                            //             type: 'string'
                            //         },
                            //         phone: {
                            //             type: 'string'
                            //         },
                            //         email: {
                            //             type: 'string'
                            //         },
                            //         password: {
                            //             type: 'string',
                            //             description: "unencrypted user's password"
                            //         },
                            //         emailToken: {
                            //             type: 'string',
                            //             description: "emailtoken when user request reset link",
                            //         },
                            //         emailTokenExp: {
                            //             type: 'Date',
                            //             description: "emailtoken expire time",
                            //         },
                            //         tokens:{
                            //             type:'[string]',
                            //             description:"all token that are generated when lgin"
                            //         },
                            //         createdAt: {
                            //             type: 'string'
                            //         },
                            //         updatedAt: {
                            //             type: 'string'
                            //         },
                            //     }
                            // },
                            // token: {
                            //     type: 'string'
                            // }
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
                            message: {
                                type: 'string',
                                example: 'Internal Server Error',
                            },
                        },
                    },
                },
            },
        },
    },
};


const loginUserBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'john.snow@email.com',
        },
        password: {
            type: 'string',
            example: '!1234aWe1Ro3$#',
        }
    },
};

const forgotPassword = {
    tags: ['Users'],
    description: 'Forgot password',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/forgotPasswordBody',
                },
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'If an account exists for email, you will get an link to resetting your password.',
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
                                example: 'If an account exists for this email , you will get an link to resetting your password.',
                            },
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


const forgotPasswordBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            required: true,
            example: 'john.snow@email.com',
        },
    },
}


const updatePassword = {
    tags: ['Users'],
    description: 'update password',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/updatePasswordBody',
                },
            },
        },
        required: true,
    },
    parameters: [
        {
            name: 'emailToken',
            in: 'path',
            description: 'token from Email',
            required: true,
            type: 'string',
        },
    ],
    responses: {
        '200': {
            description: 'When password updated',
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
                                example: 'Your password updated Successfully',
                            },
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

const updatePasswordBody = {
    type: 'object',
    properties: {
        password: {
            type: 'string',
            required: true,
            example: '123456',
        },
        confirmPassword: {
            type: 'string',
            required: true,
            example: '123456',
        },
    },
}


const logOut = {
    tags: ['Users'],
    description: 'Logout user',
    operationId: 'LogoutUser',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '204': {
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
                                example: 'Logout successfully',
                            },
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

















module.exports = { registerUser, registerUserBody, loginUser, loginUserBody, forgotPassword, forgotPasswordBody, updatePassword, updatePasswordBody, logOut };