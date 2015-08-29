var BrowserPageSearch = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return (this.props.isActive != nextProps.isActive)
  },
  render: function () {
    return <div id="browser-page-search" className={this.props.isActive ? 'visible' : 'hidden'}>
      <input type="text" placeholder="Search..." />
    </div>
  }
})

var BrowserPageStatus = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return (this.props.status != nextProps.status)
  },
  render: function () {
    return <div id="browser-page-status" className={this.props.status ? 'visible' : 'hidden'}>{this.props.status}</div>
  }
})

var BrowserPage = React.createClass({
  componentDidMount: function () {
    // setup resize events
    window.addEventListener('resize', resize)
    resize()

    // attach webview events
    for (var k in webviewEvents)
      this.refs.webview.getDOMNode().addEventListener(k, webviewHandler(this, webviewEvents[k]))
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', resize)    
  },
  render: function () {
    return <div id="browser-page" className={this.props.isActive ? 'visible' : 'hidden'}>
      <BrowserPageSearch isActive={false} />
      <webview ref="webview" />
      <BrowserPageStatus status={this.props.page.statusText} />
    </div>
  }  
})

function webviewHandler (self, fnName) {
  return function (e) {
    console.log(fnName, e)
    if (self.props[fnName])
      self.props[fnName](e, self.props.page)
  }
}

var webviewEvents = {
  'load-commit': 'onLoadCommit',
  'did-start-loading': 'onDidStartLoading',
  'did-stop-loading': 'onDidStopLoading',
  'did-finish-load': 'onDidFinishLoading',
  'did-fail-load': 'onDidFailLoad',
  'did-get-redirect-request': 'onDidGetRedirectRequest',
  'dom-ready': 'onDomReady',
  'page-title-set': 'onPageTitleSet',
  'close': 'onClose',
  'destroyed': 'onDestroyed'
}

function resize () {
  var webview = document.querySelector('webview')
  var obj = webview && webview.querySelector('::shadow object')
  if (obj)
    obj.style.height = (window.innerHeight - 61) + 'px' // -61 to adjust for the tabs and navbar regions
}