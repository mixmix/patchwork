var bundleid = window.location.hash
if (bundleid.charAt(0) == '#') bundleid = bundleid.slice(1)
if (bundleid.charAt(0) == '/') bundleid = bundleid.slice(1)

var WorkingBundleTools = React.createClass({
  render: function () {
    var b = this.props.bundle
    return <p className="action">
      <a href={'./versions.html#'+b.name}>other versions</a><br/>
      <BundleDirpath bundle={b} onChange={this.props.onChangeDirpath} />
      <strong><a href={'./publish.html#'+b.id}>publish</a></strong><br />
    </p>
  }
})

var PublishedBundleTools = React.createClass({
  notyet: function () {
    alert('not yet implemented')
  },

  render: function () {
    var b = this.props.bundle
    return <p className="action">
      <a href={'./versions.html#'+b.name}>other versions</a><br />
      <strong><a href={'/bundles/checkout.html#'+b.id}>checkout a working copy</a></strong>
    </p>
  }
})

var ViewApp = React.createClass({
  getInitialState: function () {
    return { bundle: null, selectedBlobKey: null, selectedBlob: null, error: null }
  },

  componentDidMount: function () {
    // do a lookup, in case we were given a name instead of a bundle id
    ssb.bundles.lookup(bundleid, (function (err, _bid) {
      if (_bid)
        bundleid = _bid

      // fetch the bundle
      ssb.bundles.get(bundleid, (function (err, bundle) {
        if (err) this.setState({ error: err })
        else {
          // :DEBUG: set some fake blobs if there are none
          if (!bundle.blobs)
            bundle.blobs = {'/index.html': 1, '/styles.css': 1, '/js/index.js': 1}

          this.setState({ bundle: bundle })
          if (bundle.blobs)
            this.onSelectBlob(Object.keys(bundle.blobs)[0])

          // is it the default branch?
          ssb.bundles.lookup(bundle.name, (function (err, _bid) {
            bundle.isDefault = (_bid && _bid == bundle.id)
            this.setState({ bundle: bundle })
          }).bind(this))
        }
      }).bind(this))
    }).bind(this))
  },

  onToggleHistory: function (e) {
    e.preventDefault()

    var bundle = this.state.bundle
    bundle.isShowingHistory = !bundle.isShowingHistory
    pull(
      ssb.bundles.listRevisions(bundle.id),
      pull.collect((function (err, bundles) {
        if (err) {
          console.error(err)
          this.setState({ error: err })
        } else {
          bundle.history = bundles
          this.setState(this.state)
        }
      }).bind(this))
    )
  },

  onSelectBlob: function (key, e) {
    e && e.preventDefault()

    this.setState({ selectedBlobKey: key, selectedBlob: 'loading '+key+'...' })
    pull(
      ssb.bundles.getBlob(this.state.bundle.id, key),
      pull.concat((function (err, blob) {
        if (err) {
          console.error(err)
          this.setState({ selectedBlob: err })
        } else {
          this.setState({ selectedBlob: blob })
        }
      }).bind(this))
    )
  },

  onMakeDefault: function (e) {
    e && e.preventDefault()

    ssb.bundles.setForkAsDefault(this.state.bundle.id, (function (err) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        this.state.bundle.isDefault = true
        this.setState(this.state)
      }
    }).bind(this))
  },

  onChangeDirpath: function (newdirpath) {
    ssb.bundles.updateWorking(this.state.bundle.id, { dirpath: newdirpath }, (function (err) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        this.state.bundle.dirpath = newdirpath
        this.setState(this.state)
      }
    }).bind(this))
  },

  render: function () {
    var selectedBlobKey = this.state.selectedBlobKey
    var b = this.state.bundle
    if (!b)
      return <span />

    return <div>
      {this.state.error ? <p><strong>{this.state.error}</strong></p> : undefined}
      <h1><a href={'/'+b.id}>/{b.name} {b.desc}</a> by <BundleAuthor bundle={b} /></h1>
      {b.dirpath ?
        <WorkingBundleTools bundle={b} onToggleHistory={this.onToggleHistory} onMakeDefault={this.onMakeDefault} onChangeDirpath={this.onChangeDirpath} /> :
        <PublishedBundleTools bundle={b} onToggleHistory={this.onToggleHistory} onMakeDefault={this.onMakeDefault} />
      }
      <BundleHistory show={b.isShowingHistory} bundle={b} />
      <div id="viewer-space">
        <div className="col">
          {b.blobs ?
            <ul id="files">
              {Object.keys(b.blobs).map((function (key) {
                if (key == selectedBlobKey)
                  return <li key={key}>{key}</li>
                return <li key={key}><a href="#" onClick={this.onSelectBlob.bind(this, key)}>{key}</a></li>
              }).bind(this))}
            </ul>
          : undefined}
        </div>
        <div id="viewer">
          <pre>{this.state.selectedBlob||''}</pre>
        </div>
      </div>
    </div>
  }
})

React.render(
  <ViewApp />,
  document.getElementById('content')
)