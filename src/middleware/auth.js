const jwt = require("jsonwebtoken")
const blogModel = require('../models/blogModel')
const mongoose = require('mongoose')
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(400).send({ status: false, data: "Token must be present in the request header" })

        jwt.verify(token, "Group66-Project-Blog", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, data: "Token is Invalid" })
            }
            else {
                res.setHeader("x-api-key", token)
                req.decodedToken = decodedToken
                next()
            }
        })
    }
    catch (err) {
        return res.status(500).send({ data: "Error", error: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        let decoded = req.decodedToken
        let paramsBlogId = req.params.blogId
        if (!isValidObjectId(paramsBlogId)) return res.status(400).send({ status: false, data: "please enter valid blogId" })
        let userLoggedIn = decoded.authorId
        let blog = await blogModel.findById(paramsBlogId)
        if (!blog) {
            return res.status(404).send({ status: false, data: "Blog not Found" })
        }
        const blogAuthorId = (blog.authorId).toString()
        if (blogAuthorId !== userLoggedIn) {
            return res.status(403).send({ status: false, data: "You are not authorised Person" })
        }
        next()
    }
    catch (err) {
        res.status(500).send({ data: "Error", error: err.message })
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization
