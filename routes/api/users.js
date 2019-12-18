const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require("express-validator");
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// POST api/users
// Register a user
// Public Route

router.post(
    "/",
    [
        check("name", "Please enter a valid username")
            .isAlphanumeric()
            .notEmpty(),
        check("email", "Please enter a valid email")
            .isEmail(),
        check("password", "Please enter a password with 6 or more characters")
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, email, password, avatar } = req.body;

        try {
            let user = await User.findOne({ $or: [{ name }, { email }] });

            if (user) {
                return res
                    .status(500)
                    .json({ errors: [{ msg: "Username / Email already exists" }] });
            }

            // Make new User

            if (!avatar) avatar = '';

            user = new User({
                name,
                email,
                password,
                avatar
            });

            // Encrypt Password

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // await bcrypt.genSalt(10, (err, salt) => {
            //     await bcrypt.hash(password, salt, (err, hash) => {
            //         user.password = hash;
            //     });
            // });

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                'mysecretkey',
                {},
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
)

//GET api/users/:name
//Get user details
//public route

router.get(
    '/:name',
    async (req, res) => {
        try {
            let user = await User.findOne({ name: req.params.name }).select("-password").populate('postsMade.post');

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            res.json(user)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

//PUT /api/users/:name/edit
//Edit User
//Private route
router.put(
    "/:name/edit",
    [
        auth,
        check("email", "Make sure email is a valid email")
            .isEmail(),
        check("avatar", "Make sure avatar is a valid URL")
            .isURL()
    ],
    async (req, res) => {
        let { email, avatar } = req.body;

        try {
            const user = await User.find({ name: req.params.name });

            const checkEmail = await User.findOne({ email: req.body.email });

            if (checkEmail) {
                return res.status(500).json({ msg: "User with that email already exists" })
            }

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            if (req.params.name !== req.user.name) {
                return res.status(500).json({ msg: "Unauthorized" })
            }

            let newUser = await User.findByIdAndUpdate(req.user.id, {
                email, avatar
            }, { new: true })

            res.json(newUser)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)
//Put api/users/:name/follow
//Follow user
//Private route

router.put(
    "/:name/follow",
    auth,
    async (req, res) => {
        try {
            const activeUser = await User.findById(req.user.id)
            const user = await User.findOne({ name: req.params.name });

            if (!user) {
                return res.status(404).json({ msg: "User now found" })
            }

            if (user.followers.find(({ name }) => name === activeUser.name)) {
                return res.status(400).json({ msg: "Already following user" })
            }

            user.followers.unshift({
                user: activeUser.id,
                name: activeUser.name
            })

            activeUser.following.unshift({
                user: user.id,
                name: user.name
            })

            await activeUser.save()
            await user.save()

            res.json(user.followers)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

//PUT /api/users/:name/unfollow
//Unfollow User
//Private route

router.put(
    "/:name/unfollow",
    auth,
    async (req, res) => {
        try {
            const activeUser = await User.findById(req.user.id)
            const user = await User.findOne({ name: req.params.name });

            if (!user) {
                return res.status(404).json({ msg: "User now found" })
            }

            if (!user.followers.find(({ name }) => name === activeUser.name)) {
                return res.status(400).json({ msg: "User not followed" })
            }

            let removeIndex = user.followers.find(({ name }) => name === activeUser.name)

            user.followers.splice(removeIndex, 1)

            removeIndex = activeUser.following.find(({ name }) => name === user.name)

            activeUser.following.splice(removeIndex, 1)

            await activeUser.save()
            await user.save()

            res.json(user.followers)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)


module.exports = router;