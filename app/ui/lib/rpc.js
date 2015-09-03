var ipc        = require('ipc')
var muxrpc     = require('muxrpc')
var pull       = require('pull-stream')
var pullipc    = require('pull-ipc')

var parentManifest
var parentSSB
var webviewManifest = require('../preload/rpc-manifest')

module.exports.setupParentSSB = function () {
  // fetch manifest
  parentManifest = ipc.sendSync('fetch-manifest')
  console.log('got manifest', parentManifest)

  // create rpc object
  parentSSB = muxrpc(parentManifest, {}, serialize)({})
  function serialize (stream) { return stream }

  // setup rpc stream over ipc
  var rpcStream = parentSSB.createStream()
  var ipcStream = pullipc('muxrpc:ssb', ipc, function (err) {
    console.log('ipc-stream ended', err)
  })
  pull(ipcStream, rpcStream, ipcStream)
}

module.exports.getParentSSB = function () {
  return parentSSB
}

module.exports.setupWebviewSSB = function (webview) {
  // create rpc object
  // :NOTE: no permissions are being applied - this is piped straight into the parent SSB
  var rpc = webview.rpc = muxrpc({}, webviewManifest, serialize)(parentSSB)
  function serialize (stream) { return stream }

  // start the stream
  var ipcStream = pullipc.webview('muxrpc:ssb', ipc, webview, function (err) {
    console.log('ipc-stream ended', err)
  })
  pull(ipcStream, webview.rpcStream = rpc.createStream(), ipcStream)
}

module.exports.destroyWebviewSSB = function (webview) {
  if (webview.rpcStream)
    webview.rpcStream.source('close')
  if (webview.rpc)
    webview.rpc.close()
}