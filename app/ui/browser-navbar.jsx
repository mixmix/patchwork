var BrowserNavbarBtn = React.createClass({
  shouldComponentUpdate: function () {
    return false
  },
  render: function() {
    return <a href="#" title="{this.props.title}" onClick={this.props.onClick}>{this.props.title}</a>
  }
})

var BrowserNavbarLocation = React.createClass({
  shouldComponentUpdate: function () {
    return false
  },
  onKeyDown: function (e) {
    if (e.keyCode == 13)
      this.props.onEnterLocation(e.target.value)
  },
  render: function() {
    return <input type="text" onKeyDown={this.onKeyDown} />
  }
})

var BrowserNavbar = React.createClass({
  shouldComponentUpdate: function () {
    return false
  },
  render: function() {
    return <div id="browser-navbar">
      <BrowserNavbarBtn title="Home" onClick={this.props.onClickHome} />
      <BrowserNavbarBtn title="Back" onClick={this.props.onClickBack} />
      <BrowserNavbarBtn title="Forward" onClick={this.props.onClickForward} />
      <BrowserNavbarBtn title="Refresh" onClick={this.props.onClickRefresh} />
      <BrowserNavbarLocation onEnterLocation={this.props.onEnterLocation} />
      <BrowserNavbarBtn title="Network Sync" onClick={this.props.onClickSync} />
    </div>
  }
})