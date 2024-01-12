
DELIVERY APP (task from DESQUARED)

Built with JS (commonJS) : 

    Back-end: Node.js, Express.js framework for REST API, MongoDB database with Mongoose library
    
    Front-end: HTML, CSS, Socket.io for web-sockets live communication with server
    
    Third party APIs: fixer.io (currency rates) , Twilio SendGrid (emails) !!!KEYS NEEDED FOR BOTH !!!
    
    Testing: Postman, Jest
    

USAGE:

A) For use in dev environment:
  1) Create a dev.env file to store the below key value pairs:

          PORT=3000
     
          MONGOOSE_URI=mongodb://127.0.0.1:27017/delivery-app-api
     
          FIXER_API_KEY= your fixer API key
     
          JWT_SECRET_MERCHANT=mySecret1
     
          JWT_SECRET_ADMIN=mySecret2
     
          JWT_SECRET_ORDER=mySecret3
     
          SENDGRID_API_KEY= your sendgrid API key
    

  
  3) Open one terminal and connect to mongodb server:
     > /Users/"userName"/mongodb/bin/mongod.exe --dbpath="your/path"



  4) Open second terminal and in project directory:
     > npm run dev


     
  5) Open web browser tab and in url type:
     htpp://localhost:3000

     

  6) In other web browser tab add the link:
     https://pavlos-desquared.postman.co/workspace/83c65b9a-bb8f-4532-b846-e3f2e86596b6

     

  7) Inside Postman:


    a) Create a merchant (there is a saved one for convinience):
    
        {
          "name": "amerch",
          "email": "amerch@gmail.com",
          "telephone": "1234567890",
          "password": "amerch12!",
          "city": "IOANNINA",
          "street": "KROMIDA",
          "number": "15",
          "postalCode": "12345",
          "menu": [{
            "category": "Starters",
                  "name": "greek salad",
                  "description": "tomato, cucamber, feta cheese, onions, olives",
                  "stock": 220,
                  "price": {
                      "value": 5.50,
                      "currency": "EUR"
                  }
              },{
              "category": "Mains",
                  "name": "pizza margharita",
                  "description": "tomato sauce, mozzarela, oregano",
                  "stock": 300,
                  "price": {
                      "value": 8.50,
                      "currency": "EUR"
                  }
              }
          ]
      }

     
    b) Login the merchant (in body you can wright the email and password for authentication)
      {
        "email": "amerch@gmail.com",
        "password": "amerch12!"
      }

     
    c) Create an order for the merchant we created ( "shop" field must have the _id of an existing merchant):
    
      {
        "shop": "COPY FROM THE MERCHANT YOU CREATED ABOVE",
        "email": "pavlos@gmail.com",
        "phone": "0987654321",
        "city": "IOANNINA",
        "street": "MAGGELOU",
        "number": "123",
        "postalCode": "44445",
        "ringBellName": "Pavlos B",
        "targetCurrency": "EUR",
        "cart": [{
            "item": {
                "category": "Starters",
                "name": "greek salad",
                "quantity": 1,
                "price": 5.50,
                "currency": "EUR"
            }
        },
        {
            "item": {
                "category": "Mains",
                "name":"pizza margharita",
                "quantity": 1,
                "price": 8.50,
                "currency": "EUR"
            }
        }]
      }


7) When we login a new merchant in the browser we can see the order list rendered


   
8) We can click fro order list to see it's full details on the side


      
10) When the order is ready and leaves the store the merchand hits the "Finalize Order" button...
   This triggers the server to update the orders "Status" field to "Finalized" in the database which trully happens
   and then the server should send the updated activeOrders list to the clinet for render
        
     (!!!SOS!!! the render does not happen due to unknown reasons yet,
     although the aknowledgements and the logs of the transfer data in the server terminal are normal!!!SOS!!!)

     "...WORKING TO RESOLVE THIS"

   
        
11) If we create a new order all the server side job is done again properly +the new order is
    created in the database, except that the new order is not added in the rendered list on the browser,
    unless we login again (!!!SOS!!!)

    "...WORKING TO RESOLVE THIS ALSO"

    

13) I created a test db for testing with yest but the test.merchant.js & test.order.js files are not yet ready
    "STILL WORKING ON IT"
