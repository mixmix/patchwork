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


var home = 'file:///Users/paulfrazee/patchwork/test3.html'
var n = 0
function createPageObject () {
  return {
    location: '',
    statusText: false,
    title: 'new tab',
    isLoading: false,
    isSearching: false
  }
}

var Browser = React.createClass({
  getInitialState: function () {
    return {
      pages: [createPageObject()],
      currentPageIndex: 0
    }
  },
  componentWillMount: function () {
    // bind handlers to this object
    for (var k in this.navHandlers)  this.navHandlers[k]  = this.navHandlers[k].bind(this)
    for (var k in this.pageHandlers) this.pageHandlers[k] = this.pageHandlers[k].bind(this)
  },
  componentDidMount: function () {
    // attach webview events
    for (var k in this.webviewHandlers)
      this.getWebView().addEventListener(k, this.webviewHandlers[k].bind(this))

    // attach keyboard shortcuts
    // :TODO: replace this with menu hotkeys
    var self = this
    document.body.addEventListener('keydown', function (e) {
      if (e.metaKey && e.keyCode == 70) { // cmd+f
        // start search
        self.getPageObject().isSearching = true
        self.setState(self.state)

        // make sure the search input has focus
        self.getPage().getDOMNode().querySelector('#browser-page-search input').focus()
      } else if (e.keyCode == 27) { // esc
        // stop search
        self.getPageObject().isSearching = false
        self.setState(self.state)
      }
    })
  },

  getWebView: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i].refs.webview.getDOMNode()
  },
  getPage: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i]
  },
  getPageObject: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.state.pages[i]
  },

  onNewTab: function () {
    this.state.pages.push(createPageObject())
    this.setState({ pages: this.state.pages, currentPageIndex: this.state.pages.length - 1 })
  },
  onTabClick: function (e, page, pageIndex) {
    this.setState({ currentPageIndex: pageIndex })
  },
  onTabClose: function (e, page, pageIndex) {
    // last tab, full reset
    if (this.state.pages.filter(Boolean).length == 1)
      return this.setState({ pages: [createPageObject()], currentPageIndex: 0 })

    this.state.pages[pageIndex] = null
    this.setState({ pages: this.state.pages })

    // find the nearest adjacent page to make active
    if (this.state.currentPageIndex == pageIndex) {
      for (var i = pageIndex; i >= 0; i--) {
        if (this.state.pages[i])
          return this.setState({ currentPageIndex: i })
      }
      for (var i = pageIndex; i < this.state.pages.length; i++) {
        if (this.state.pages[i])
          return this.setState({ currentPageIndex: i })
      }
    }
  },
  navHandlers: {
    onClickHome: function () {
      this.getWebView().setAttribute('src', home)
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
      var page = this.getPageObject()
      page.location = location
      this.setState(this.state)      
    }
  },
  pageHandlers: {
    onDidStartLoading: function (e) {
      var page = this.getPageObject()
      page.isLoading = true
      page.title = false
      this.setState(this.state)
    },
    onDidStopLoading: function (e) {
      var page = this.getPageObject()
      page.statusText = false
      page.location = this.getWebView().getUrl()
      if (!page.title)
        page.title = page.location
      page.isLoading = false
      this.setState(this.state)
    },
    onPageTitleSet: function (e) {
      var page = this.getPageObject()
      page.title = e.title
      page.location = this.getWebView().getUrl()
      this.setState(this.state)
    },
    onIpcMessage: function (e, page) {
      if (e.channel == 'status') {
        page.statusText = e.args[0]
        this.setState(this.state)
      }
    }
  },

  render: function() {
    var self = this
    return <div>
      <BrowserTabs ref="tabs" pages={this.state.pages} currentPageIndex={this.state.currentPageIndex} onNewTab={this.onNewTab} onTabClick={this.onTabClick} onTabClose={this.onTabClose} />
      <BrowserNavbar ref="navbar" {...this.navHandlers} page={this.state.pages[this.state.currentPageIndex]} />
      {this.state.pages.map(function (page, i) {
        if (!page)
          return
        return <BrowserPage ref={'page-'+i} key={'page-'+i} {...self.pageHandlers} page={page} isActive={i == self.state.currentPageIndex} />
      })}
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