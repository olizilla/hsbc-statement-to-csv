var csv = '';
var nl = '\n';
var $table = $('table:not(".extPibTable")');
var statement_date = $('.extContentHighlightPib:eq(1) .extPibRow:eq(0) .hsbcTextRight').html();
var year = statement_date.substr(statement_date.length-4);


csv = csv + nl;

// get rest of data

// loop rows
$('tbody tr', $table).each(function(){
    var row_cells = $('td', $(this));
    csv = csv +  $('p', row_cells[0]).html().trim() + ' ' + year + ',';
    csv = csv + $('p', row_cells[3]).html().trim() + ',';
    csv = csv + $('a', row_cells[2]).html().trim() + ',';
    csv = csv + nl;
});

var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

$('body').append('<a href="'+data+'" download="statement-'+(statement_date.replace(' ', '-'))+'.csv" id="download-statement" style="display: none;">Download</a>');

$('#download-statement')[0].click();
