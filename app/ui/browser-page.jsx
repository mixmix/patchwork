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
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', resize)    
  },
  render: function () {
    return <div id="browser-page">
      <BrowserPageSearch isActive={false} />
      <webview ref="webview" src="data:text/plain,webview" />
      <BrowserPageStatus status={this.props.page.statusText} />
    </div>
  }  
})

function resize () {
  var webview = document.querySelector('webview')
  var obj = webview && webview.querySelector('::shadow object')
  if (obj)
    obj.style.height = (window.innerHeight - 61) + 'px' // -61 to adjust for the tabs and navbar regions
}