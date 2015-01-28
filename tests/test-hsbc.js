var fs = require('fs')
var test = require('tape')
var cheerio = require('cheerio')
var multiline = require('multiline')
var proxyquire = require('proxyquire')

test('makeCsv', function (test) {
  test.plan(2)
  var hsbc = require('../hsbc-statement-to-csv.js')
  var csv = hsbc.makeCsv([
    [{day: 1, month: 12, year: 2001}, 100, 'WOO HAA'],
    [{day: 15, month: 12, year: 2001}, -100, 'BAD TIMES']
  ])
  var expected = multiline.stripIndent(function () {/*
    1/12/2001,100,WOO HAA
    15/12/2001,-100,BAD TIMES
  */})
  test.ok(csv)
  test.equals(csv, expected)
})

test('scrapeHtml', function (test) {
  test.plan(3)
  var html = fs.readFileSync(__dirname + '/statement.html')
  var hsbc = proxyquire('../hsbc-statement-to-csv.js', {jquery: cheerio.load(html)})
  var data = hsbc.scrapeHtml()
  // fs.writeFileSync(__dirname + '/statement.json', JSON.stringify(data))
  test.ok(data && data.length)
  test.equal(data[0][2], 'H3G')
  test.equal(data[4][2], 'OVERDRAFT INTEREST')
})
