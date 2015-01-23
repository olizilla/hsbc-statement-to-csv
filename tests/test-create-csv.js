var fs = require('fs')
var test = require('tape')
var cheerio = require('cheerio')
var proxyquire = require('proxyquire')

test('makeCsv', function(test){
  test.plan(1)
  var us = require('../create-csv')
  var csv = us.makeCsv([
    [{day: 1, month: 12, year: 2001}, 100, 'WOO HAA'],
    [{day: 5, month: 12, year: 2001}, -100, 'BAD TIMES']
  ])
  test.ok(csv)
})

test('parseHtml', function (test) {
  var html = fs.readFileSync(__dirname + '/statement.html')
  var us = proxyquire('../create-csv.js', {'jquery': cheerio.load(html)})
  var data = us.parseHtml()

  console.log(data)
  test.ok(data && data.length)
  test.equal(data[0][2], 'H3G')
  test.end()
})
