$(document).ready(function () {
    handlePageStates.init();
});

var handlePageStates = function () {
    function init() {
        handleButtonsEvents();
    }
    function handleButtonsEvents() {
        $("#btnCargar").on("click", function (e) {
            e.preventDefault();
            $('#btnCargar').html('Agregando..<i class="fa fa-refresh fa-spin"></i>');
            $('#btnCargar').attr('disabled', 'disabled');
            $("#btnLimpiar").attr('disabled', 'disabled');
            $("#msgUser").html('');
            
            $("#FormUpload").attr('target', '');
            $("#FormUpload").submit();
        });

        $("#btnLimpiar").on("click", function (e) {
            e.preventDefault();
            $("#FormUpload").get(0).reset();
            $("#fileList").html('');
            $("#msgUser").html('');
        });

        $("#file").on('change', function (event) {
            var file = event.target.files[0];
            $("#msgUser").html('');
            if (file.size >= 10 * 1024 * 1024) {
                handleMensaje.mensajeError('El peso máximo de los archivos es de 10MB.');
                $("#btnLimpiar").click();
                //$("#FormUpload").get(0).reset(); //the tricky part is to "empty" the input file here I reset the form.
                return;
            }

            

            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                var int32View = new Uint8Array(e.target.result);
                //verify the magic number
                // for PDF is 0x25 0x50 0x44 0x46 2d
                // for JPG is 0xFF 0xD8 0xFF 0xE0 (see https://en.wikipedia.org/wiki/List_of_file_signatures)
                if (int32View.length > 4 && int32View[0] == 0x25 && int32View[1] == 0x50 && int32View[2] == 0x44 && int32View[3] == 0x46) {
                    $("#fileList").html('');
                    $("#file").each(function (index, field) {
                        for (var i = 0; i < field.files.length; i++) {
                            const file = field.files[i];
                            if (!file.type.match('application/pdf.*')) {
                                handleMensaje.mensajeError('Sólo se aceptan archivos PDF.');
                                $("#btnLimpiar").click();
                                //$("#FormUpload").get(0).reset(); //the tricky part is to "empty" the input file here I reset the form.
                                return;
                            }
                            $("#fileList").append($("<li>").text(file.name));
                        }
                    });
                    $("#fileList li").attr('class', 'tab');
                } else {
                    handleMensaje.mensajeError('Sólo se aceptan archivos PDF.');
                    $("#btnLimpiar").click();
                    //$("#FormUpload").get(0).reset(); //the tricky part is to "empty" the input file here I reset the form.
                    return;
                }
            };
            fileReader.readAsArrayBuffer(file);

           
            

        });
    }
    return {
        init: init
    }
}();