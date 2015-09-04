var bundleid = window.location.hash
if (bundleid.charAt(0) == '#') bundleid = bundleid.slice(1)
if (bundleid.charAt(0) == '/') bundleid = bundleid.slice(1)

var dataSizes = ['kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
function bytesHuman (nBytes) {
  var str = nBytes + 'b'
  for (var i = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, i++) {
    str = nApprox.toFixed(2) + dataSizes[i]
  }
  return str
}

var PublishApp = React.createClass({
  getInitialState: function () {
    return { bundle: null, files: [], error: null }
  },

  componentDidMount: function () {
    // fetch the bundle
    ssb.bundles.get(bundleid, (function (err, bundle) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        this.setState({ bundle: bundle, desc: bundle.desc })

        // get the files
        pull(ssb.bundles.listWorkingFiles(bundle.id), pull.collect((function (err, files) {
          if (err) {
            console.error(err)
            this.setState({ error: err })
          } else {
            this.setState({ files: files })
          }
        }).bind(this)))
      }
    }).bind(this))
  },

  onChangeDesc: function (e) {
    var b = this.state.bundle
    b.desc = e.target.value
    this.setState({ bundle: b })
  },

  onSubmit: function (e) {
    e.preventDefault()

    var b = this.state.bundle
    var files = this.state.files.map(function (f) { return f.fullPath })
    ssb.bundles.publishWorking(b.id, { name: b.name, desc: b.desc }, files, (function (err, msg) {
      if (err) {
        console.error(err)
        this.setState({error: err})
      } else {
        window.location = './view.html#'+msg.key
      }
    }).bind(this))
  },

  render: function () {
    var b = this.state.bundle
    if (!b)
      return <span />

    return <div>
      <h1>publish <a href="#">/{b.name} {b.desc}</a></h1>
      <p className="action"><a href={'/bundles/view.html#'+b.id}>&laquo; back to the working copys files</a></p>
      <form>
        <p>Page: <strong>{b.name}</strong></p>
        <p>Description: <input name="desc" value={b.desc} onChange={this.onChangeDesc} /></p>
        <ul>
          {this.state.files.map(function (f) {
            return <li key={f.path}><strong>{f.path}</strong> {bytesHuman(f.stat.size)}</li>
          })}
        </ul>
        <p><input type="button" value="Publish" onClick={this.onSubmit} /></p>
      </form>
      {this.state.error ? <pre><strong>{this.state.error.stack}</strong></pre> : undefined}
    </div>
  }
})

React.render(
  <PublishApp />,
  document.getElementById('content')
)