var csv = '';
var nl = '\n';
var $table = $('table:not(".extPibTable")');
var statement_date = $('.extContentHighlightPib:eq(1) .extPibRow:eq(0) .hsbcTextRight').html();
var year = statement_date.substr(statement_date.length-4);


csv = csv;

// get rest of data

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

// loop rows
$('tbody tr', $table).slice(1, -1).each(function(){
    var row_cells = $('td', $(this));
    var dt = $('p', row_cells[0]).html().trim().split(' ');
    csv = csv + dt[0] + '/' +  month_name_map[dt[1]]  + '/' + year + ',';
    var out = $('p', row_cells[3]).text().trim().replace(/&nbsp;/g, '');
    var inn = $('p', row_cells[4]).text().trim().replace(/&nbsp;/g, '');
    if (inn) {
	csv = csv  + inn + ',';
    } else {
	csv = csv + '-' + out + ',';
    }
    csv = csv + $(row_cells[2]).text().trim().replace(/,/g, ' ');
    csv = csv + nl;
});

var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

$('body').append('<a href="'+data+'" download="statement-'+(statement_date.replace(' ', '-'))+'.csv" id="download-statement" style="display: none;">Download</a>');

$('#download-statement')[0].click();
