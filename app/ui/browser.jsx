'use strict'
// var ui     = require('./lib/ui')
// var modals = require('./lib/ui/modals')

// Init
// ====

// master state object
// window.app = require('./lib/app') :TODO: needed?

// toplevel events
// window.addEventListener('contextmenu', ui.contextMenu) :TODO: in browser
// window.addEventListener('error', onError) :TODO: in browser
// document.body.addEventListener('mouseover', onHover) :TODO: in browser? in webview?

var Browser = React.createClass({
  componentWillMount: function () {
    // bind the nav-handlers to this object
    for (var k in this.navHandlers)
      this.navHandlers[k] = this.navHandlers[k].bind(this)
  },
  getInitialState: function () {
    return {
      pages: ['a', 'b', 'c'],
      currentPageIndex: 0
    }
  },
  navHandlers: {
    onClickHome: console.log.bind(console, 'home'),
    onClickBack: console.log.bind(console, 'back'),
    onClickForward: console.log.bind(console, 'forward'),
    onClickRefresh: console.log.bind(console, 'refresh'),
    onClickSync: console.log.bind(console, 'sync'),
    onEnterLocation: console.log.bind(console)
  },
  render: function() {
    return <div>
      <BrowserTabs ref="tabs" pages={this.state.pages} currentPageIndex={this.state.currentPageIndex} />
      <BrowserNavbar ref="navbar" {...this.navHandlers} />
      <BrowserPage ref="page" />
    </div>
  }
})

// render
React.render(
  <Browser />,
  document.getElementById('content')
);

// Handlers
// ========

function onError (e) {
  e.preventDefault()
  console.error(e.error)
  modals.error('Unexpected Error', e.error, 'This was an unhandled exception.')
}

function onHover (e) {
  var el = e.target
  while (el) {
    if (el.tagName == 'A') {
      if (el.getAttribute('title')) {
        ui.setStatus(el.getAttribute('title'))
      } else if (el.href) {
        var i = el.href.indexOf('#')
        if (i > 0)
          ui.setStatus(el.href.slice(i+1))
        else
          ui.setStatus(el.href)
      }
      return 
    }
    el = el.parentNode
  }
  ui.setStatus(false)
}