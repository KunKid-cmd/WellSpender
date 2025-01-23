require("dotenv").config();

const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const express = require("express");
const cors = require ("cors");
const jwt = require("jsonwebtoken");

const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const Transaction = require("./models/transaction.model")
const BudgetGoal = require("./models/budgetGoal.model")

mongoose.connect(process.env.MongoDB_Key);

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

// Signup Account 
app.post("/create-account", async (req, res) => {
    const { username, email, password} = req.body;

    // Check missing input
    if(!username || !email || !password) {
        return res.status(400).json({error: true, message: "All field are required"});
    }
    // Check unique email
    const isUser = await User.findOne({ email });
    if(isUser){
        return res.status(400).json({error: true, message: "User already exists"});
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        {userId : user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    )
    
    return res.status(201).json({error:false,user: 
        {
            username: user.username,
            email: user.email,
        },accessToken,message: "Registration Successful",
    });
});

// Login Account
app.post("/login", async (req, res) => {
    const { email, password} = req.body;
    // Check missing input
    if (!email || !password){
        return res.status(400).json({message: "Email and Password are required"});
    }
    // Check matching email
    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({message:"User not found"});
    }
    // Check password
    const isPasswordValid = await bycrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid Password"});
    }

    const accessToken = jwt.sign(
        {userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.json({
        error:false,
        message:"Login Successful",
        user: {username: user.username, email: user.email },
        accessToken,
    });

});

// get user
app.get("/get-user",authenticateToken , async (req, res) => {
    const {userId} = req.user;

    const isUser = await User.findOne({_id: userId});

    if (!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

// add transaction
app.post("/add-transaction",authenticateToken , async (req, res) => {
    const {name ,description ,amount ,type ,category} = req.body;
    const {userId} = req.user;

    // valid required fields
    if (!name || !description || !amount || !type || !category){
        return res.status(400).json({error: true, message:"All fields are require"})
    }

    try{
        const transaction = new Transaction({
            userId,
            name,
            description,
            amount,
            type,
            category,
        });
        await transaction.save();
        res.status(201).json({transactionList: transaction, message: "Added Successfully"});
    } catch(error){
        res.status(400).json({error:true, message: error.message});
    }
})

// delete transaction
app.delete("/delete-transaction/:id",authenticateToken , async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // find transaction by id
        const transaction = await Transaction.findOne({_id: id, userId: userId});
        if (!transaction){
            return res.status(404).json({error:true, message: "Transaction not found"})
        };
        
        await transaction.deleteOne({ _id: id, userId: userId});
        
        res.status(200).json({error: false,message: "Transaction delete successfully"})
    } catch(error){
        return res.status(400).json({error:true, message:error.message})
    };
})

// get all transaction
app.get("/get-all-transaction",authenticateToken , async (req, res) => {
    const { userId } = req.user;

    try{
        const transaction = await Transaction.find({userId: userId}).sort({date: -1});
        res.status(200).json({ transactions: transaction });
    } catch (error){
        res.status(500).json({error:true , message: error.message})
    }
});

// get budgetgoal
app.get("/get-budgetgoal",authenticateToken , async (req, res) => {
    const { userId } = req.user;

    try{
        const budgetgoal = await BudgetGoal.find({userId: userId});
        res.status(200).json({ budgetgoal: budgetgoal });
    } catch (error){
        res.status(500).json({error:true , message: error.message})
    }
});

// edit budgetgoal
app.post("/edit-budgetgoal",authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { name, targetAmount, currentAmount} = req.body;

    if(!name || !targetAmount || !currentAmount) {
        return res.status(400).json({error:true, message:"All fields are required"});
    }

    try {
        const budgetgoal = await BudgetGoal.findOne({userId: userId});
        
        if (!budgetgoal){
            const budgetgoal = new BudgetGoal({
                userId,
                name,
                targetAmount,
                currentAmount,
            });
            
            await budgetgoal.save();
        } else{
            budgetgoal.name = name;
            budgetgoal.targetAmount = targetAmount;
            budgetgoal.currentAmount = currentAmount;   

            await budgetgoal.save();
        }
        res.status(200).json({error:false, message: "Update Successful"})
        
    } catch (error) {
        res.status(500).json({error: true, message: error.message})
    }
});

// add budgetgoal
app.post("/add-budgetgoal",authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { currentAmount } = req.body;

    if( !currentAmount ) {
        return res.status(400).json({error:true, message:"All fields are required"});
    }

    try {
        const existingGoal = await BudgetGoal.findOne({userId: userId});
        if (existingGoal) {
            // Add the new currentAmount to the existing amount
            existingGoal.currentAmount += Number(currentAmount);

            // Save the updated goal
            await existingGoal.save();

            res.status(200).json({ message: "Budget goal updated successfully!", budgetGoal: existingGoal });
        }

    } catch (error) {
        res.status(500).json({error: true, message: error.message})
    }
});


app.listen(process.env.PORT);
module.exports = app;
