import { getAll, remove, save, selectOne, update, existencias } from "./firestore.js";
let id = '';

document.getElementById('btnSave').addEventListener('click', async () => {
    if (document.querySelectorAll('.is-invalid').length > 0) {
        return; // Detener la función si hay campos inválidos
    }

    const perrines = {
        nomdu: document.getElementById('nombredu').value,
        apedu: document.getElementById('apellidodu').value,
        run: document.getElementById('run').value,
        domi: document.getElementById('domicilio').value,
        correo: document.getElementById('email').value,
        contacto: document.getElementById('fono').value,
        nommas: document.getElementById('nombremas').value,
        espe: document.getElementById('especie').value,
        raza: document.getElementById('raza').value,
        fenac: document.getElementById('fechanacto').value,
        ciunac: document.getElementById('ciudadnac').value,
        token: document.getElementById('chip').value,
        gen: document.getElementById('genero').value,
        kilo: document.getElementById('peso').value,
        roaut: document.getElementById('roautdog').value,
    };

    try {
        if (id === '') {
            const esIgual = await existencias(perrines.run, perrines.nommas);
            if (esIgual) {
                showAlert("¡Error!", "El documento con el mismo RUN y nombre de mascota ya existe.", "error");
            } else {
                await save(perrines);
                showAlert("¡Guardado!", "El registro del animal ha sido guardado", "success");
                limpiar();
            }
        } else {
            await update(id, perrines);
            showAlert("¡Editado!", "El registro del animal ha sido editado", "success");
            limpiar();
            id = ''; // Reiniciar el ID después de la edición
            document.getElementById('btnSave').textContent = 'Guardar'; // Cambiar texto del botón a "Guardar"
        }
    } catch (error) {
        console.error("Error:", error);
        showAlert("¡Error!", "Hubo un problema al guardar el registro.", "error");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    getAll(datos => {
        let tabla = '';
        datos.forEach(doc => {
            const item = doc.data();
            tabla += `<tr>
                <td>${item.nomdu}</td>
                <td>${item.apedu}</td>
                <td>${item.run}</td>
                <td>${item.domi}</td>
                <td>${item.correo}</td>
                <td>${item.contacto}</td>
                <td>${item.nommas}</td>
                <td>${item.espe}</td>
                <td>${item.raza}</td>
                <td>${item.fenac}</td>
                <td>${item.ciunac}</td>
                <td>${item.token}</td>
                <td>${item.gen}</td>
                <td>${item.kilo}</td>
                <td>${item.roaut}</td>
                <td nowrap>
                    <button class="btn btn-warning btn-editar" data-id="${doc.id}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" data-id="${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;
        addEventListenersToButtons();
    });
});

function addEventListenersToButtons() {
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            confirmarYRemueve(btn.dataset.id);
        });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', async () => {
            await editarAnimal(btn.dataset.id); // Agregado await aquí
        });
    });
}

async function editarAnimal(animalId) {
    showEditMessage()
    try {
        const dog = await selectOne(animalId);
        if (dog.exists) {
            const e = dog.data();
            document.getElementById('nombredu').value = e.nomdu;
            document.getElementById('apellidodu').value = e.apedu;
            document.getElementById('run').value = e.run;
            document.getElementById('domicilio').value = e.domi;
            document.getElementById('email').value = e.correo;
            document.getElementById('fono').value = e.contacto;
            document.getElementById('nombremas').value = e.nommas;
            document.getElementById('especie').value = e.espe;
            document.getElementById('raza').value = e.raza;
            document.getElementById('fechanacto').value = e.fenac;
            document.getElementById('ciudadnac').value = e.ciunac;
            document.getElementById('chip').value = e.token;
            document.getElementById('genero').value = e.gen;
            document.getElementById('roautdog').value = e.roaut;
            document.getElementById('peso').value = e.kilo;
            document.getElementById('run').readOnly = true;
            document.getElementById('btnSave').textContent = 'Editar'; // Cambiar texto del botón a "Editar"
            id = dog.id; // Guardar el ID del documento para la edición
        }
    } catch (error) {
        console.error("Error editing animal: ", error);
    }
}
function showEditMessage() {
    Swal.fire({
        title: 'Editando documento',
        text: 'Estás editando el registro del animal.',
        icon: 'info',
        timer: 3000, // Mostrar por 3 segundos
        timerProgressBar: true,
        showConfirmButton: false
    });
}
function confirmarYRemueve(animalId) {
    Swal.fire({
        title: "¿Está seguro de eliminar el registro del Animal?",
        text: "No podrá revertir los cambios",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await remove(animalId); // Agregado await aquí
                showAlert("Eliminado!", "El Registro del Animal Ha Sido Eliminado", "success");
                limpiar(); // Limpia el formulario después de eliminar
            } catch (error) {
                console.error("Error deleting animal: ", error);
            }
        }
    });
}

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function limpiar() {
    // Limpia los valores de los campos del formulario
    document.getElementById('nombredu').value = '';
    document.getElementById('apellidodu').value = '';
    document.getElementById('run').value = '';
    document.getElementById('domicilio').value = '';
    document.getElementById('email').value = '';
    document.getElementById('fono').value = '';
    document.getElementById('nombremas').value = '';
    document.getElementById('especie').value = '';
    document.getElementById('raza').value = '';
    document.getElementById('fechanacto').value = '';
    document.getElementById('ciudadnac').value = '';
    document.getElementById('chip').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('peso').value = '';

    // Desmarca los checks de las casillas
    document.querySelectorAll('.form-check-input').forEach(check => {
        check.checked = false;
    });

    // Habilita la edición del campo RUN
    document.getElementById('run').readOnly = false;
    // Cambia el texto del botón "Editar" a "Guardar"
    document.getElementById('btnSave').value = 'Guardar';
}
