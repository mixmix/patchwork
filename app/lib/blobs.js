var path        = require('path')
var multicb     = require('multicb')
var toPath      = require('multiblob/util').toPath
var createHash  = require('multiblob/util').createHash
var pull        = require('pull-stream')
var toPull      = require('stream-to-pull-stream')
var querystring = require('querystring')
var fs          = require('fs')
var URL         = require('url')

module.exports = function (sbot, config) {
  var fallback_img_path = path.join(__dirname, '../../node_modules/ssb-patchwork-ui/img/default-prof-pic.png')
  var fallback_video_path = path.join(__dirname, '../../node_modules/ssb-patchwork-ui/img/spinner.webm')
  var nowaitOpts = { nowait: true }, id = function(){}

  return {
    server: function (opts) {
      opts = opts || {}
      return function (req, res) {
        // local-host only
        if (req.socket.remoteAddress != '127.0.0.1' &&
            req.socket.remoteAddress != '::ffff:127.0.0.1' &&
            req.socket.remoteAddress != '::1') {
          sbot.emit('log:info', ['patchwork', null, 'Remote access attempted by', req.socket.remoteAddress])
          respond(403)
          return res.end('Remote access forbidden')
        }

        // restrict the CSP
        res.setHeader('Content-Security-Policy', 
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; "+
          "connect-src 'self'; "+
          "object-src 'none'; "+
          "frame-src 'none'; "+
          "sandbox allow-same-origin allow-scripts"
        )

        // blobs
        var parsed = URL.parse(req.url, true)
        if (req.url.charAt(1) == '&')
          serveblob(parsed.pathname.slice(1), parsed.query.fallback)
        else {
          sbot.bundles.getBlobMeta(req.url, function (err, meta) {
            if (meta && meta.link) {
              // serve from blobstore
              if (meta.type)
                res.setHeader('Content-Type', meta.type)
              serveblob(meta.link, null, meta.isAutoIndex)
            } else if (meta && meta.path) {
              // serve from disk
              if (meta.type) res.setHeader('Content-Type', meta.type)
              if (meta.isAutoIndex) writeBaseTag()
              fs.createReadStream(meta.path).pipe(res)
            } else {
              respond(404)
              res.end('File not found')              
            }
          })
        }
        function respond (code) {
          res.writeHead(code)
          sbot.emit('log:info', ['patchwork', null, code + ' ' + req.method + ' ' + req.url])
        }
        function writeBaseTag () {
          // injects the base tag to ensure relative references work correctly on the automatic index pages
          res.write('<base href="'+req.url+'/">')
        }
        function serveblob (hash, fallback, isAutoIndex) {
          sbot.blobs.has(hash, function(err, has) {
            if (!has) {
              sbot.blobs.want(hash, nowaitOpts, id)
              if (fallback) {
                var p = (fallback == 'video') ? fallback_video_path : fallback_img_path
                return fs.createReadStream(p)
                  .on('error', function () {
                    respond(404)
                    res.end('File not found')
                  })
                  .pipe(res)
              }
              respond(404)
              res.end('File not found')
              return
            }
            respond(200)
            if (isAutoIndex) writeBaseTag()
            pull(
              sbot.blobs.get(hash),
              toPull(res)
            )
          })
        }
      }
    }
  }
}