var BrowserTab = React.createClass({
  render: function () {
    var title = this.props.page.title || 'loading'
    var tshortened = title
    if (tshortened.length > 15)
      tshortened = tshortened.slice(0, 12) + '...'

    return <span className={this.props.isActive ? 'active' : ''} title={title}>
      {tshortened}
      {this.props.page.isLoading ? <i className="fa fa-spinner fa-pulse" /> : undefined}
    </span>
  }
})

var BrowserTabs = React.createClass({
  render: function () {
    var tabs = this
    return <div id="browser-tabs">
      {this.props.pages.map(function (page, i) {
        return <BrowserTab key={'browser-tab-'+i} isActive={tabs.props.currentPageIndex == i} page={page} />
      })}
    </div>
  }  
})