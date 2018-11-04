// Toggle dropdown list options upon radio button change
$('input[type=radio][name="upload-type"]').on('change', function() {
	$('select option').toggleClass('datatype-list-lts');

	if ($(this).val() === 'update-lts') {
		$("#datatype").val('Port of Loading');		
	}
	else {
		$('#datatype').val('Purchase Orders');	
	}
});