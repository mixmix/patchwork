var bundleid = window.location.hash
if (bundleid.charAt(0) == '#') bundleid = bundleid.slice(1)
if (bundleid.charAt(0) == '/') bundleid = bundleid.slice(1)

var CheckoutApp = React.createClass({
  getInitialState: function () {
    return { bundle: null, error: null }
  },

  componentDidMount: function () {
    // fetch the bundle
    ssb.bundles.get(bundleid, (function (err, bundle) {
      if (err) {
        console.error(err)
        this.setState({ error: err })
      } else {
        this.setState({ bundle: bundle })
        var form = this.refs.form.getDOMNode()
        form.querySelector('[type=file]').setAttribute('webkitdirectory', true)
        form.querySelector('[type=file]').setAttribute('directory', true)
      }
    }).bind(this))
  },

  onSubmit: function (e) {
    e.preventDefault()

    var b = this.state.bundle
    var form = this.refs.form.getDOMNode()
    var dirpath = form.dirpath.files[0] && form.dirpath.files[0].path
    console.log('checking out')
    ssb.bundles.checkout(b.id, dirpath, (function (err) {
      if (err) {
        console.error(err)
        this.setState({error: err})
      } else {
        console.log('creating working')
        ssb.bundles.createWorking({
          name: b.name,
          desc: b.desc,
          dirpath: dirpath,
          root: b.root || b.id,
          branch: b.id
        }, (function (err, newb) {
          if (err) {
            console.error(err)
            this.setState({error: err})
          } else {
            console.log('success')
            window.location = './view.html#'+newb.id
          }
        }).bind(this))
      }
    }).bind(this))
  },

  render: function () {
    var b = this.state.bundle
    if (!b)
      return <span />

    return <div>
      <h1>checking out <a href={'/'+b.id}>/{b.name} {b.desc}</a> <small>by <BundleAuthor bundle={b} /></small></h1>
      <p className="action"><a href={'/bundles/view.html#'+b.id}>&laquo; back to files</a></p>
      <p>This will checkout the files in <a href={'/'+b.id}>/{b.name} {b.desc}</a> into your chosen folder.</p>
      <form ref="form">
        <p>Folder: <input type="file" name="dirpath" webkitdirectory directory /></p>
        <p><input type="button" value="Checkout Working Copy" onClick={this.onSubmit} /></p>
      </form>
      {this.state.error ? <pre><strong>{this.state.error.stack}</strong></pre> : undefined}
    </div>
  }
})

React.render(
  <CheckoutApp />,
  document.getElementById('content')
)