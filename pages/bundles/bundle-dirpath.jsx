var BundleDirpath = React.createClass({
  onClick: function (e) {
    e.preventDefault()

    // trigger open dialog
    // - React wasnt rendering the 'directory' attrs for some reason, so I just stuck the hidden input into the page html
    var folderInput = document.querySelector('#hidden-folder-input')
    folderInput.onchange = this.onFolderChange
    folderInput.click()
  },
  onFolderChange: function () {
    var folderInput = document.querySelector('#hidden-folder-input')
    this.props.onChange(folderInput.files[0].path)
  },
  render: function () {
    var b = this.props.bundle
    if (b.dirpath)
      return <span className="action"><a href="#" onClick={this.onClick}>change folder</a> {b.dirpath}<br /></span>
    return <span />
  }
})