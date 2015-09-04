function getPagenameFromHash () {
  var pagename = window.location.hash
  if (pagename.charAt(0) == '#') pagename = pagename.slice(1)
  var parts = pagename.split('/')
  pagename = parts[0] || parts[1]
  return (pagename ? '/'+pagename : false)
}

function getBundleidFromHash () {
  var bundleid = window.location.hash
  if (bundleid.charAt(0) == '#') bundleid = bundleid.slice(1)
  if (bundleid.charAt(0) == '/') bundleid = bundleid.slice(1)
  return bundleid
}