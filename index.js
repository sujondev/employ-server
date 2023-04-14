const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();





// Middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2sdc0k9.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {

    try {
        await client.connect();
        const employeeCollection = client.db("EmployeeManagement").collection("employees");

        app.post('/addEmployee', async (req, res) => {
            const employee = req.body;
            console.log(employee);
            const result = await employeeCollection.insertOne(employee);
            res.send(result)
        });

        app.get('/employees', async (req, res) => {
            const cursor = employeeCollection.find({});
            const employees = await cursor.toArray();
            res.send(employees);
        });

        app.get('/employee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await employeeCollection.findOne(query)

            // console.log(result);
            res.send(result);
        });


        app.put('/updateEmployee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const employee = req.body;
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: employee.name,
                    email: employee.email,
                    phone: employee.phone,

                },
            };
            const result = await employeeCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        });


        app.delete('/deleteEmployee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await employeeCollection.deleteOne(query);
            res.send(result);
        });

    }

    finally {

    }
}

run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('server is working fine')
});





app.listen(port, () => console.log(`server is running on port ${port}`));