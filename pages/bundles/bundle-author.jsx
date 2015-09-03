var BundleAuthor = React.createClass({
  render: function () {
    var b = this.props.bundle
    if (b.author)
      return <a href={'/users/view.html#'+b.author}>{b.author}</a>
    return <span>you</span>
  }
})