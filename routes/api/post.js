const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");

// POST api/posts
// Make a new post
// Private route

router.post(
    "/",
    [
        auth,
        check("title", "Please enter a title")
            .notEmpty(),
        check("content", "Please enter some text in the body")
            .notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");

            const newPost = new Post({
                user: req.user.id,
                name: req.user.name,
                title: req.body.title,
                content: req.body.content
            });

            const post = await newPost.save();

            user.postsMade.unshift({ post: post.id })

            await user.save();

            res.json(post)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error");
        }
    }
)

// GET api/posts
// Get all posts
// Private route

router.get(
    "/",
    auth,
    async (req, res) => {
        try {
            let allPosts = await Post.find().sort({ date: -1 }).populate('user');

            res.json(allPosts)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// GET api/posts/:id
// Get single post
// Private route

router.get(
    "/:postid",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findById(req.params.postid);

            if (!post) {
                return res.status(404).json({ msg: "Post not found" });
            }

            res.json(post)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// DELETE api/posts/:id
// Delete a post
// Private route

router.delete(
    "/:postid",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findById(req.params.postid);
            let user = await User.findById(req.user.id)

            if (!post) {
                return res.status(404).json({ msg: "Post not found" });
            }

            if (post.user.toString() !== req.user.id) {
                return res.status(500).json({ msg: "Unauthorized" })
            }

            let removeIndex = user.postsMade.find(({ post }) => post === req.params.postid)

            user.postsMade.splice(removeIndex, 1)

            await user.save()

            await post.remove();

            res.json({ msg: "Post has been removed" })
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// PUT api/posts/:id
// Edit a post
// Private route

router.put(
    "/:postid",
    [
        auth,
        check("title", "Please enter a title")
            .notEmpty(),
        check("content", "Please enter some text in the body")
            .notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let post = await Post.findById(req.params.postid);

            if (!post) {
                return res.status(404).json({ msg: "Post not found" });
            }

            if (post.user.toString() !== req.user.id) {
                return res.status(500).json({ msg: "Unauthorized" })
            }

            let newPost = await Post.findByIdAndUpdate(req.params.postid,
                { title: req.body.title, content: req.body.content }, { new: true });

            res.json(newPost)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// PUT api/posts/:id/like
// Like a post
// Private route

router.put(
    "/:postid/like",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findById(req.params.postid);

            if (post.likes.filter(
                like => like.user.toString() === req.user.id).length > 0
            ) {
                return res.status(400).json({ msg: "Post is already liked" })
            }

            post.likes.unshift({ user: req.user.id })

            await post.save();

            res.json(post.likes);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// PUT api/posts/:id/unlike
// Unlike a post
// Private route

router.put(
    "/:postid/unlike",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findById(req.params.postid);

            if (post.likes.filter(
                like => like.user.toString() === req.user.id).length === 0
            ) {
                return res.status(400).json({ msg: "Post hasn't been liked" })
            }

            const index = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

            post.likes.splice(index, 1);

            await post.save();

            res.json(post.likes);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// POST api/posts/:postid/comment
// Add a comment to a post
// Private route

router.post(
    "/:postid/comment",
    [
        auth,
        check("comment", "Please enter text to comment")
            .notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            let post = await Post.findById(req.params.postid);

            if (!post) {
                return res.status(404).json({ msg: "Post not found" })
            }

            const newComment = {
                user: req.user.id,
                name: req.user.name,
                text: req.body.comment
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)

// DELETE api/posts/:postid/comment/:commentid
// Delete a comment from a post
// Private route

router.delete(
    "/:postid/comment/:commentid",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findById(req.params.postid);

            if (!post) {
                return res.status(404).json({ msg: "Post not found" })
            }

            const comment = post.comments.find(
                comment => comment.id === req.params.commentid
            )

            if (!comment) {
                return res.status(404).json({ msg: "Comment not found" })
            }

            if (comment.user.toString() !== req.user.id) {
                return res.status(500).json({ msg: "Unauthorized" })
            }

            const index = post.comments
                .map(cmt => cmt.id.toString())
                .indexOf(req.params.commentid)


            post.comments.splice(index, 1);

            await post.save();

            res.json(post.comments)
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server error")
        }
    }
)


// PUT /api/posts/:postid/comment/:commentid
// Edit a comment 
// private route

router.put(
    "/:postid/comment/:commentid",
    [
        auth,
        check("comment", "Make sure the comment field is not empty")
            .notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { comment } = req.body
        try {
            let post = await Post.findById(req.params.postid)

            if (!post) {
                return res.status(404).json({ msg: "Post not found" })
            }

            let prevComment = post.comments.find(
                comment => comment.id === req.params.commentid)

            if (!prevComment) {
                return res.status(404).json({ msg: "Comment not found" })
            }

            if (!prevComment.user.equals(req.user.id)) {
                return res.status(500).json({ msg: "Unauthorized" })
            }

            prevComment.text = comment;

            post.comments = post.comments.map(
                comment => comment.id === req.params.commentid ? prevComment : comment
            )

            await post.save()

            res.json(post.comments)
        } catch (err) {
            console.error(err.message)
            return res.status(500).send("Server Error")
        }
    }
)
module.exports = router;