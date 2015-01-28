var $ = require('jquery')

module.exports = function () {
  var data = scrapeHtml()
  var csv = makeCsv(data)
  triggerDownload(csv)
}
module.exports.scrapeHtml = scrapeHtml
module.exports.makeCsv = makeCsv

/*
 Find the statement table in the html. Translate the rows into a 2d array we can work with:
 [{day: 1, month: 12, year: 2001}, 100, 'WOO HAA'],
 [{day: 15, month: 12, year: 2001}, -100, 'BAD TIMES']
 */
function scrapeHtml () {
  var $table = $('table').not('.extPibTable')
  var table = $('tbody tr', $table).slice(1, -1).toArray()
  var data = table.reverse().reduce(function (data, row) {
    data.push(scrapeRow(data, row))
    return data
  }, [])
  return data.reverse()
}

// Flatten the 2d array.
// Format the dates; Comma-separate the items; new-line delimit the rows.
function makeCsv (data) {
  return data
    .map(function (row) {
      row[0] = dateFormat(row[0])
      return row
    })
    .map(function (row) {
      return row.join(',')
    })
    .join('\n')
}

// Add a download link with the csv encoded as a dataUri, and click it.
function triggerDownload (csv) {
  var filename = nameCsv(findStatementDate())
  var dataUri = 'dataUri:application/csv;charset=utf-8,' + encodeURIComponent(csv)
  $('<a id="download-statement" style="display: none;">Download</a>')
    .attr('href', dataUri)
    .attr('download', filename)
    .appendTo('body')
    .click()
}

// Pull the interesting items from the tr gunk into an array
function scrapeRow (data, row) {
  var res = []
  var row_cells = $('td', $(row))
  res.push(scrapePaymentDate(data, row_cells[0]))
  res.push(scrapePaymentAmount(row_cells[3], row_cells[4]))
  res.push(scrapePaymentName(row_cells[2]))
  return res
}

// Figure out the full date from the hsbc format... e.g 05 Feb
function scrapePaymentDate (data, cell) {
  var text = $('p', cell).html().trim().split(' ')
  var day = parseInt(text[0])
  var month = translateMonth(text[1])
  var year = calculatePaymentYear(data, month)
  return {day: day, month: month, year: year}
}

// Use the year of the statement to guess the first one.
// After that, copy over the year from the previous payment.
// Check the months to figure out when we've gone back a year and decrement accordingly.
function calculatePaymentYear (data, month) {
  if (!data.length) return parseInt(findStatementDate().split(' ')[2])
  var prevDate = data[data.length - 1][0]
  // Have we flipped from jan to dec of previous year
  if (prevDate.month < month) return prevDate.year - 1
  return prevDate.year
}

// Pull out the payment name
function scrapePaymentName (cell) {
  return $(cell).text().trim().replace(/,/g, ' ')
}

// Figure out if it's money in or out of the account
function scrapePaymentAmount (out_cell, in_cell) {
  function extract (cell) {
    return $('p', cell).text().trim().replace(/&nbsp;/g, '')
  }
  var moneyIn = extract(in_cell)
  var moneyOut = '-' + extract(out_cell)
  return moneyIn ? moneyIn : moneyOut
}

// Occurs once in the page... the only thing we can use to deduce the year of payments from...
function findStatementDate () {
  // e.g. 08 Jan 2015
  var date = $('#content .hsbcTextRight').first().html()
  return date
}

// Freeagent friendly date formatting
function dateFormat (date) {
  return date.day + '/' + date.month + '/' + date.year
}

function nameCsv (date) {
  date.toLowerCase().replace(' ', '-')
  return 'statement-' + date + '.csv'
}

function translateMonth (name) {
  return {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  }[name]
}
