const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const password = '8uftxmhexuEIGnTJ';

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrxvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("shopdb").collection("products");

    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get("/products/:id", (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        // console.log(product);
        productCollection.insertOne(product)
            .then(result => {
                console.log("Product Added!!!");
                // res.send("Success!!!");
                res.redirect("/");
            })
    })
    // console.log('Database Connected');
    // perform actions on the collection object
    //   client.close();

    app.get("/editProduct/:id", (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.patch("/update/:id", (req, res) => {
        productCollection.updateOne({_id: ObjectId(req.params.id)}, 
        {
            $set: {name: req.body.name, price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => {
            // console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            // console.log(result);
            res.send(result.deletedCount > 0);
        })
    })
});

app.get("/", (req, res) => {
    // res.send("HOME PAGE!!!");
    res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.PORT || 5000, () => {
    console.log("SERVER HAS STARTED!!!");
})