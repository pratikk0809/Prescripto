import jwt from 'jsonwebtoken'

// admin auth middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // Check if email matches admin email
        if (
            token_decode.email !== process.env.ADMIN_EMAIL ||
            token_decode.password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export default authAdmin