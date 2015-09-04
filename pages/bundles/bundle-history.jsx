var BundleHistory = React.createClass({
  render: function () {
    var h = this.props.bundle.history || []
    if (!this.props.show)
      return <span/>

    var self = this
    return <div className="history">
      {h.length ?
        h.map(function (b, i) {
          return <BundleListing key={'bundle-'+i} bundle={b} onToggleHistory={self.props.onToggleHistory} onMakeDefault={self.props.onMakeDefault} onRemoveWorking={self.props.onRemoveWorking} />
        })
      : <li>No past revisions</li>}
    </div>
  }
})
