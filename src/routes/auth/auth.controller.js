
const  User = require('../../models/users.mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {  registerIndividualCustomer, updateAdmin, updateVendor, registerAdmin, registerCompanyCustomer, registerVendor, getAllUsers} = require('../../models/users.model')


const httpUpdateVendor = async (req, res) => {
    try {
        const vendorId = req.body.vendorId
        console.log('vendor Id', vendorId)
        const data = req.body;
        const updatedVendor = await updateVendor(vendorId, data);
        res.status(200).json(updatedVendor);
    } catch (err) {
        console.log("Error in updating vendor", err);
        return res.status(500).json({message: err})
    }
}

const httpUpdateAdmin = async (req, res) => {
    try {
        const adminId = req.body.adminId
        const data = req.body;
        const updatedAdmin = await updateAdmin(adminId, data);
        res.status(200).json(updatedAdmin);
    } catch (err) {
        console.log("Error in updating admin", err);
        return res.status(500).json({message: err})
    }
}

const httpRegisterVendor = async (req, res) => {
    try {
        await registerVendor(req.body)

        res.status(201).json({message: 'Vendor created successfully'})
    } catch (err) {
        console.log("Error in creating vendor", err);
        return res.status(500).json({message: err})
    }
}


const httpGetAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch (err) {
        console.log("Error in getting all users", err);
        return res.status(500).json({message: err})
    }
}

const httpRegisterIndividualCustomer = async (req, res) => {
    try {
        await registerIndividualCustomer(req.body);

        res.status(201).json({message: 'User created successfully'})

    } catch (err) {
        console.log("Error in creating individual customer", err);
        return res.status(500).json({message: err})
    }
}

const httpRegisterCompanyCustomer = async (req, res) => {
    try {
        await registerCompanyCustomer(req.body)

        res.status(201).json({message: 'Company created successfully'})
    } catch (err) {
        console.log("Error in creating company customer", err);
        return res.status(500).json({message: err})
    }
}

const httpRegisterAdmin = async (req, res) => {
    try {
        await registerAdmin(req.body)

        res.status(201).json({message: 'Admin created successfully'})
    } catch (err) {
        console.log("Error in creating admin", err);
        return res.status(500).json({message: err})
    }
}

const register = async (req, res) => {
    
    try {const {username, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username,
            password: hashedPassword,
            role
        })
        await newUser.save();
        return res.status(201).json({message: 'User created successfully'})
    } catch(err) {
        return res.status(500).json({message: err})
    }
}

const login = async (req, res) => {
    try {const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role

        }, process.env.JWT_SECRET , {expiresIn: '1h'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 
        })

        return res.status(200).json({ "Message" :"Login successful",  "role": user.role})
    } catch(err) {
        console.log(err)
        return res.status(500).json({message: err})
        
    }

}

module.exports = {
    register,
    login, 
    httpRegisterIndividualCustomer,
    httpRegisterCompanyCustomer,
    httpRegisterAdmin,
    httpRegisterVendor,
    httpGetAllUsers,
    httpUpdateAdmin,
    httpUpdateVendor
}