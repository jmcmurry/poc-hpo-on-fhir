// Javascript for the hposummary table on phenotypes view

$(document).ready(function() {
	
	function getContextPath() {
		return $("meta[name='ctx']").attr("content");
	}
	
	function showLabs(d) {
		// `d` is the original data object for the row
		var table = "<div class='card details-card'>"
				+ "<table class='table-bordered'>"
				+ "<thead>"
				+ "<tr class='table-warning'><th>Resource Id</th><th>LOINC</th><th>Description</th><th>Value</th><th>Start Date</th><th>End Date</th></tr>"
				+ "</thead>" + "<tbody>";
		for (i = 0; i < d.observations.length; i++) {
			var observation = d.observations[i];
			table += "<tr>" + "<td>" + observation.fhirId + "</td><td>"
					+ observation.loincId + "</td><td>"
					+ observation.description + "</td><td>"
					+ observation.value + "</td><td>" 
					+ observation.startDate + "</td><td>" 
					+ observation.endDate+ "</td></tr>";
		}
		table += "</tbody></table></div>";
		return table;
	}

	var patientId = $("#patient_id").html();

	// Set up table
	var table = $("#hposummary").DataTable({
		ajax : {
			"url" : getContextPath() + "patient/" + patientId + "/summary"
		},
		info: true,
		paging : true,
		searching : true,
		fnDrawCallback: function( settings ) {
			$('td.details-control').html('<i class="fas fa-plus-square"></i>');
	    },
		columns : [ {
			"className" : "details-control",
			"orderable" : false,
			"data" : null,
			"defaultContent" : ''
			}, 
			{ "data" : "hpoTermName" }, 
			{ "data" : "hpoTermId" },
			{ "data" : "count"},
			{ "data" : "first" },
			{ "data" : "last"}
		],
		aaSorting : [] // Do not sort any columns initially
	});
	
	// Add event listener for opening and closing details
	$('#hposummary tbody').on('click', 'td.details-control', function() {
		var tr = $(this).closest('tr');
		var row = table.row(tr);

		if (row.child.isShown()) {
			// This row is already open - close it
			row.child.hide();
			$(this).html('<i class="fas fa-plus-square"></i>');
		} else {
			// Open this row
			row.child(showLabs(row.data()), 'details-row').show();
			$(this).html('<i class="fas fa-minus-square"></i>');
		}
	});

});
