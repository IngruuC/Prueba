// Script para validar el formulario de suscripción - VERSIÓN JSONPLACEHOLDER POST

document.addEventListener('DOMContentLoaded', function() {
    // CARGAR DATOS DEL LOCALSTORAGE AL INICIAR
    loadDataFromLocalStorage();

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

    // Validaciones por campo (SIN CAMBIOS)
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

    // Validación completa al enviar - ACTUALIZADA PARA POST
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Siempre prevenir envío por defecto

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
            showModal('Error de Validación', 'Errores encontrados:<br>' + errores.join('<br>'), false);
        } else {
            enviarDatos(datos);
        }
    });

    // FUNCIÓN ACTUALIZADA PARA ENVIAR CON POST A JSONPLACEHOLDER
    function enviarDatos(datos) {
        // Mostrar modal de carga
        showModal('Enviando...', 'Por favor espera mientras enviamos tus datos...', null);

        // URL de JSONPlaceholder
        const baseUrl = 'https://jsonplaceholder.typicode.com/posts';
        
        // Preparar datos para envío
        const postData = {
            title: 'Suscripción Newsletter',
            body: 'Datos de suscripción al newsletter',
            userId: 1,
            ...datos // Agregar todos los datos del formulario
        };

        // Enviar con fetch usando POST
        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            return response.json().then(data => ({
                status: response.status,
                ok: response.ok,
                data: data
            }));
        })
        .then(result => {
            if (result.ok) {
                handleSuccess(result.data, datos);
            } else {
                handleError(result.status, result.data);
            }
        })
        .catch(error => {
            handleNetworkError(error);
        });
    }

    // FUNCIÓN PARA MANEJAR ÉXITO
    function handleSuccess(responseData, sentData) {
        // Guardar datos ENVIADOS en LocalStorage (no la respuesta del servidor)
        saveDataToLocalStorage(sentData);

        let message = '¡Suscripción exitosa!<br><br>';
        message += '<strong>Datos recibidos del servidor:</strong><br>';
        message += '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #2ecc40;">';
        
        if (responseData) {
            message += `<strong>ID:</strong> ${responseData.id || 'N/A'}<br>`;
            message += `<strong>Título:</strong> ${responseData.title || 'N/A'}<br>`;
            message += `<strong>Usuario ID:</strong> ${responseData.userId || 'N/A'}<br>`;
            
            // Mostrar datos enviados que fueron procesados
            Object.keys(sentData).forEach(key => {
                if (responseData[key]) {
                    message += `<strong>${key}:</strong> ${responseData[key]}<br>`;
                }
            });
        }
        message += '</div>';
        
        showModal('¡Éxito!', message, true);
    }

    // FUNCIÓN PARA MANEJAR ERRORES DEL SERVIDOR
    function handleError(status, errorData) {
        let message = `<strong>Error ${status}</strong><br><br>`;
        message += 'No se pudo procesar la suscripción.<br><br>';
        
        if (errorData) {
            message += '<div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #e74c3c;">';
            message += '<strong>Detalles del error:</strong><br>';
            message += formatData(errorData);
            message += '</div>';
        }
        
        showModal('Error', message, false);
    }

    // FUNCIÓN PARA MANEJAR ERRORES DE RED
    function handleNetworkError(error) {
        let message = '<strong>Error de conexión</strong><br><br>';
        message += 'No se pudo conectar con el servidor.<br>';
        message += 'Por favor, verifica tu conexión a internet e intenta nuevamente.<br><br>';
        
        message += '<div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #e74c3c;">';
        message += '<strong>Detalles técnicos:</strong><br>';
        message += error.message;
        message += '</div>';
        
        showModal('Error de Conexión', message, false);
    }

    // FUNCIÓN PARA FORMATEAR DATOS
    function formatData(data) {
        if (typeof data === 'object') {
            let formatted = '';
            Object.keys(data).forEach(key => {
                formatted += `<strong>${key}:</strong> ${data[key]}<br>`;
            });
            return formatted;
        }
        return data;
    }

    // FUNCIÓN PARA MOSTRAR MODAL
    function showModal(title, content, isSuccess) {
        const modal = document.getElementById('responseModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = title;
        modalTitle.style.color = isSuccess === true ? '#2ecc40' : isSuccess === false ? '#e74c3c' : '#333';
        modalBody.innerHTML = content;
        
        modal.style.display = 'block';
    }

    // FUNCIÓN PARA CERRAR MODAL
    function closeModal() {
        document.getElementById('responseModal').style.display = 'none';
    }

    // Event listeners del modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('responseModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // FUNCIONES DE LOCALSTORAGE
    function saveDataToLocalStorage(data) {
        try {
            localStorage.setItem('newsletterData', JSON.stringify(data));
            console.log('Datos guardados en LocalStorage:', data);
        } catch (error) {
            console.error('Error al guardar en LocalStorage:', error);
        }
    }

    function loadDataFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('newsletterData');
            if (savedData) {
                const data = JSON.parse(savedData);
                console.log('Datos cargados desde LocalStorage:', data);
                
                // Cargar datos en los campos del formulario
                Object.keys(data).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = data[key];
                        // Actualizar título si es el campo nombre
                        if (key === 'nombre' && tituloHola) {
                            tituloHola.textContent = 'HOLA ' + data[key];
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar desde LocalStorage:', error);
        }
    }
});