const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.commentPostController = async (req, res, next) => {
    let {
        postId
    } = req.params
    let {
        body
    } = req.body

    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        let createdComment = await comment.save()
        await Post.findOneAnd({
            _id: postId
        }, {
            $push: {
                'comments': createdComment._id
            }
        })

        let commentJSON = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePics username'
        })

        return res.status(201).json(commentJSON)

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}

exports.replyCommentPostController = async (req, res, next) => {
    let { commentId } = req.params
    let { body } = req.body
    
    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }

    let reply = {
        body,
        user: req.user._id
    }

    try {
        await Comment.findOneAndUpdate(
            { _id: commentId },
            { $push: { 'replies': reply } }
        )

        res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics
        })


    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}