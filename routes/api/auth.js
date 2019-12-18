const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrpyt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

const auth = require('../../middleware/auth')

// GET api/auth
// Test route for auth
// Private route

router.get(
    "/",
    auth,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");

            res.json(user);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
);

// POST api/auth
// Log in user
// Public route

router.post(
    "/",
    [
        check("name", "Please enter a valid username")
            .notEmpty(),
        check("password", "Please enter a vlaid pasword")
            .notEmpty()
            .exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, password } = req.body;

        try {
            let user = await User.findOne({ name })

            // See if user exists
            if (!user) {
                return res.status(404).json({ errors: [{ msg: "Please check username and password" }] })
            }

            const isMatch = bcrpyt.compare(password, user.password);

            if (!isMatch) {
                return res.status(404).json({ errors: [{ msg: "Please check username and password" }] })
            }

            // Return payload
            const payload = {
                user: {
                    id: user.id,
                    name: user.name
                }
            };

            jwt.sign(
                payload,
                'mysecretkey',
                {},
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
                }
            )

        } catch (err) {
            console.error(err.message);
            return res.send(500).send("Server error")
        }

    }
)

module.exports = router;