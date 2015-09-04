var bundleid = window.location.hash
if (bundleid.charAt(0) == '#') bundleid = bundleid.slice(1)
if (bundleid.charAt(0) == '/') bundleid = bundleid.slice(1)

var PublishApp = React.createClass({
  getInitialState: function () {
    return { bundle: null, error: null }
  },

  componentDidMount: function () {
    // fetch the bundle
    ssb.bundles.get(bundleid, (function (err, bundle) {
      if (err) this.setState({ error: err })
      else this.setState({ bundle: bundle })
    }).bind(this))
  },

  onSubmit: function (e) {
    e.preventDefault()

    var form = this.refs.form.getDOMNode()
    ssb.bundles.createWorking({
      name: form.name.value,
      desc: form.desc.value,
      dirpath: form.dirpath.files[0] && form.dirpath.files[0].path
    }, (function (err, bundle) {
      if (err) {
        console.error(err)
        this.setState({error: err})
      } else {
        window.location = './view.html#'+bundle.id
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
        <p>Description: <input name="desc" value={b.desc} /></p>
        <ul>
          <li>files todo</li>
          <li><strong>/index.html</strong> 6kb</li>
          <li><strong>/styles.css</strong> 503b</li>
          <li><strong>/js/index.js</strong> 3.2kb</li>
        </ul>
        <p><input type="button" value="Publish" onClick={this.onSubmit} /></p>
      {this.state.error ? <pre><strong>{this.state.error.stack}</strong></pre> : undefined}
      </form>
    </div>
  }
})

React.render(
  <PublishApp />,
  document.getElementById('content')
)