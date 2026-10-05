const prefiereMovimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const botonTema = document.getElementById('boton-tema');
const temaGuardado = localStorage.getItem('tema');

function aplicarTema(oscuro) {
    document.documentElement.classList.toggle('light', !oscuro);
    botonTema.setAttribute('aria-pressed', String(oscuro));
    botonTema.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
}

if (temaGuardado) {
    aplicarTema(temaGuardado === 'oscuro');
} else {
    aplicarTema(true);
}

botonTema.addEventListener('click', () => {
    const claro = document.documentElement.classList.toggle('light');
    localStorage.setItem('tema', claro ? 'claro' : 'oscuro');
    aplicarTema(!claro);
});

const botonMenu = document.getElementById('boton-menu');
const menu = document.getElementById('menu-principal');

function abrirMenu() {
    menu.classList.add('abierto');
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.setAttribute('aria-label', 'Cerrar menú de navegación');
}

function cerrarMenu() {
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú de navegación');
}

botonMenu.addEventListener('click', () => {
    if (menu.classList.contains('abierto')) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('abierto')) {
        cerrarMenu();
        botonMenu.focus();
    }
});

const enlacesNavegacion = document.querySelectorAll('.menu-lista a[href^="#"]');

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            enlacesNavegacion.forEach((enlace) => {
                enlace.classList.toggle('activo', enlace.getAttribute('href') === '#' + entrada.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach((seccion) => observador.observe(seccion));

enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener('click', (evento) => {
        evento.preventDefault();
        const destino = document.querySelector(enlace.getAttribute('href'));
        if (!destino) {
            return;
        }
        if (prefiereMovimientoReducido) {
            destino.scrollIntoView();
        } else {
            destino.scrollIntoView({ behavior: 'smooth' });
        }
        cerrarMenu();
    });
});

const formulario = document.getElementById('formulario-contacto');
const campos = {
    nombre: document.getElementById('campo-nombre'),
    email: document.getElementById('campo-email'),
    mensaje: document.getElementById('campo-mensaje')
};
const errores = {
    nombre: document.getElementById('error-nombre'),
    email: document.getElementById('error-email'),
    mensaje: document.getElementById('error-mensaje')
};
const exito = document.getElementById('exito-formulario');

function mostrarError(campo, mensaje) {
    campos[campo].setAttribute('aria-invalid', 'true');
    errores[campo].textContent = mensaje;
    errores[campo].hidden = false;
}

function limpiarError(campo) {
    campos[campo].removeAttribute('aria-invalid');
    errores[campo].textContent = '';
    errores[campo].hidden = true;
}

function validarFormulario() {
    let valido = true;

    if (campos.nombre.value.trim().length < 2) {
        mostrarError('nombre', 'Escribe tu nombre (mínimo 2 letras).');
        valido = false;
    } else {
        limpiarError('nombre');
    }

    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronEmail.test(campos.email.value.trim())) {
        mostrarError('email', 'Escribe un correo válido, por ejemplo: nombre@dominio.com');
        valido = false;
    } else {
        limpiarError('email');
    }

    if (campos.mensaje.value.trim().length < 10) {
        mostrarError('mensaje', 'Escribe un mensaje de al menos 10 caracteres.');
        valido = false;
    } else {
        limpiarError('mensaje');
    }

    return valido;
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    exito.hidden = true;

    if (!validarFormulario()) {
        const primerInvalido = formulario.querySelector('[aria-invalid="true"]');
        if (primerInvalido) {
            primerInvalido.focus();
        }
        return;
    }

    exito.textContent = `¡Gracias, ${campos.nombre.value.trim()}! Tu mensaje fue enviado correctamente.`;
    exito.hidden = false;
    formulario.reset();
});

const contenedorProyectos = document.getElementById('grid-proyectos');

fetch('data/proyectos.json')
    .then((respuesta) => respuesta.json())
    .then((proyectos) => {
        const tarjetas = proyectos.map((proyecto) => {
            const etiquetas = proyecto.tecnologias
                .map((tecnologia) => `<li class="etiqueta">${tecnologia}</li>`)
                .join('');

            return `
                <article class="tarjeta tarjeta-proyecto">
                    <h3>${proyecto.titulo}</h3>
                    <img src="${proyecto.imagen}" alt="${proyecto.alt}" loading="lazy">
                    <p class="descripcion">${proyecto.descripcion}</p>
                    <ul class="etiquetas">${etiquetas}</ul>
                    <a class="enlace-proyecto" href="${proyecto.url}" target="_blank" rel="noopener noreferrer">Ver en GitHub →</a>
                </article>`;
        });

        contenedorProyectos.innerHTML = tarjetas.join('');
    })
    .catch(() => {
        contenedorProyectos.innerHTML = '<p class="texto-centrado">No se pudieron cargar los proyectos.</p>';
    });

document.getElementById('anio').textContent = new Date().getFullYear();