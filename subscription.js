// Script para validar el formulario de suscripción

document.addEventListener('DOMContentLoaded', function() {
    // BONUS: Actualizar título en tiempo real
    const tituloHola = document.getElementById('hola-titulo');
    const inputNombre = document.getElementById('nombre');
    if (tituloHola && inputNombre) {
        function actualizarTitulo() {
            if (inputNombre.value.trim() !== '') {
                tituloHola.textContent = 'HOLA ' + inputNombre.value;
            } else {
                tituloHola.textContent = 'HOLA';
            }
        }
        inputNombre.addEventListener('input', actualizarTitulo);
        inputNombre.addEventListener('focus', actualizarTitulo);
    }

    // Validaciones por campo
    const form = document.getElementById('form-suscripcion');
    const campos = [
        'nombre', 'email', 'password', 'repetir-password', 'edad',
        'telefono', 'direccion', 'ciudad', 'cp', 'dni'
    ];

    const mensajes = {
        nombre: "El nombre debe tener más de 6 letras y al menos un espacio.",
        email: "Ingresa un email válido.",
        password: "La contraseña debe tener al menos 8 caracteres, letras y números.",
        'repetir-password': "Ambas contraseñas deben ser iguales.",
        edad: "Debes tener al menos 18 años.",
        telefono: "Debe ser un número de al menos 7 dígitos, sin espacios ni guiones.",
        direccion: "Debe tener al menos 5 caracteres, letras, números y un espacio en el medio.",
        ciudad: "Mínimo 3 caracteres.",
        cp: "Mínimo 3 caracteres.",
        dni: "Debe ser un número de 7 u 8 dígitos."
    };

    function validarCampo(id) {
        const val = document.getElementById(id).value.trim();
        switch(id) {
            case 'nombre':
                return val.length > 6 && /\s/.test(val);
            case 'email':
                return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
            case 'password':
                return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(val);
            case 'repetir-password':
                return val === document.getElementById('password').value;
            case 'edad':
                return /^\d+$/.test(val) && parseInt(val, 10) >= 18;
            case 'telefono':
                return /^\d{7,}$/.test(val);
            case 'direccion':
                return val.length >= 5 && /[a-zA-Z]/.test(val) && /\d/.test(val) && /\s/.test(val);
            case 'ciudad':
                return val.length >= 3;
            case 'cp':
                return val.length >= 3;
            case 'dni':
                return /^\d{7,8}$/.test(val);
            default:
                return true;
        }
    }

    // Control de si el usuario ya interactuó con el campo
    const touched = {};

    campos.forEach(function(id) {
        touched[id] = false;
        const input = document.getElementById(id);
        const icon = document.getElementById('icon-' + id);

        // Al salir del campo, validamos y mostramos error si corresponde
        input.addEventListener('blur', function() {
            touched[id] = true;
            if (!validarCampo(id)) {
                document.getElementById('error-' + id).textContent = mensajes[id];
                input.classList.add('error');
                input.classList.remove('success');
                if (icon) {
                    icon.classList.add('error');
                    icon.classList.remove('success');
                    icon.innerHTML = '✖';
                }
            } else {
                document.getElementById('error-' + id).textContent = '';
                input.classList.remove('error');
                input.classList.add('success');
                if (icon) {
                    icon.classList.remove('error');
                    icon.classList.add('success');
                    icon.innerHTML = '✔';
                }
            }
        });

        // Mientras escribe, solo mostramos error si ya tocó el campo
        input.addEventListener('input', function() {
            if (touched[id]) {
                if (!validarCampo(id)) {
                    document.getElementById('error-' + id).textContent = mensajes[id];
                    input.classList.add('error');
                    input.classList.remove('success');
                    if (icon) {
                        icon.classList.add('error');
                        icon.classList.remove('success');
                        icon.innerHTML = '✖';
                    }
                } else {
                    document.getElementById('error-' + id).textContent = '';
                    input.classList.remove('error');
                    input.classList.add('success');
                    if (icon) {
                        icon.classList.remove('error');
                        icon.classList.add('success');
                        icon.innerHTML = '✔';
                    }
                }
            }
        });

        // Al enfocar limpiamos el error y los iconos
        input.addEventListener('focus', function() {
            document.getElementById('error-' + id).textContent = '';
            input.classList.remove('error', 'success');
            if (icon) {
                icon.classList.remove('error', 'success');
                icon.innerHTML = '';
            }
        });
    });

    // Validación completa al enviar
    form.addEventListener('submit', function(e) {
        let hayErrores = false;
        let errores = [];
        let datos = {};
        campos.forEach(function(id) {
            const valido = validarCampo(id);
            const input = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            datos[id] = input.value.trim();
            touched[id] = true;
            if (!valido) {
                document.getElementById('error-' + id).textContent = mensajes[id];
                input.classList.add('error');
                input.classList.remove('success');
                if (icon) {
                    icon.classList.add('error');
                    icon.classList.remove('success');
                    icon.innerHTML = '✖';
                }
                errores.push(mensajes[id]);
                hayErrores = true;
            } else {
                document.getElementById('error-' + id).textContent = '';
                input.classList.remove('error');
                input.classList.add('success');
                if (icon) {
                    icon.classList.remove('error');
                    icon.classList.add('success');
                    icon.innerHTML = '✔';
                }
            }
        });
        if (hayErrores) {
            e.preventDefault(); // No envía el formulario si hay errores
            alert("Errores:\n" + errores.join("\n"));
        } else {
            // SOLO mostramos el mensaje, pero dejamos enviar el form normalmente
            let mensaje = "Datos ingresados correctamente:\n";
            mensaje += "Nombre: " + datos.nombre + "\n";
            mensaje += "Email: " + datos.email + "\n";
            mensaje += "Edad: " + datos.edad + "\n";
            mensaje += "Teléfono: " + datos.telefono + "\n";
            mensaje += "Dirección: " + datos.direccion + "\n";
            mensaje += "Ciudad: " + datos.ciudad + "\n";
            mensaje += "Código Postal: " + datos.cp + "\n";
            mensaje += "DNI: " + datos.dni + "\n";
            alert(mensaje);
            // El formulario se enviará normalmente a Getform
        }
    });
});