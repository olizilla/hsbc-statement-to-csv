function loadScript (url) {
  var d = document
  var s = d.createElement('script')
  s.onload(function () {
    require('hsbc-statement-to-csv')()
  })
  d.body.appendChild(s).src = url
}
loadScript('https://rawgit.com/olizilla/hsbc-statement-to-csv/master/dist/hsbc-statement-to-csv.min.js')
