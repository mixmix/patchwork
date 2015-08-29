var BrowserTab = React.createClass({
  render: function () {
    var title = this.props.page.title || 'loading'
    var tshortened = title
    if (tshortened.length > 20)
      tshortened = tshortened.slice(0, 17) + '...'

    return <div className={this.props.isActive ? 'active' : ''} title={title} onClick={this.props.onClick}>
      <a onClick={this.props.onClose}><i className="fa fa-close" /></a>
      <span>
        {tshortened}
        {this.props.page.isLoading ? <i className="fa fa-spinner fa-pulse" /> : undefined}
      </span>
    </div>
  }
})

var BrowserTabs = React.createClass({
  render: function () {
    var self = this
    return <div id="browser-tabs">
      {this.props.pages.map(function (page, i) {
        var onClick, onClose
        if (self.props.onTabClick)
          onClick = function (e) { self.props.onTabClick(e, page, i) }
        if (self.props.onTabClose)
          onClose = function (e) { e.preventDefault(); e.stopPropagation(); self.props.onTabClose(e, page, i) }
        return <BrowserTab key={'browser-tab-'+i} isActive={self.props.currentPageIndex == i} page={page} onClick={onClick} onClose={onClose} />
      })}
      <a onClick={this.props.onNewTab}><i className="fa fa-plus" /></a>
    </div>
  }  
})