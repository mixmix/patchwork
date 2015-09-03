var BundleHistory = React.createClass({
  render: function () {
    var h = this.props.bundle.history || []
    if (!this.props.show)
      return <span/>
    return <ul>
      {h.length ?
        h.map(function (h, i){
          return <li key={'history-'+i}><BundleAuthor bundle={h} /> - <a href={'/'+h.id}>{(new Date(h.timestamp)).toLocaleDateString()}</a> {h.changedesc}</li>
        })
      : <li>No past revisions</li>}
    </ul>
  }
})
