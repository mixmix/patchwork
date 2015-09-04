var pagename = window.location.hash
if (pagename.charAt(0) == '#') pagename = pagename.slice(1)
if (pagename.charAt(0) != '/') pagename = '/' + pagename

var DefaultBtn = React.createClass({
  render: function () {
    if (this.props.bundle.isDefault)
      return <span>default</span>
    return <a onClick={this.props.onClick}>make default</a>
  }
})

var Bundle = React.createClass({
  notyet: function () {
    alert('not yet implemented')
  },
  render: function () {
    var b = this.props.bundle
    var h = b.history || []
    return <div className="bundle">
      <h2><a href={'/'+b.id}>{b.desc || 'untitled'}</a> <small><a className="action" href={'/bundles/view.html#'+b.id}>view files</a></small></h2>
      {b.blobs ?
        <p className="action">
          by <BundleAuthor bundle={b} />
          {' '}<a onClick={this.props.onToggleHistory}>{b.isShowingHistory?'hide':'show'} history</a> 
          {' '}| <a href={'/bundles/checkout.html#'+b.id}>checkout a working copy</a> 
          {' '}| <DefaultBtn bundle={b} onClick={this.props.onMakeDefault} />
        </p> :
        <p className="action">
          working copy -
          {' '}<DefaultBtn bundle={b} onClick={this.props.onMakeDefault} />
        </p>}
      <BundleHistory show={b.isShowingHistory} bundle={b} />
    </div>
  }
})

var VersionsApp = React.createClass({
  getInitialState: function () {
    return { bundles: [], error: null }
  },

  getRevs: function (id, cb) {
    pull(
      ssb.bundles.listRevisions(id),
      pull.collect(cb.bind(this))
    )
  },

  componentDidMount: function () {
    ssb.bundles.lookup(pagename, (function (err, defaultBundleId) {
      this.getRevs(pagename, function (err, bundles) {
        if (err) {
          console.error(err)
          this.setState({ error: err })
        } else {
          bundles.forEach(function (b) {
            b.isDefault = (b.id == defaultBundleId)
          })
          this.setState({ bundles: bundles })
        }
      })
    }).bind(this))
  },

  onToggleHistory: function (bundle) {
    bundle.isShowingHistory = !bundle.isShowingHistory
    this.getRevs(bundle.id, function (err, bundles) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        bundle.history = bundles
        this.setState(this.state)
      }
    })
  },

  onMakeDefault: function (bundle) {
    ssb.bundles.setForkAsDefault(bundle.id, (function (err) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        this.state.bundles.forEach(function (b) {
          b.isDefault = (b.id == bundle.id)
        })
        this.setState(this.state)
      }
    }).bind(this))
  },


  render: function () {
    var self = this
    return <div>
      <h1>versions of <a href={pagename}>{pagename}</a></h1>
      <p><a className="action" href={'/bundles/new.html#'+pagename}>new working copy</a></p>
      {this.state.error ? <pre>{this.state.error.stack}</pre> : undefined}
      {!this.state.error && this.state.bundles.length === 0 ? <p>Nothing has been published yet. Guess you need to make a fork!</p> : undefined}
      {this.state.bundles.map(function (bundle, i) {
        function cb(fn) {
          return self[fn].bind(self, bundle)
        }
        return <Bundle key={'bundle-'+i} bundle={bundle} onToggleHistory={cb('onToggleHistory')} onMakeDefault={cb('onMakeDefault')} />
      })}
    </div>
  }
})

React.render(
  <VersionsApp />,
  document.getElementById('content')
)