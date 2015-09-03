var ipc      = require('ipc')
var muxrpc   = require('muxrpc')
var pull     = require('pull-stream')
var pullipc  = require('pull-ipc')
var manifest = require('./rpc-manifest')

// create rpc object
window.ssb = muxrpc(manifest, {}, serialize)({})
function serialize (stream) { return stream }

// setup rpc stream over ipc
var rpcStream = ssb.createStream()
var ipcStream = pullipc.webview('muxrpc:ssb', ipc, function (err) {
  console.log('ipc-stream ended', err)
})
pull(ipcStream, rpcStream, ipcStream)