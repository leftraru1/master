var handlePageStates = function () {

    var handleFormValidations = function () {

        function aplicaValidaciones() {

            validaLogin();

        }

        function validaLogin() {

            $('#formLogin').bootstrapValidator({
                framework: 'bootstrap ',
                live: 'disabled',
                excluded: [':disabled'],
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    USU_USERNAME: {
                        validators: {
                            notEmpty: {
                                message: 'El nombre es requerido'
                            },
                            stringLength: {
                                max: 20,
                                message: 'Solo se permiten 20 caracteres como máximo'
                            }
                        }
                    },
                    USU_PASS: {
                        validators: {
                            notEmpty: {
                                message: 'La contraseña es requerida'
                            },
                            stringLength: {
                                max: 12,
                                message: 'Solo se permiten 20 caracteres como máximo'
                            }
                        }
                    },
                }
            })

        }

        return {

            aplicaValidaciones: aplicaValidaciones

        };

    }();

    function init() {

        handleFormValidations.aplicaValidaciones();
        handleCargaInicial();

    }

    function handleCargaInicial() {

        $(".bloquea_chars").on("keypress", function (e) {
            var char = e.keyCode;
            if (CaracterValido(char) == false)
                e.preventDefault();
        }).on("paste", function (e) {
            e.preventDefault();
        });
        $("#txtUserPass").keypress(function (e) {
            // Enter pressed?
            if (e.which == 10 || e.which == 13) {
                this.form.submit();
            }
        });
        $("#btnIngresar").on("click", function (e) {

            e.preventDefault();

            handleMensaje.mensajeInfo("hola mundo");

        });

    }

    function CaracterValido(caracter) {
        var value = false;

        if (caracter >= 48 && caracter < 58) // 0 al 9
            value = true;
        else if (caracter >= 65 && caracter < 91) // A a la Z
            value = true;
        else if (caracter >= 97 && caracter < 123) // a a la z
            value = true;
        else {
            if (caracter == 32) // space
                value = true;
            else if (caracter == 46) // .
                value = true;
            else if (caracter == 95) // _
                value = true;
        }

        return value;
    }

    return {
        init: init
    };

}()


$(document).ready(function () {

    handlePageStates.init();

});