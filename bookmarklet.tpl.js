function loadScript (url) {
  var d = document
  d.body.appendChild(d.createElement('script')).src = url
}
loadScript('https://rawgit.com/olizilla/hsbc-statement-to-csv/dist/hsbc-statement-to-csv.min.js')
