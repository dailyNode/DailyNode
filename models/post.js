var mongoose = require('mongoose')

var PostSchema = mongoose.Schema({
    title: {type: String, unique: true},   // TODO post tile is unique, this may be a problem
    description: String,
    summary: String,
    date: Date,
    pubDate: Date,
    link: String,
    author: String,
    hidden: {type: Boolean, default: false}
})

// comments, favs, hidden

PostSchema.statics.findOneC = function (query) {
    var that = this
    return function (cb) {
        that.findOne(query, cb)
    }
}

PostSchema.statics.findC = function () {
    var that = this, args = Array.prototype.slice.call(arguments)
    return function (cb) {
        args.push(cb)
        that.find.apply(that, args)
    }
}

PostSchema.statics.countC = function () {
    var that = this, args = Array.prototype.slice.call(arguments)
    return function (cb) {
        args.push(cb)
        that.count.apply(that, args)
    }
}


var Post = mongoose.model('Post', PostSchema)

module.exports = Post