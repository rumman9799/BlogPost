const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req, res, next) => {
    let { postId } = req.params
    
    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }

    let userId = req.user._id
    let bookmark = null

    try {
        let profile = await Profile.findOne({ user: userId })
        
        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAnd(
                { user: userId },
                { $pull: { 'bookmarks': postId } }
            )
            bookmark = false
        } else {
            await Profile.findOneAnd(
                { user: userId },
                { $push: { 'bookmarks': postId } }
            )
            bookmark = true
        }

        res.status(200).json({
            bookmark
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}