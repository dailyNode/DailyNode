var koa = require('koa')
var logger = require('koa-logger')
var serve = require('koa-static')
var session = require('koa-session')
var compress = require('koa-compress')
var responseTime = require('koa-response-time')
var ejsRender = require('koa-ejs')
var path = require('path')
var config = require('./configs/config.json')
// var auth = require('koa-basic-auth')
var koaBody = require('koa-better-body')

//
var app = koa()
app.use(responseTime())
app.use(serve(path.join(__dirname, '/public')))
app.use(logger())
app.keys = ['node-news-secret-pana']
app.use(session())
app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))
ejsRender(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    debug: true,
    cache: false,
    locals: {},
    filters: {
        formatDate: function (item) {
            var b0 = require('./util/helper').b0
            if (item) {
                var d = new Date(item)
                var date = d.getFullYear() + '-' + b0((d.getMonth() + 1)) + '-' + b0(d.getDate())
                var time = b0(d.getHours()) + ':' + b0(d.getMinutes()) + ':' + b0(d.getSeconds())
                return date + ' ' + time
            } else {
                return 'N/A'
            }
        },
        hn: function (item) {
            return item ? item : 'N/A'
        }
    }
})
// app.use(auth({name: 'pana', pass: 'wang'}))
app.use(koaBody({
    multipart: true,
    formidable: {
      uploadDir: __dirname + '/uploads'
    }
}))

// load routes
require('./models/db')  // connect to db
require('./routes')(app)
// require('./scripts/spider').crawl()  // set crawl tasks begin

app.listen(config.port)
console.log('App listen on port ' + config.port)