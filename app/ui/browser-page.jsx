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
  shouldComponentUpdate: function () {
    return false
  },
  render: function () {
    return <div id="browser-page">
      <BrowserPageSearch isActive={false} />
      <webview src="data:text/plain,webview" />
      <BrowserPageStatus status="status line goes here" />
    </div>
  }  
})