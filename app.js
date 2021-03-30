const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const password = '8uftxmhexuEIGnTJ';

// mongoose.connect("mongodb+srv://AbuSalehFaysal:@cluster0.hrxvr.mongodb.net/newshub?retryWrites=true&w=majority");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://AbuSalehFaysal:8uftxmhexuEIGnTJ@cluster0.hrxvr.mongodb.net/shopdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("shopdb").collection("products");

    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
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

app.listen(5000, () => {
    console.log("SERVER HAS STARTED!!!");
})