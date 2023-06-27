
# Ecommerce - App

In this app  user can create its account,do login and add some products into his cart and then place order.



## Run Locally

Clone the project

```bash
  git clone https://github.com/Deepak-prajapat0/node-ecommerce-assignment.git
```
Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## API Reference

## token will be send in headers "x-api-key"
### User Routes
#### Create user Account

```http
  POST /register
```
#### Login user

```http
  POST /login
```

#### Forgot Password

```http
  POST /forgetpassword   
```
#####   it will send a link to provided email 

#### Update Password after verifying emailToken

```http
  PUT /updatepassword/:emailToken
```



| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `emailToken`      | `string` | **Required**. parameter to fetch user |


#### Logout user
```http
  POST /logout      required (token)
```

### cart Routes

#### Add item into cart 
```http
  POST /cart/add    required (token)
```

### order Routes

#### Create a order
```http
  POST /order       required (token)
```

#### get user order
```http
  GET /order        required (token)
```



## Collections

### User Collections


    const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      minLength: 12,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 5,
      required: true,
      trim: true,
    },
    emailToken: {
      type: String,
      default: "",
    },
    emailTokenExp: {
      type: Date,
      default: new Date(),
    },
    tokens: [
      {
        type: Object,
        default: "",
      },
    ],
    },{ timestamps: true });

    module.exports = mongoose.model("User", userSchema);


#
### Cart Collections

    const mongoose = require("mongoose");
    const objectId = mongoose.Types.ObjectId;

    const cartSchema = new mongoose.Schema(
    {
    userId: {
      type: objectId,
      ref: "User",
      trim: true,
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: objectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    },{ timestamps: true });

    module.exports = mongoose.model("Cart", cartSchema);


### order Collections


    const mongoose = require("mongoose");
    const objectId = mongoose.Types.ObjectId;

    const orderSchema = new mongoose.Schema({
    userId: {
      type: objectId,
      ref: "User",
      required: true,
      trim:true
    },
    orderDetails: {
      products: [
        {
          productId: {
            type: objectId,
            ref: "Product",
            required: true,
            trim:true
          },
          quantity: {
            type: Number,
            required: true,
            trim:true
          },
          _id: false,
        },
      ],
      totalItems: {
        type: Number,
        required: true,
        trim:true
      },
      totalPrice: {
        type: Number,
        required: true,
        trim:true
      },
    },
    shippingDetails: {
      name: {
        type: String,
        required: true,
        trim:true
      },
      phone: {
        type: Number,
        required: true,
        trim:true
      },
      address: {
        house: {
          type: String,
          required: true,
          trim:true
        },
        street: {
          type: String,
          required: true,
          trim:true
        },
        city: {
          type: String,
          required: true,
          trim:true
        },
        state: {
          type: String,
          required: true,
          trim:true
        },
        pincode: {
          type: Number,
          required: true,
          trim:true,
          minLength: 6,
          maxLength: 6,
        },
      },
    },
      status:{
        type:String,
        enum:["pending","Delivered","Canceled"],
        default:"pending"
      }
    });


    module.exports = mongoose.model("Order",orderSchema)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_URI`

`PORT`

`JWT_PRIVATE_KEY`

#### For nodemailer
`EMAIL_USER` 

`EMAIL_PASS` 

`EMAIL_HOST` 

`EMAIL_PORT `



## Author

- [@Deepak](https://github.com/Deepak-prajapat0)

