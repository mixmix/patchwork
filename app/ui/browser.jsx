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
  getInitialState: function () {
    return {
      pages: [{
        location: '',
        statusText: false,
        title: false,
        isLoading: false
      }],
      currentPageIndex: 0
    }
  },
  componentWillMount: function () {
    // bind the nav-handlers to this object
    for (var k in this.navHandlers)
      this.navHandlers[k] = this.navHandlers[k].bind(this)
  },
  componentDidMount: function () {
    // attach webview events
    for (var k in this.webviewHandlers)
      this.getWebView().addEventListener(k, this.webviewHandlers[k].bind(this))
  },
  getWebView: function () {
    return this.refs.page.refs.webview.getDOMNode()
  },
  navHandlers: {
    onClickHome: function () {
      this.getWebView().setAttribute('src', 'data:text/plain,home')
    },
    onClickBack: function () {
      this.getWebView().goBack()
    },
    onClickForward: function () {
      this.getWebView().goForward()
    },
    onClickRefresh: function () {
      this.getWebView().reload()
    },
    onClickSync: console.log.bind(console, 'sync'),
    onEnterLocation: function (location) {
      this.getWebView().setAttribute('src', location)
    },
    onChangeLocation: function (location) {
      var page = this.state.pages[this.state.currentPageIndex]
      page.location = location
      this.setState(this.state)      
    }
  },
  webviewHandlers: {
    'load-commit': console.log.bind(console, 'load-commit'),
    'did-start-loading': function (e) {
      console.log('did-start-loading', e, this.getWebView().getUrl())
      var page = this.state.pages[this.state.currentPageIndex]
      page.statusText = 'Loading...'
      page.isLoading = true
      page.title = false
      this.setState(this.state)
    },
    'did-stop-loading': function (e) {
      console.log('did-stop-loading', e, this.getWebView().getUrl())
      var page = this.state.pages[this.state.currentPageIndex]
      page.statusText = false
      page.location = this.getWebView().getUrl()
      if (!page.title)
        page.title = page.location
      page.isLoading = false
      this.setState(this.state)
    },
    'did-finish-load': console.log.bind(console, 'did-finish-load'),
    'did-fail-load': console.log.bind(console, 'did-fail-load'),
    'did-get-redirect-request': console.log.bind(console, 'did-get-redirect-request'),
    'dom-ready': console.log.bind(console, 'dom-ready'),
    'page-title-set': function (e) {
      console.log('page-title-set', e)
      var page = this.state.pages[this.state.currentPageIndex]
      page.title = e.title
      page.location = this.getWebView().getUrl()
      this.setState(this.state)
    },
    'close': console.log.bind(console, 'close'),
    'destroyed': console.log.bind(console, 'destroyed')
  },
  render: function() {
    return <div>
      <BrowserTabs ref="tabs" pages={this.state.pages} currentPageIndex={this.state.currentPageIndex} />
      <BrowserNavbar ref="navbar" {...this.navHandlers} page={this.state.pages[this.state.currentPageIndex]} />
      <BrowserPage ref="page" page={this.state.pages[this.state.currentPageIndex]} />
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