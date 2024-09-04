const connectToDatabase = require("./dbConnect");
const customerLog = require("./models/customerLog.model");
const customer = require("./models/customer.model");
const mongoose = require("mongoose");

dbConnect = async (req, res) => {
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 25,
    minPoolSize: 10,
  });
  console.log("Connected to MongoDB!");
};

module.exports = {
  getUserLogs:
    ("/user/logs",
    async (req, res) => {
      try {
        const { locationId, startDate, endDate } = req.body;
        if (!locationId || !startDate || !endDate) {
          return res.status(400).send("Missing required fields");
        }
        const db = await connectToDatabase();
        const customerLogs = db.collection("customerLogs");
        const customers = db.collection("customers");

        const logs = await customerLogs
          //get logs for all customers in the selected date range
          .find({
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            //filter by location with subquery to get all customers in the location
            customerId: {
              $in: (
                await customers
                  .find({ locationId })
                  .project({ customerId: 1 })
                  .toArray()
              ).map((c) => c.customerId),
            },
          })
          .toArray();

        //group logs by customerId
        const groupedLogs = logs.reduce((acc, log) => {
          if (!acc[log.customerId]) {
            acc[log.customerId] = [];
          }
          acc[log.customerId].push(log);
          return acc;
        }, {});

        //prepare response so it is an array of objects
        //instead of an object with customerId as key
        //e.g. { customerId: 1, logs: [log1, log2, log3]
        const response = Object.keys(groupedLogs).map((customerId) => ({
          customerId,
          logs: groupedLogs[customerId],
        }));

        res.json(response);
      } catch (error) {
        console.error("Failed to connect to MongoDB =>", error);
        res.status(500).send("Failed to connect to MongoDB");
        throw error;
      }
    }),
  getUserLogs2:
    ("/user/logs",
    async (req, res) => {
      const { locationId, startDate, endDate } = req.body;
      if (!locationId || !startDate || !endDate) {
        return res.status(400).send("Missing required fields");
      }

      await dbConnect();

      const logsByCustomer = await customer.aggregate([
        {
          $match: {
            locationId,
          },
        },
        //join customerlogs with customers
        {
          $lookup: {
            from: "customerlogs",
            localField: "customerId",
            foreignField: "customerId",
            as: "logs",
          },
        },
        {
          $unwind: "$logs",
        },
        {
          $match: {
            "logs.date": {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        // group logs by customerId and push them into an array
        {
          $group: {
            _id: "$customerId",
            logs: {
              $push: {
                type: "$logs.type",
                text: "$logs.text",
                date: "$logs.date",
              },
            },
          },
        },
        // join customers with customerlogs to provide customer info
        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "customerId",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $project: {
            _id: 0,
            customerId: "$_id",
            logs: 1,
            customerInfo: {
              name: {
                $concat: ["$customer.firstName", " ", "$customer.lastName"],
              },
              email: "$customer.email",
              phone: "$customer.phone",
            },
          },
        },
        // sort by customerId
        {
          $sort: {
            customerId: 1,
          },
        },
      ]);

      res.json(logsByCustomer);
    }),
};
