var statement_date = $('.extContentHighlightPib:eq(1) .extPibRow:eq(0) .hsbcTextRight').html();
var statement_year = statement_date.substr(statement_date.length-4);

function processMonth (monthName) {
    month_name_map = {
        'Jan': 1,
        'Feb': 2,
        'Mar': 3,
        'Apr': 4,
        'May': 5,
        'Jun': 6,
        'Jul': 7,
        'Aug': 8,
        'Sep': 9,
        'Oct': 10,
        'Nov': 11,
        'Dec': 12
    };
    return month_name_map[monthName]
}

// Pull the date out of the table.
// Check the previous row to figure out when we've gone back a year
function processDate (data, cell) {
    var text = $('p', cell).html().trim().split(' ');
    var date = {
        day: text[0],
        month: processMonth(text[1])
    }
    if (!data.length) {
        date.year = statement_year
    } else {
        var prevDate = data[data.length - 1][0]
        date.year = prevDate.year

        // Have we flipped from jan to dec of previous year
        if (prevDate.month < date.month) {
            date.year = date.year - 1
        }
    }
    return date
}

// Pull out the payment name
function processName (cell) {
    return $(cell).text().trim().replace(/,/g, ' ')
}

// Figure out if it's money in or out of the account
function processAmount (out_cell, in_cell) {
    function extract (cell) {
        return $('p', cell).text().trim().replace(/&nbsp;/g, '')
    }
    var moneyIn = extract(in_cell)
    var moneyOut = '-' + extract(out_cell)
    return moneyIn ? moneyIn : moneyOut
}

// Pull the interesting items from the tr gunk into an array
function processRow (data, row) {
    var res = [];
    var row_cells = $('td', $(row));
    res.push(processDate(data, row_cells[0]))
    res.push(processAmount(row_cells[3], row_cells[4]))
    res.push(processName(row_cells[2]))
    return res
}

function processTable () {
    var $table = $('table:not(".extPibTable")')
    var table = $('tbody tr', $table).slice(1, -1).toArray()
    var data = table.reverse().reduce(function(data, row) {
        data.push(processRow(data, row))
        return data
    }, [])
    return data.reverse()
}

function makeCsv (data) {
    return data
      .map(function (row) {
          var date = row[0].day + '/' + row[0].month + '/' + row[0].year
          row[0] = date
          return row
      })
      .map(function (row) { return row.join(',')})
      .join('\n')
}

var csv = makeCsv(processTable())
var dataUri = 'dataUri:application/csv;charset=utf-8,' + encodeURIComponent(csv);
$('body').append('<a href="'+dataUri+'" download="statement-'+(statement_date.replace(' ', '-'))+'.csv" id="download-statement" style="display: none;">Download</a>');
$('#download-statement')[0].click();
