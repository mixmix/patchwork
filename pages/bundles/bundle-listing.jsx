var DefaultBtn = React.createClass({
  render: function () {
    if (this.props.bundle.isDefault)
      return <span />
    return <span>- <a onClick={this.props.onClick}>make default</a></span>
  }
})

var BundleListing = React.createClass({
  onToggleHistory: function (e) {
    if (this.props.onToggleHistory)
      this.props.onToggleHistory(this.props.bundle)
  },

  onMakeDefault: function (e) {
    if (this.props.onMakeDefault)
      this.props.onMakeDefault(this.props.bundle)
  },

  render: function () {
    var b = this.props.bundle
    var h = b.history || []
    if (this.props.isTop) {
      return <div className="bundle">
        <h2>{b.desc || 'untitled'}</h2>
        <p className="action">
          by <BundleAuthor bundle={b} /><br />
          <a onClick={this.onToggleHistory}>{b.isShowingHistory?'hide':'show'} history</a>
        </p>
        <BundleHistory show={b.isShowingHistory} bundle={b} onToggleHistory={this.props.onToggleHistory} onMakeDefault={this.props.onMakeDefault} />
      </div>      
    }
    return <div className={'bundle '+(b.isDefault?'default':'')}>
      {b.isDefault ? <strong><small>default</small><br /></strong> : undefined}
      <h2><a href={'/'+b.id}>{b.blobs ? (b.desc || 'untitled') : 'working copy'}</a> <small><a className="action" href={'/bundles/view.html#'+b.id}>view files</a></small></h2>
      {b.blobs ?
        <p className="action">
          by <BundleAuthor bundle={b} /> <DefaultBtn bundle={b} onClick={this.onMakeDefault} /><br />
          <small>{(new Date(b.timestamp).toLocaleString())}</small>
        </p> :
        <p className="action">
          {b.dirpath} <DefaultBtn bundle={b} onClick={this.onMakeDefault} />
        </p>}
    </div>
  }
})