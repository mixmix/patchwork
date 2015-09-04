var pagename = window.location.hash
if (pagename.charAt(0) == '#') pagename = pagename.slice(1)
if (pagename.charAt(0) != '/') pagename = '/' + pagename

var NewApp = React.createClass({
  getInitialState: function () {
    return { error: null }
  },

  componentDidMount: function () {
    var form = this.refs.form.getDOMNode()
    form.querySelector('[type=file]').setAttribute('webkitdirectory', true)
    form.querySelector('[type=file]').setAttribute('directory', true)
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
    return <div>
      <h1>new {pagename} working copy</h1>
      <p className="action"><a href={'/bundles/versions.html#'+pagename}>&laquo; existing versions of {pagename}</a></p>
      <form ref="form">
        <p>Page: <input name="name" value={pagename} /></p>
        <p>Description: <input name="desc" /></p>
        <p>Folder: <input name="dirpath" type="file" webkitdirectory directory /></p>
        <p><input type="button" value="Create Working Copy" onClick={this.onSubmit} /></p>
        {this.state.error ? <pre><strong>{this.state.error.stack}</strong></pre> : undefined}
      </form>
    </div>
  }
})

React.render(
  <NewApp />,
  document.getElementById('content')
)