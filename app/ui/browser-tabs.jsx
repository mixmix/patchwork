var BrowserTabsTab = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return (this.props.isActive != nextProps.isActive)
  },
  render: function () {
    return <span>{this.props.isActive ? '/ tab \\' : ' tab '}</span>
  }
})

var BrowserTabs = React.createClass({
  render: function () {
    var tabs = this
    return <div id="browser-tabs">
      {this.props.pages.map(function (page, i) {
        return <BrowserTabsTab key={'browser-tabs-tab-'+i} isActive={tabs.props.currentPageIndex == i} />
      })}
    </div>
  }  
})