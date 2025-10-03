// SECCIÓN 1 - Variables globales y funciones de inicialización

let usuarios = {
    'ags_jefe': { password: 'ags2025', rol: 'jefe', sucursal: 'AGS', nombre: 'Jefe Aguascalientes' },
    'leo_jefe': { password: 'leo2025', rol: 'jefe', sucursal: 'LEO', nombre: 'Jefe León' },
    'can_jefe': { password: 'can2025', rol: 'jefe', sucursal: 'CAN', nombre: 'Jefe Cancún' },
    'mty_jefe': { password: 'mty2025', rol: 'jefe', sucursal: 'MTY', nombre: 'Jefe Monterrey' },
    'gdl_jefe': { password: 'gdl2025', rol: 'jefe', sucursal: 'GDL', nombre: 'Jefe Guadalajara' },
    'vsa_jefe': { password: 'vsa2025', rol: 'jefe', sucursal: 'VSA', nombre: 'Jefe Villahermosa' },
    'coordinador': { password: 'coord2025', rol: 'coordinador', sucursal: null, nombre: 'Coordinador Administrativo' },
    'admin_unico': { password: 'admin2025', rol: 'admin', sucursal: null, nombre: 'Administrador General' }
};

// Definición de permisos disponibles
const permisosDisponibles = {
    'ver_todas_solicitudes': 'Ver todas las solicitudes (todos los departamentos)',
    'ver_solicitudes_sucursal': 'Ver solo solicitudes de su departamento',
    'crear_solicitud': 'Crear nuevas solicitudes',
    'editar_solicitud': 'Editar solicitudes pendientes',
    'autorizar_solicitud': 'Autorizar solicitudes',
    'cancelar_solicitud': 'Cancelar solicitudes',
    'marcar_pagada': 'Marcar solicitudes como pagadas',
    'gestionar_comprobantes': 'Subir/descargar comprobantes de pago',
    'gestionar_usuarios': 'Crear, editar y eliminar usuarios',
    'gestionar_proveedores': 'Crear, editar y eliminar proveedores',
    'gestionar_empresas': 'Crear, editar y eliminar empresas',
    'descargar_archivos': 'Descargar archivos adjuntos',
    'exportar_csv': 'Exportar datos a CSV',
    'gestionar_roles': 'Gestionar roles y permisos (solo admin)'
};

// Configuración de roles con sus permisos
let rolesConfig = {
    'admin': {
        nombre: 'Administrador General',
        permisos: [
            'ver_todas_solicitudes',
            'crear_solicitud',
            'editar_solicitud',
            'autorizar_solicitud',
            'cancelar_solicitud',
            'marcar_pagada',
            'gestionar_comprobantes',
            'gestionar_usuarios',
            'gestionar_proveedores',
            'gestionar_empresas',
            'descargar_archivos',
            'exportar_csv',
            'gestionar_roles'
        ],
        requiereSucursal: false,
        editable: false
    },
    'coordinador': {
        nombre: 'Coordinador de Departamentos',
        permisos: [
            'ver_todas_solicitudes',
            'crear_solicitud',
            'editar_solicitud',
            'autorizar_solicitud',
            'cancelar_solicitud',
            'marcar_pagada',
            'gestionar_comprobantes',
            'descargar_archivos',
            'exportar_csv'
        ],
        requiereSucursal: false,
        editable: true
    },
    'jefe': {
        nombre: 'Jefe de Departamento',
        permisos: [
            'ver_solicitudes_sucursal',
            'crear_solicitud',
            'editar_solicitud',
            'autorizar_solicitud',
            'cancelar_solicitud',
            'marcar_pagada'
        ],
        requiereSucursal: true,
        editable: true
    }
};

let beneficiarios = [
    {
        id: 1,
        nombre: 'ESPECTACULARES, S.A. DE C.V.',
        razonSocial: 'ESPECTACULARES SOCIEDAD ANONIMA DE CAPITAL VARIABLE',
        rfc: 'ESP123456789',
        banco: 'BBVA',
        cuenta: '01-20-32-02-50',
        clabe: '01279000120320250',
        csf: null
    }
];

let editandoProveedor = null;
let proveedorActualCSF = null;

let empresas = [
    {
        id: 1,
        razonSocial: 'PUBLICIDAD EXTERIOR CONFIABLE, S.A. DE C.V.',
        rfc: 'PEC123456789'
    }
];

let solicitudes = [];
let contadores = { 
    AGS: 0, 
    LEO: 0, 
    CAN: 0, 
    MTY: 0, 
    GDL: 0, 
    VSA: 0,
    CDMX: 0,
    GCC: 0,
    GCS: 0,
    DOP: 0,
    DIR: 0,
    CMP: 0
};
let editandoUsuario = null;
let editandoBeneficiario = null;
let editandoEmpresa = null;
let solicitudActualArchivos = null;
let usuarioActual = null;

let editandoRol = null;

document.addEventListener('DOMContentLoaded', async function() {
    await cargarDatosDesdeSupabase();
    verificarSesion();
    inicializarCamposMoneda();
});

function verificarSesion() {
    const sesion = sessionStorage.getItem('usuarioActual');
    if (sesion) {
        usuarioActual = JSON.parse(sesion);
        mostrarAplicacion();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
}

function iniciarSesion(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (usuarios[username] && usuarios[username].password === password) {
        usuarioActual = {
            username: username,
            nombre: usuarios[username].nombre,
            rol: usuarios[username].rol,
            sucursal: usuarios[username].sucursal
        };
        
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
        
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        errorDiv.style.display = 'none';
        
        mostrarAplicacion();
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.style.display = 'block';
        document.getElementById('loginPassword').value = '';
    }
}

function mostrarAplicacion() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    document.getElementById('userInfo').textContent = usuarioActual.nombre;
    document.getElementById('userRole').textContent = obtenerNombreRol(usuarioActual.rol);
    
    configurarInterfazPorRol();
    ocultarPestañasSegunPermisos();
    cargarBeneficiariosSelect();
    cargarEmpresasSelect();
    cargarSolicitudesVinculadas();
}

function ocultarPestañasSegunPermisos() {
    // Ocultar pestañas según permisos
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        const tabText = tab.textContent.toLowerCase();
        
        if (tabText.includes('usuarios') && !tienePermiso('gestionar_usuarios')) {
            tab.style.display = 'none';
        }
        if (tabText.includes('proveedores') && !tienePermiso('gestionar_proveedores')) {
            tab.style.display = 'none';
        }
        if (tabText.includes('empresas') && !tienePermiso('gestionar_empresas')) {
            tab.style.display = 'none';
        }
        if (tabText.includes('roles') && !tienePermiso('gestionar_roles')) {
            tab.style.display = 'none';
        }
    });
}

function obtenerNombreRol(rol) {
    const roles = {
        'admin': 'Administrador General',
        'coordinador': 'Coordinador de Departamentos',
        'jefe': 'Jefe de Departamento'
    };
    return roles[rol] || rol;
}

function configurarInterfazPorRol() {
    const sucursalSelect = document.getElementById('sucursal');
    
    if (usuarioActual.rol === 'jefe' && usuarioActual.sucursal) {
        sucursalSelect.innerHTML = `<option value="${usuarioActual.sucursal}">${getSucursalName(usuarioActual.sucursal)}</option>`;
        sucursalSelect.value = usuarioActual.sucursal;
        sucursalSelect.disabled = true;
    }
}

function cerrarSesion() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        sessionStorage.removeItem('usuarioActual');
        usuarioActual = null;
        
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        
        location.reload();
    }
}

function mostrarCambioContrasena() {
    const modal = document.getElementById('cambioPasswordModal');
    document.getElementById('cambioPasswordForm').reset();
    document.getElementById('passwordError').style.display = 'none';
    modal.style.display = 'block';
}

function cerrarModalCambioPassword() {
    document.getElementById('cambioPasswordModal').style.display = 'none';
    document.getElementById('cambioPasswordForm').reset();
    document.getElementById('passwordError').style.display = 'none';
}

function cambiarContrasena(event) {
    event.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (!usuarioActual || !usuarios[usuarioActual.username]) {
        errorDiv.textContent = 'Error: Usuario no válido';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (usuarios[usuarioActual.username].password !== passwordActual) {
        errorDiv.textContent = 'La contraseña actual es incorrecta';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (passwordNueva.length < 6) {
        errorDiv.textContent = 'La nueva contraseña debe tener al menos 6 caracteres';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (passwordNueva !== passwordConfirmar) {
        errorDiv.textContent = 'Las contraseñas nuevas no coinciden';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (passwordNueva === passwordActual) {
        errorDiv.textContent = 'La nueva contraseña debe ser diferente a la actual';
        errorDiv.style.display = 'block';
        return;
    }
    
    usuarios[usuarioActual.username].password = passwordNueva;
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Contraseña cambiada exitosamente. Por favor inicie sesión nuevamente.');
    cerrarModalCambioPassword();
    cerrarSesion();
}

function cargarUsuariosDesdeStorage() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
        try {
            usuarios = JSON.parse(usuariosGuardados);
        } catch (e) {
            console.error('Error al cargar usuarios:', e);
        }
    }
}

function guardarUsuariosEnStorage() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

cargarUsuariosDesdeStorage();

function getSucursalName(code) {
    const nombres = {
        'AGS': 'Aguascalientes',
        'LEO': 'León',
        'CAN': 'Cancún',
        'MTY': 'Monterrey',
        'GDL': 'Guadalajara',
        'VSA': 'Villahermosa',
        'CDMX': 'Ciudad de México',
        'GCC': 'Gerencia Centro',
        'GCS': 'Gerencia de Departamentos',
        'DOP': 'Dirección de Operaciones',
        'DIR': 'Dirección General',
        'CMP': 'Compras'
    };
    return nombres[code] || code;
}

function switchTab(tabName) {
    // Verificar permisos para ciertas pestañas
    if (tabName === 'usuarios' && !tienePermiso('gestionar_usuarios')) {
        alert('No tiene permisos para acceder a esta sección');
        return;
    }
    if (tabName === 'proveedores' && !tienePermiso('gestionar_proveedores')) {
        alert('No tiene permisos para acceder a esta sección');
        return;
    }
    if (tabName === 'empresas' && !tienePermiso('gestionar_empresas')) {
        alert('No tiene permisos para acceder a esta sección');
        return;
    }
    if (tabName === 'roles' && !tienePermiso('gestionar_roles')) {
        alert('No tiene permisos para acceder a esta sección');
        return;
    }
    
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'solicitudes') {
        cargarSolicitudes();
    } else if (tabName === 'usuarios') {
        cargarUsuarios();
    } else if (tabName === 'proveedores') {
        cargarProveedores();
    } else if (tabName === 'empresas') {
        cargarEmpresas();
    } else if (tabName === 'roles') {
        cargarRoles();
    } else if (tabName === 'nueva') {
        cargarBeneficiariosSelect();
        cargarEmpresasSelect();
        cargarSolicitudesVinculadas();
    }
}

function formatearMoneda(input) {
    const cursorPosition = input.selectionStart;
    let valor = input.value.replace(/[^0-9.]/g, '');
    
    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes.slice(1).join('');
    }
    
    if (partes[1] && partes[1].length > 2) {
        valor = partes[0] + '.' + partes[1].substring(0, 2);
    }
    
    const valorAnterior = input.value;
    const valorFormateado = valor ? '$' + valor : '';
    
    input.value = valorFormateado;
    
    let nuevaPosicion = cursorPosition;
    if (valorFormateado.length > valorAnterior.length) {
        nuevaPosicion = cursorPosition + 1;
    } else if (valorFormateado.length < valorAnterior.length) {
        nuevaPosicion = cursorPosition;
    }
    
    if (nuevaPosicion < 1) nuevaPosicion = 1;
    if (nuevaPosicion > valorFormateado.length) nuevaPosicion = valorFormateado.length;
    
    input.setSelectionRange(nuevaPosicion, nuevaPosicion);
}

function formatearMonedaCompleto(input) {
    let valor = input.value.replace(/[^0-9.]/g, '');
    
    if (valor === '') {
        input.value = '';
        return;
    }
    
    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes.slice(1).join('');
    }
    
    const numero = parseFloat(valor);
    if (!isNaN(numero)) {
        input.value = '$' + numero.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else {
        input.value = '';
    }
}

function extraerValorMoneda(valorFormateado) {
    if (!valorFormateado) return 0;
    const valorLimpio = valorFormateado.replace(/[^0-9.-]/g, '');
    return parseFloat(valorLimpio) || 0;
}

function inicializarCamposMoneda() {
    const camposMoneda = ['montoConceptoGeneral', 'subtotal'];
    
    camposMoneda.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('focus', function() {
                if (this.value === '$0.00' || this.value === '') {
                    this.value = '$';
                }
            });
            
            campo.addEventListener('keydown', function(e) {
                if (this.value === '$' && e.key === 'Backspace') {
                    e.preventDefault();
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    inicializarCamposMoneda();
    
    const sucursalSelect = document.getElementById('sucursal');
    if (sucursalSelect) {
        sucursalSelect.addEventListener('change', function() {
            const checkbox = document.getElementById('numeroAutomatico');
            if (checkbox && checkbox.checked) {
                toggleNumeroConsecutivo();
            }
        });
    }
    
    const solicitudVinculadaSelect = document.getElementById('solicitudVinculada');
    if (solicitudVinculadaSelect) {
        solicitudVinculadaSelect.addEventListener('change', function() {
            cargarConceptoVinculado();
        });
    }
});

function cargarEmpresasSelect() {
    const select = document.getElementById('empresa');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione empresa</option>';
    
    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa.id;
        option.textContent = `${empresa.razonSocial} (${empresa.rfc})`;
        select.appendChild(option);
    });
}

function cargarSolicitudesVinculadas() {
    const select = document.getElementById('solicitudVinculada');
    const sucursalSelect = document.getElementById('sucursal');
    if (!select) return;
    
    select.innerHTML = '<option value="" selected>Sin vincular</option>';
    
    const sucursalSeleccionada = sucursalSelect.value;
    
    // Filtrar por sucursal, excluir canceladas y ordenar descendente por ID
    const solicitudesFiltradas = solicitudes
        .filter(solicitud => 
            (!sucursalSeleccionada || solicitud.sucursal === sucursalSeleccionada) &&
            solicitud.estado !== 'cancelada'
        )
        .sort((a, b) => b.id - a.id);
    
    solicitudesFiltradas.forEach(solicitud => {
        const option = document.createElement('option');
        option.value = solicitud.id;
        option.textContent = `${solicitud.numero} - ${solicitud.conceptoGeneral.substring(0, 50)}...`;
        select.appendChild(option);
    });
}

function cargarConceptoVinculado() {
    const select = document.getElementById('solicitudVinculada');
    const selectedOptions = Array.from(select.selectedOptions).filter(opt => opt.value !== '');
    
    if (selectedOptions.length === 0) {
        // Si selecciona "Sin vincular", limpiar los campos
        document.getElementById('conceptoGeneral').value = '';
        document.getElementById('montoConceptoGeneral').value = '';
        
        const sinVincular = Array.from(select.options).find(opt => opt.value === '');
        if (sinVincular && !sinVincular.selected) {
            sinVincular.selected = true;
        }
        return;
    }
    
    const sinVincular = Array.from(select.options).find(opt => opt.value === '');
    if (sinVincular) {
        sinVincular.selected = false;
    }
    
    const primeraVinculada = solicitudes.find(s => s.id == selectedOptions[0].value);
    
    if (primeraVinculada) {
        document.getElementById('conceptoGeneral').value = primeraVinculada.conceptoGeneral;
        
        if (primeraVinculada.montoConceptoGeneral) {
            document.getElementById('montoConceptoGeneral').value = '$' + primeraVinculada.montoConceptoGeneral.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
    }
}

function toggleNumeroConsecutivo() {
    const checkbox = document.getElementById('numeroAutomatico');
    const input = document.getElementById('numeroConsecutivo');
    const sucursalSelect = document.getElementById('sucursal');
    
    if (checkbox.checked) {
        input.disabled = true;
        input.style.background = '#f8f9fa';
        input.placeholder = 'Se generará automáticamente';
        input.value = '';
        
        if (sucursalSelect.value) {
            const sucursal = sucursalSelect.value;
            const siguienteNumero = contadores[sucursal] + 1;
            input.placeholder = `Siguiente: ${siguienteNumero}`;
        }
    } else {
        input.disabled = false;
        input.style.background = 'white';
        input.placeholder = 'Ingrese el número consecutivo';
        input.value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    inicializarCamposMoneda();
    
    const sucursalSelect = document.getElementById('sucursal');
    if (sucursalSelect) {
        sucursalSelect.addEventListener('change', function() {
            const checkbox = document.getElementById('numeroAutomatico');
            if (checkbox && checkbox.checked) {
                toggleNumeroConsecutivo();
            }
            // Recargar solicitudes vinculadas al cambiar sucursal
            cargarSolicitudesVinculadas();
        });
    }
    
    const solicitudVinculadaSelect = document.getElementById('solicitudVinculada');
    if (solicitudVinculadaSelect) {
        solicitudVinculadaSelect.addEventListener('change', function() {
            cargarConceptoVinculado();
        });
    }
});

function cargarBeneficiariosSelect() {
    const select = document.getElementById('beneficiario');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione proveedor</option>';
    
    beneficiarios.forEach(beneficiario => {
        const option = document.createElement('option');
        option.value = beneficiario.id;
        option.textContent = beneficiario.nombre;
        select.appendChild(option);
    });
}

function cargarDatosBeneficiario() {
    const beneficiarioId = document.getElementById('beneficiario').value;
    if (!beneficiarioId) {
        document.getElementById('proveedor').value = '';
        document.getElementById('banco').value = '';
        document.getElementById('cuenta').value = '';
        document.getElementById('clabe').value = '';
        return;
    }
    
    const beneficiario = beneficiarios.find(b => b.id == beneficiarioId);
    if (beneficiario) {
        document.getElementById('proveedor').value = beneficiario.razonSocial || beneficiario.nombre;
        document.getElementById('banco').value = beneficiario.banco;
        document.getElementById('cuenta').value = beneficiario.cuenta;
        document.getElementById('clabe').value = beneficiario.clabe;
    }
}

function calcularTotal() {
    const subtotalInput = document.getElementById('subtotal');
    const descuentoInput = document.getElementById('descuento');
    const impuestosInput = document.getElementById('impuestos');
    const montoImpuestosInput = document.getElementById('montoImpuestos');
    const totalInput = document.getElementById('total');
    
    const subtotal = extraerValorMoneda(subtotalInput.value);
    const descuento = extraerValorMoneda(descuentoInput.value);
    const porcentajeImpuestos = parseFloat(impuestosInput.value) || 0;
    
    const baseImponible = subtotal - descuento;
    const montoImpuestos = baseImponible * (porcentajeImpuestos / 100);
    const total = baseImponible + montoImpuestos;
    
    montoImpuestosInput.value = '$' + montoImpuestos.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    totalInput.value = '$' + total.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function generarNumeroConsecutivo(sucursal, numeroIngresado) {
    const año = new Date().getFullYear();
    const numeroFormateado = numeroIngresado.toString().padStart(3, '0');
    return `${sucursal}-${numeroFormateado}-${año}`;
}

async function crearSolicitud(event) {
    event.preventDefault();
    
    const form = document.getElementById('solicitudForm');
    const editingId = form.getAttribute('data-editing-id');
    const isEditing = editingId !== null;
    
    const beneficiarioId = document.getElementById('beneficiario').value;
    const empresaId = document.getElementById('empresa').value;
    const sucursal = document.getElementById('sucursal').value;
    
    if (!beneficiarioId) {
        alert('Por favor seleccione un beneficiario');
        return;
    }
    
    if (!empresaId) {
        alert('Por favor seleccione una empresa');
        return;
    }
    
    const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) || 0;
    const montoImpuestos = extraerValorMoneda(document.getElementById('montoImpuestos').value);
    
    if (isEditing) {
        // Modo edición
        const solicitud = solicitudes.find(s => s.id == editingId);
        if (solicitud && solicitud.estado === 'pendiente') {
            solicitud.empresaId = parseInt(empresaId);
            solicitud.beneficiarioId = parseInt(beneficiarioId);
            solicitud.proveedor = document.getElementById('proveedor').value;
            solicitud.conceptoGeneral = document.getElementById('conceptoGeneral').value;
            solicitud.montoConceptoGeneral = extraerValorMoneda(document.getElementById('montoConceptoGeneral').value);
            solicitud.conceptoPago = document.getElementById('conceptoPago').value;
            solicitud.claveAnuncio = document.getElementById('claveAnuncio').value || '';
            solicitud.subtotal = extraerValorMoneda(document.getElementById('subtotal').value);
            solicitud.porcentajeImpuestos = porcentajeImpuestos;
            solicitud.impuestos = montoImpuestos;
            solicitud.total = extraerValorMoneda(document.getElementById('total').value);
            solicitud.banco = document.getElementById('banco').value;
            solicitud.cuenta = document.getElementById('cuenta').value;
            solicitud.clabe = document.getElementById('clabe').value;
            solicitud.ciudad = document.getElementById('ciudad').value;
            
            try {
                await actualizarSolicitudSupabase(solicitud);
            } catch (error) {
                console.error('Error al actualizar en Supabase:', error);
                guardarDatos();
            }
            
            alert('Solicitud actualizada exitosamente: ' + solicitud.numero);
            
            form.removeAttribute('data-editing-id');
            const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
            submitButton.textContent = 'Crear Solicitud';
            submitButton.style.background = '';
            
            limpiarFormulario();
            cargarSolicitudes();
            switchTab('solicitudes');
        }
    } else {
        // Modo creación
        const numeroAutomatico = document.getElementById('numeroAutomatico').checked;
        let numeroConsecutivo;
        
        if (numeroAutomatico) {
            numeroConsecutivo = contadores[sucursal] + 1;
        } else {
            numeroConsecutivo = parseInt(document.getElementById('numeroConsecutivo').value);
            if (!numeroConsecutivo || numeroConsecutivo < 1) {
                alert('Por favor ingrese un número consecutivo válido');
                return;
            }
        }
        
        const numero = generarNumeroConsecutivo(sucursal, numeroConsecutivo);
        
        const solicitudesVinculadasSelect = document.getElementById('solicitudVinculada');
        const solicitudesVinculadas = Array.from(solicitudesVinculadasSelect.selectedOptions)
            .map(option => option.value)
            .filter(val => val !== '');
        
        const solicitud = {
            id: Date.now(),
            numero: numero,
            numeroConsecutivo: numeroConsecutivo,
            sucursal: sucursal,
            empresaId: parseInt(empresaId),
            beneficiarioId: parseInt(beneficiarioId),
            proveedor: document.getElementById('proveedor').value,
            conceptoGeneral: document.getElementById('conceptoGeneral').value,
            montoConceptoGeneral: extraerValorMoneda(document.getElementById('montoConceptoGeneral').value),
            conceptoPago: document.getElementById('conceptoPago').value,
            claveAnuncio: document.getElementById('claveAnuncio').value || '',
            subtotal: extraerValorMoneda(document.getElementById('subtotal').value),
            descuento: 0,
            porcentajeImpuestos: porcentajeImpuestos,
            impuestos: montoImpuestos,
            total: extraerValorMoneda(document.getElementById('total').value),
            banco: document.getElementById('banco').value,
            cuenta: document.getElementById('cuenta').value,
            clabe: document.getElementById('clabe').value,
            ciudad: document.getElementById('ciudad').value,
            estado: 'pendiente',
            fechaSolicitud: new Date().toISOString(),
            fechaAutorizacion: null,
            solicitudesVinculadas: solicitudesVinculadas,
            archivos: [],
            creadoPor: usuarioActual.username
        };
        
        try {
            const solicitudGuardada = await guardarSolicitudSupabase(solicitud);
            solicitudes.push(solicitudGuardada);
            contadores[sucursal] = numeroConsecutivo;
        } catch (error) {
            console.error('Error en Supabase, guardando localmente:', error);
            solicitudes.push(solicitud);
            contadores[sucursal] = numeroConsecutivo;
            guardarDatos();
        }
        
        alert('Solicitud creada exitosamente con número: ' + numero);
        
        // Preguntar si desea crear otra solicitud
        if (confirm('¿Desea crear otra solicitud de fondos?')) {
            limpiarFormulario();
            cargarSolicitudesVinculadas();
        } else {
            limpiarFormulario();
            cargarSolicitudes();
            switchTab('solicitudes');
        }
    }
}

function limpiarFormulario() {
    document.getElementById('solicitudForm').reset();
    document.getElementById('proveedor').value = '';
    document.getElementById('banco').value = '';
    document.getElementById('cuenta').value = '';
    document.getElementById('clabe').value = '';
    document.getElementById('conceptoGeneral').value = '';
    document.getElementById('montoConceptoGeneral').value = '';
    document.getElementById('subtotal').value = '';
    document.getElementById('porcentajeAnticipo').value = '100';
    document.getElementById('impuestos').value = '16';
    document.getElementById('montoImpuestos').value = '';
    document.getElementById('total').value = '';
    document.getElementById('claveAnuncio').value = '';
    document.getElementById('numeroAutomatico').checked = true;
    toggleNumeroConsecutivo();
    
    const solicitudVinculadaSelect = document.getElementById('solicitudVinculada');
    if (solicitudVinculadaSelect) {
        Array.from(solicitudVinculadaSelect.options).forEach((opt, index) => {
            opt.selected = (opt.value === '');
        });
    }
}

function cargarSolicitudes() {
    const tbody = document.querySelector('#solicitudesTable tbody');
    tbody.innerHTML = '';
    
    // Filtrar solicitudes según permisos
    let solicitudesFiltradas = solicitudes;
    
    if (usuarioActual.rol === 'jefe' && usuarioActual.sucursal) {
        solicitudesFiltradas = solicitudes.filter(s => s.sucursal === usuarioActual.sucursal);
    } else if (!tienePermiso('ver_todas_solicitudes')) {
        if (usuarioActual.sucursal) {
            solicitudesFiltradas = solicitudes.filter(s => s.sucursal === usuarioActual.sucursal);
        }
    }
    
    solicitudesFiltradas.forEach(solicitud => {
        const empresa = empresas.find(e => e.id === solicitud.empresaId);
        const row = tbody.insertRow();
        
        const tieneComprobante = solicitud.comprobantePago ? true : false;
        const iconoComprobante = tieneComprobante ? '📄' : '';
        
        // Botones según permisos
        const puedeEditar = tienePermiso('editar_solicitud') && solicitud.estado === 'pendiente';
        const puedeAutorizar = tienePermiso('autorizar_solicitud') && solicitud.estado === 'pendiente';
        const puedeCancelar = tienePermiso('cancelar_solicitud');
        
        const botonesAccion = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; max-width: 140px;">
                <button class="btn" onclick="verDetalle(${solicitud.id})" 
                        style="padding: 5px; font-size: 16px; background: #5a6268; color: white;" title="Ver detalle">
                    ●
                </button>
                ${puedeEditar ? 
                    `<button class="btn" onclick="editarSolicitud(${solicitud.id})" 
                            style="padding: 5px; font-size: 16px; background: #b8860b; color: white;" title="Editar">
                        ✎
                    </button>` : 
                    `<button class="btn" disabled 
                            style="padding: 5px; font-size: 16px; background: #d0d0d0; color: #808080; cursor: not-allowed; opacity: 0.6;" title="No editable">
                        ✎
                    </button>`}
                ${puedeAutorizar ? 
                    `<button class="btn" onclick="autorizarSolicitud(${solicitud.id})" 
                            style="padding: 5px; font-size: 16px; background: #5a8a5a; color: white;" title="Autorizar">
                        ✓
                    </button>` : 
                    `<button class="btn" disabled 
                            style="padding: 5px; font-size: 16px; background: #d0d0d0; color: #808080; cursor: not-allowed; opacity: 0.6;" title="No autorizable">
                        ✓
                    </button>`}
                ${puedeCancelar ?
                    `<button class="btn" onclick="cancelarSolicitud(${solicitud.id})" 
                            style="padding: 5px; font-size: 16px; background: #a05050; color: white;" title="Cancelar">
                        ✕
                    </button>` :
                    `<button class="btn" disabled 
                            style="padding: 5px; font-size: 16px; background: #d0d0d0; color: #808080; cursor: not-allowed; opacity: 0.6;" title="No puede cancelar">
                        ✕
                    </button>`}
            </div>
        `;
        
        const columnaPagada = tienePermiso('marcar_pagada') ? `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" ${solicitud.pagada ? 'checked' : ''} 
                           onchange="marcarComoPagada(${solicitud.id}, this.checked)"
                           style="cursor: pointer;">
                    <span style="font-size: 11px;">${solicitud.pagada ? 'Sí' : 'No'}</span>
                </label>
                ${tienePermiso('gestionar_comprobantes') ?
                    `<button class="btn" onclick="gestionarComprobantePago(${solicitud.id})" 
                            style="padding: 3px 8px; font-size: 10px; background: #4682b4; color: white;">
                        ${iconoComprobante} Comprobante
                    </button>` : ''}
            </div>
        ` : `<span style="font-size: 11px;">${solicitud.pagada ? 'Sí' : 'No'}</span>`;
        
        // Columna de Origen con información agrupada
        const columnaOrigen = `
            <div style="font-size: 13px; line-height: 1.5;">
                <div style="font-weight: 600; color: var(--primary-color);">${solicitud.numero}</div>
                <div style="color: #6c757d; font-size: 12px;">${getSucursalName(solicitud.sucursal)}</div>
                <div style="color: #495057; font-size: 12px;">${empresa ? empresa.razonSocial : 'N/A'}</div>
            </div>
        `;
        
        row.innerHTML = `
            <td style="min-width: 180px;">${columnaOrigen}</td>
            <td>${solicitud.proveedor}</td>
            <td style="min-width: 200px;">${solicitud.conceptoGeneral.substring(0, 60)}${solicitud.conceptoGeneral.length > 60 ? '...' : ''}</td>
            <td style="white-space: nowrap;">$${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
            <td><span class="status ${solicitud.estado}">${solicitud.estado.toUpperCase()}</span></td>
            <td style="white-space: nowrap;">${formatearFecha(solicitud.fechaSolicitud)}</td>
            <td>${columnaPagada}</td>
            <td class="acciones-column">${botonesAccion}</td>
        `;
    });
}

function exportarSolicitudesCSV() {
    if (solicitudes.length === 0) {
        alert('No hay solicitudes para exportar');
        return;
    }
    
    // Definir encabezados del CSV
    const headers = [
        'Número',
        'Fecha Solicitud',
        'Sucursal',
        'Empresa',
        'RFC Empresa',
        'Proveedor',
        'RFC Proveedor',
        'Concepto General',
        'Monto Total Concepto',
        'Concepto Pago',
        'Monto Pago',
        'Subtotal',
        'Descuento',
        'Impuestos %',
        'Monto Impuestos',
        'Total a Pagar',
        'Banco',
        'Cuenta',
        'CLABE',
        'Ciudad',
        'Estado',
        'Fecha Autorización',
        'Clave Anuncio',
        'Creado Por'
    ];
    
    // Crear filas de datos
    const filas = solicitudes.map(sol => {
        const empresa = empresas.find(e => e.id === sol.empresaId);
        const proveedor = beneficiarios.find(p => p.id === sol.beneficiarioId);
        
        return [
            sol.numero || '',
            formatearFecha(sol.fechaSolicitud),
            getSucursalName(sol.sucursal),
            empresa ? empresa.razonSocial : '',
            empresa ? empresa.rfc : '',
            proveedor ? proveedor.nombre : sol.proveedor,
            proveedor ? proveedor.rfc : '',
            `"${(sol.conceptoGeneral || '').replace(/"/g, '""')}"`,
            sol.montoConceptoGeneral || 0,
            `"${(sol.conceptoPago || '').replace(/"/g, '""')}"`,
            sol.subtotal || 0,
            sol.subtotal || 0,
            sol.descuento || 0,
            sol.porcentajeImpuestos || 0,
            sol.impuestos || 0,
            sol.total || 0,
            sol.banco || '',
            sol.cuenta || '',
            sol.clabe || '',
            sol.ciudad || '',
            sol.estado || '',
            formatearFecha(sol.fechaAutorizacion),
            sol.claveAnuncio || '',
            sol.creadoPor || ''
        ];
    });
    
    // Construir contenido CSV
    let csvContent = headers.join(',') + '\n';
    filas.forEach(fila => {
        csvContent += fila.join(',') + '\n';
    });
    
    // Crear blob y descargar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `solicitudes_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Archivo CSV descargado exitosamente');
}

function editarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (!solicitud || solicitud.estado !== 'pendiente') {
        alert('Solo se pueden editar solicitudes con estado pendiente');
        return;
    }
    
    // Cambiar a la pestaña de nueva solicitud
    switchTab('nueva');
    
    // Cargar los datos de la solicitud en el formulario
    document.getElementById('empresa').value = solicitud.empresaId;
    document.getElementById('sucursal').value = solicitud.sucursal;
    document.getElementById('beneficiario').value = solicitud.beneficiarioId;
    
    // Cargar datos del beneficiario
    cargarDatosBeneficiario();
    
    document.getElementById('conceptoGeneral').value = solicitud.conceptoGeneral;
    document.getElementById('montoConceptoGeneral').value = '$' + solicitud.montoConceptoGeneral.toLocaleString('es-MX', {minimumFractionDigits: 2});
    document.getElementById('conceptoPago').value = solicitud.conceptoPago || '';
    document.getElementById('claveAnuncio').value = solicitud.claveAnuncio || '';
    document.getElementById('subtotal').value = '$' + solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2});
    document.getElementById('descuento').value = '$' + solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2});
    document.getElementById('impuestos').value = solicitud.porcentajeImpuestos;
    document.getElementById('ciudad').value = solicitud.ciudad;
    
    // Calcular total
    calcularTotal();
    
    // Marcar que estamos editando (guardar el ID)
    document.getElementById('solicitudForm').setAttribute('data-editing-id', id);
    
    // Cambiar el texto del botón
    const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
    submitButton.textContent = 'Actualizar Solicitud';
    submitButton.style.background = '#ffc107';
    
    alert('Editando solicitud ' + solicitud.numero + '. Modifique los campos necesarios y presione "Actualizar Solicitud"');
}

// SECCIÓN 2 - Visualización y PDF Mejorado

function verDetalle(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (!solicitud) return;
    
    const modal = document.getElementById('detalleModal');
    const content = document.getElementById('modalContent');
    const title = document.getElementById('modalTitle');
    const actions = document.getElementById('modalActions');
    
    title.textContent = `Solicitud ${solicitud.numero}`;
    
    const empresa = empresas.find(e => e.id === solicitud.empresaId);
    const proveedor = beneficiarios.find(p => p.id === solicitud.beneficiarioId);
    
    // Determinar qué logo mostrar según la empresa
    let logoHTML = '';
    if (empresa) {
        const nombreEmpresa = empresa.razonSocial.toUpperCase();
        if (nombreEmpresa.includes('A.T.M. ESPECTACULARES') || nombreEmpresa.includes('ATM ESPECTACULARES')) {
            logoHTML = '<img src="assets/img/logo-atm.png" alt="ATM Espectaculares" style="max-width: 173px; height: auto;" onerror="this.style.display=\'none\'">';
        } else if (nombreEmpresa.includes('ANUNCIOS TECNICOS MOCTEZUMA') || nombreEmpresa.includes('ANUNCIOS TÉCNICOS MOCTEZUMA')) {
            logoHTML = '<img src="assets/img/logo-anuncios.png" alt="Anuncios Técnicos Moctezuma" style="max-width: 173px; height: auto;" onerror="this.style.display=\'none\'">';
        } else if (nombreEmpresa.includes('DESPACHO S/C')) {
            logoHTML = '<div style="font-size: 32px; font-weight: bold; color: #333; padding: 20px;">DESPACHO S/C</div>';
        } else {
            logoHTML = `<div style="font-size: 24px; font-weight: bold; color: #333; padding: 20px;">${empresa.razonSocial}</div>`;
        }
    }
    
    // Generar tabla de solicitudes vinculadas
    let htmlVinculadas = '';
    
    // Buscar todas las solicitudes que compartan el mismo concepto general
    const solicitudesRelacionadas = solicitudes.filter(sol => 
        sol.conceptoGeneral === solicitud.conceptoGeneral && sol.estado !== 'cancelada');
    
    // SIEMPRE mostrar la tabla (incluso si solo hay una solicitud)
    const totalPagosRealizados = solicitudesRelacionadas
        .reduce((sum, sol) => sum + sol.subtotal, 0);
    
    const montoPendiente = (solicitud.montoConceptoGeneral || 0) - totalPagosRealizados;
    
    htmlVinculadas = `
        <div style="margin: 8px 0; padding: 6px; background: #f8f9fa; border: 1px solid #d01f34;">
            <strong style="font-size: 9px; display: block; margin-bottom: 4px;">DESGLOSE DE PAGOS DEL CONCEPTO GENERAL:</strong>
            <table style="width: 100%; font-size: 9px; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e0e0e0;">
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Fecha</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Número</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Concepto de Pago</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: right;">Monto de Pago</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: center;">Estatus</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (solicitudesRelacionadas.length > 0) {
        solicitudesRelacionadas.forEach(sol => {
            const estadoTexto = sol.estado === 'autorizada' ? 'Aprobada' : 'Pendiente';
            const esActual = sol.id === solicitud.id;
            const estiloFila = esActual ? 'background: #fffacd; font-weight: bold;' : '';
            
            htmlVinculadas += `
                <tr style="${estiloFila}">
                    <td style="padding: 3px; border: 1px solid #ccc;">${formatearFecha(sol.fechaSolicitud)}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;">${sol.numero}${esActual ? ' (Actual)' : ''}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;">${sol.conceptoPago || 'N/A'}</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: right;">$${sol.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: center;">${estadoTexto}</td>
                </tr>
            `;
        });
    } else {
        htmlVinculadas += `
            <tr>
                <td colspan="5" style="padding: 3px; border: 1px solid #ccc; text-align: center; color: #999;">
                    No hay pagos registrados para este concepto
                </td>
            </tr>
        `;
    }
    
    htmlVinculadas += `
                <tr style="background: #fff3cd; font-weight: bold;">
                    <td colspan="3" style="padding: 3px; border: 1px solid #ccc; text-align: right;">MONTO PENDIENTE DE PAGO:</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: right;">$${montoPendiente.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;"></td>
                </tr>
            </tbody>
        </table>
        </div>
    `;
    
    content.innerHTML = `
        <div id="contenidoImprimible" style="font-family: Arial, sans-serif; padding: 10px; max-width: 750px; margin: 0 auto; background: white;">
            
            <div style="text-align: center; margin-bottom: 8px;">
                ${logoHTML}
            </div>
            
            <!-- Sección de Empresa separada -->
            <div style="background: #f5f5f5; padding: 8px; margin-bottom: 10px; border: 2px solid #606060; text-align: center;">
                <table style="width: 100%; font-size: 9px;">
                    <colgroup>
                        <col style="width: 35%;">
                        <col style="width: 65%;">
                    </colgroup>
                    <tr>
                        <td style="padding: 3px;"><strong>EMPRESA:</strong> ${empresa ? empresa.razonSocial : 'N/A'}</td>
                        <td style="padding: 3px;"><strong>RFC:</strong> ${empresa ? empresa.rfc : 'N/A'}</td>
                    </tr>
                </table>
            </div>
            
            <div style="border: 2px solid #d01f34; padding: 10px; margin-bottom: 10px;">
                <div style="border: 1px solid #606060; padding: 8px;">
                    <h2 style="text-align: center; color: #d01f34; margin: 0 0 4px 0; font-size: 14px;">SOLICITUD DE FONDOS</h2>
                    <h3 style="text-align: center; color: #606060; margin: 0; font-size: 11px;">${solicitud.numero}</h3>
                    <hr style="border: none; border-top: 1px solid #d01f34; margin: 6px 0;">
                    
                    <div style="background: #f5f5f5; padding: 8px; margin: 5px 0; border: 1px solid #606060;">
                        <table style="width: 100%; font-size: 8px;">
                        <colgroup>
                            <col style="width: 35%;">
                            <col style="width: 65%;">
                        </colgroup>    
                        <tr>
                                <td style="padding: 2px;"><strong>FECHA:</strong></td>
                                <td style="padding: 2px;">${formatearFecha(solicitud.fechaSolicitud)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px;"><strong>SUCURSAL:</strong></td>
                                <td style="padding: 2px;">${getSucursalName(solicitud.sucursal)}</td>
                            </tr>
                            ${solicitud.claveAnuncio ? `
                            <tr>
                                <td style="padding: 2px;"><strong>CLAVE ANUNCIO:</strong></td>
                                <td style="padding: 2px;">${solicitud.claveAnuncio}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                    
                    ${htmlVinculadas}
                    
                    <!-- PROVEEDOR -->
                    <div style="margin: 8px 0;">
                        <div style="background: #d01f34; color: white; padding: 4px; font-weight: bold; font-size: 9px;">PROVEEDOR</div>
                        <div style="padding: 6px; border: 1px solid #606060; border-top: none; background: #fafafa;">
                            <table style="width: 100%; font-size: 8px; table-layout: fixed;">
                                <colgroup>
                                    <col style="width: 35%;">
                                    <col style="width: 65%;">
                                </colgroup>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>NOMBRE:</strong></td>
                                    <td style="padding: 2px; word-wrap: break-word;">${proveedor ? proveedor.nombre : solicitud.proveedor}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>RAZÓN SOCIAL:</strong></td>
                                    <td style="padding: 2px; word-wrap: break-word;">${proveedor ? proveedor.razonSocial : solicitud.proveedor}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>RFC:</strong></td>
                                    <td style="padding: 2px;">${proveedor ? proveedor.rfc : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>BANCO:</strong></td>
                                    <td style="padding: 2px;">${solicitud.banco}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>CUENTA:</strong></td>
                                    <td style="padding: 2px;">${solicitud.cuenta}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>CLABE:</strong></td>
                                    <td style="padding: 2px;">${solicitud.clabe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>CIUDAD:</strong></td>
                                    <td style="padding: 2px;">${solicitud.ciudad}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- CONCEPTO -->
                    <div style="margin: 8px 0;">
                        <div style="background: #d01f34; color: white; padding: 4px; font-weight: bold; font-size: 9px;">CONCEPTO</div>
                        <div style="padding: 6px; border: 1px solid #606060; border-top: none; background: #fafafa;">
                            <table style="width: 100%; font-size: 8px; table-layout: fixed;">
                                <colgroup>
                                    <col style="width: 35%;">
                                    <col style="width: 65%;">
                                </colgroup>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>CONCEPTO GENERAL:</strong></td>
                                    <td style="padding: 2px; word-wrap: break-word;">${solicitud.conceptoGeneral}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>MONTO TOTAL DEL CONCEPTO:</strong></td>
                                    <td style="padding: 2px;">$${(solicitud.montoConceptoGeneral || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                ${solicitud.conceptoPago ? `
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>CONCEPTO DE PAGO:</strong></td>
                                    <td style="padding: 2px; word-wrap: break-word;">${solicitud.conceptoPago}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Monto del Concepto de Pago:</strong></td>
                                    <td style="padding: 2px;">$${solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                ` : `
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Monto del Concepto de Pago:</strong></td>
                                    <td style="padding: 2px;">$${solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                `}
                            </table>
                        </div>
                    </div>
                    
                    <!-- MONTOS -->
                    <div style="margin: 8px 0;">
                        <div style="background: #d01f34; color: white; padding: 4px; font-weight: bold; font-size: 9px;">MONTOS</div>
                        <div style="padding: 6px; border: 1px solid #606060; border-top: none; background: #fafafa;">
                            <table style="width: 100%; font-size: 8px; table-layout: fixed;">
                                <colgroup>
                                    <col style="width: 35%;">
                                    <col style="width: 65%;">
                                </colgroup>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Subtotal:</strong></td>
                                    <td style="padding: 2px;">$${solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Descuento:</strong></td>
                                    <td style="padding: 2px;">$${solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Impuestos (${solicitud.porcentajeImpuestos || 0}%):</strong></td>
                                    <td style="padding: 2px;">$${(solicitud.impuestos || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr style="font-weight: bold; font-size: 9px; background: #f0f0f0;">
                                    <td style="padding: 3px; vertical-align: top;"><strong>TOTAL A PAGAR:</strong></td>
                                    <td style="padding: 3px;">$${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #d01f34; margin: 6px 0;">
                    
                    <div style="font-size: 8px; margin: 6px 0;">
                        <p style="margin: 2px 0;"><strong>Estado:</strong> <span class="status ${solicitud.estado}" style="display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 8px;">${solicitud.estado.toUpperCase()}</span></p>
                        <p style="margin: 2px 0;"><strong>Fecha de solicitud:</strong> ${formatearFecha(solicitud.fechaSolicitud)}</p>
                        ${solicitud.fechaAutorizacion ? `<p style="margin: 2px 0;"><strong>Fecha de autorización:</strong> ${formatearFecha(solicitud.fechaAutorizacion)}</p>` : ''}
                        ${solicitud.archivos && solicitud.archivos.length > 0 ? `<p style="margin: 2px 0;"><strong>Archivos adjuntos:</strong> ${solicitud.archivos.length} archivo(s)</p>` : ''}
                    </div>
                    
                    <div style="margin-top: 12px; text-align: center;">
                        <div style="border: 1px solid #606060; width: 200px; height: 40px; margin: 0 auto;"></div>
                        <p style="margin: 4px 0 0 0; font-weight: bold; font-size: 8px;">Gerente de Sucursales</p>
                        <p style="margin: 2px 0 0 0; font-size: 7px;">Sergio Maurer</p>
                    </div>
                    
                </div>
            </div>
            
        </div>
    `;
    
    actions.innerHTML = `
        <button class="btn" onclick="imprimirSolicitud()" style="padding: 10px 20px;">
            <span style="font-size: 16px;">🖨️</span> Imprimir
        </button>
        <button class="btn btn-secondary" onclick="cerrarModal()">Cerrar</button>
    `;
    
    modal.style.display = 'block';
}

function imprimirSolicitud() {
    const contenido = document.getElementById('contenidoImprimible');
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Imprimir Solicitud</title>
            <style>
                @media print {
                    body {
                        margin: 0;
                        padding: 10px;
                    }
                    @page {
                        margin: 0.5cm;
                        size: letter;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 10px;
                }
                table {
                    border-collapse: collapse;
                }
                .status {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 8px;
                    font-weight: bold;
                }
                .status.pendiente {
                    background: #fff3cd;
                    color: #856404;
                }
                .status.autorizada {
                    background: #d4edda;
                    color: #155724;
                }
                .status.cancelada {
                    background: #f8d7da;
                    color: #721c24;
                }
                img {
                    max-width: 173px;
                    height: auto;
                }
            </style>
        </head>
        <body>
            ${contenido.innerHTML}
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
}

function cerrarModal() {
    document.getElementById('detalleModal').style.display = 'none';
}

async function autorizarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud && solicitud.estado === 'pendiente') {
        if (confirm('¿Está seguro de autorizar esta solicitud?')) {
            solicitud.estado = 'autorizada';
            solicitud.fechaAutorizacion = new Date().toISOString();
            
            await actualizarSolicitudSupabase(solicitud);
            await cargarDatosDesdeSupabase();
            cargarSolicitudes();
            alert('Solicitud autorizada exitosamente');
        }
    }
}

async function cancelarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud && solicitud.estado !== 'cancelada') {
        if (confirm('¿Está seguro de cancelar esta solicitud?')) {
            solicitud.estado = 'cancelada';
            
            await actualizarSolicitudSupabase(solicitud);
            await cargarDatosDesdeSupabase();
            cargarSolicitudes();
            alert('Solicitud cancelada');
        }
    }
}

function descargarPDF(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (!solicitud) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const empresa = empresas.find(e => e.id === solicitud.empresaId);
    const proveedor = beneficiarios.find(p => p.id === solicitud.beneficiarioId);
    
    const colorPrincipal = [208, 31, 52];
    const colorGris = [96, 96, 96];
    const colorBlanco = [255, 255, 255];
    
    doc.setDrawColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.setLineWidth(3);
    doc.rect(10, 10, 190, 277);
    
    doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 267);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.text('SOLICITUD DE FONDOS', 105, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text(solicitud.numero, 105, 40, { align: 'center' });

    doc.setDrawColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let yPos = 55;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, 170, 49, 'F');
    doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.rect(20, yPos - 5, 170, 49);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('EMPRESA:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(empresa ? empresa.razonSocial : 'N/A', 50, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text('RFC:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(empresa ? empresa.rfc : 'N/A', 50, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text('PROVEEDOR:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(proveedor ? proveedor.nombre : solicitud.proveedor, 55, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text('RAZÓN SOCIAL:', 25, yPos);
    doc.setFont("helvetica", "normal");
    const razonSocialText = proveedor ? proveedor.razonSocial : solicitud.proveedor;
    const razonSocialLines = doc.splitTextToSize(razonSocialText, 120);
    doc.text(razonSocialLines, 60, yPos);
    yPos += (razonSocialLines.length - 1) * 5;
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text('FECHA:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(solicitud.fechaSolicitud).toLocaleDateString('es-MX'), 50, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text('SUCURSAL:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(getSucursalName(solicitud.sucursal), 55, yPos);

    if (solicitud.claveAnuncio) {
        yPos += 7;
        doc.setFont("helvetica", "bold");
        doc.text('CLAVE ANUNCIO:', 25, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(solicitud.claveAnuncio, 65, yPos);
    }

    yPos += 15;
    doc.setFillColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(colorBlanco[0], colorBlanco[1], colorBlanco[2]);
    doc.setFont("helvetica", "bold");
    doc.text('CONCEPTO', 25, yPos);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text('Concepto General:', 25, yPos);
    doc.setFont("helvetica", "normal");
    const conceptoLines = doc.splitTextToSize(solicitud.conceptoGeneral, 160);
    doc.text(conceptoLines, 25, yPos + 5);
    yPos += conceptoLines.length * 5 + 10;

    doc.setFont("helvetica", "bold");
    doc.text('Monto Total del Concepto General:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text('$' + (solicitud.montoConceptoGeneral || 0).toLocaleString('es-MX', {minimumFractionDigits: 2}), 90, yPos);
    yPos += 7;

    if (solicitud.conceptoPago) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text('Concepto de Pago Específico:', 25, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const conceptoPagoLines = doc.splitTextToSize(solicitud.conceptoPago, 160);
        doc.text(conceptoPagoLines, 25, yPos);
        yPos += conceptoPagoLines.length * 5 + 5;
    }

    yPos += 5;
    doc.setFillColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(colorBlanco[0], colorBlanco[1], colorBlanco[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text('MONTOS', 25, yPos);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    
    yPos += 10;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, yPos - 5, 170, 30, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, yPos - 5, 170, 30);
    
    doc.setFont("helvetica", "normal");
    doc.text('Monto del Concepto de Pago:', 25, yPos);
    doc.text('$' + solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2}), 160, yPos, { align: 'right' });
    
    yPos += 7;
    doc.text('Descuento:', 25, yPos);
    doc.text('$' + solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2}), 160, yPos, { align: 'right' });
    
    yPos += 7;
    doc.text(`Impuestos (${solicitud.porcentajeImpuestos || 0}%):`, 25, yPos);
    doc.text('$' + (solicitud.impuestos || 0).toLocaleString('es-MX', {minimumFractionDigits: 2}), 160, yPos, { align: 'right' });
    
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('TOTAL A PAGAR:', 25, yPos);
    doc.text('$' + solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2}), 160, yPos, { align: 'right' });

    yPos += 15;
    doc.setFillColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(colorBlanco[0], colorBlanco[1], colorBlanco[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text('DATOS BANCARIOS', 25, yPos);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.text('Banco:', 25, yPos);
    doc.text(solicitud.banco, 50, yPos);
    
    yPos += 7;
    doc.text('Cuenta:', 25, yPos);
    doc.text(solicitud.cuenta, 50, yPos);
    
    yPos += 7;
    doc.text('CLABE:', 25, yPos);
    doc.text(solicitud.clabe, 50, yPos);
    
    yPos += 7;
    doc.text('Ciudad:', 25, yPos);
    doc.text(solicitud.ciudad, 50, yPos);

    yPos += 15;
    doc.setDrawColor(colorPrincipal[0], colorPrincipal[1], colorPrincipal[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text('Estado:', 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(solicitud.estado.toUpperCase(), 50, yPos);

    yPos = 250;
    doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.setLineWidth(0.5);
    doc.rect(50, yPos, 110, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Gerente de Sucursales', 105, yPos + 25, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text('Sergio Maurer', 105, yPos + 30, { align: 'center' });

    doc.save(`Solicitud_${solicitud.numero}.pdf`);
}

// SECCIÓN 3 - Seguimiento con Archivos

function buscarPorConcepto() {
    const concepto = document.getElementById('buscarConcepto').value.toLowerCase();
    const resultados = document.getElementById('seguimientoResultados');
    
    if (!concepto.trim()) {
        resultados.innerHTML = '<p>Por favor ingrese un concepto para buscar.</p>';
        return;
    }

    const solicitudesEncontradas = solicitudes.filter(s => 
        s.conceptoGeneral.toLowerCase().includes(concepto)
    );

    if (solicitudesEncontradas.length === 0) {
        resultados.innerHTML = '<p>No se encontraron solicitudes con ese concepto.</p>';
        return;
    }

    const grupos = {};
    solicitudesEncontradas.forEach(sol => {
        if (!grupos[sol.conceptoGeneral]) {
            grupos[sol.conceptoGeneral] = [];
        }
        grupos[sol.conceptoGeneral].push(sol);
    });

    let html = '';
    Object.keys(grupos).forEach(conceptoGeneral => {
        const solicitudesGrupo = grupos[conceptoGeneral];
        const totalPagado = solicitudesGrupo
            .filter(s => s.estado === 'autorizada')
            .reduce((sum, s) => sum + s.total, 0);
        const totalPendiente = solicitudesGrupo
            .filter(s => s.estado === 'pendiente')
            .reduce((sum, s) => sum + s.total, 0);

        html += `
            <div class="tracking-section">
                <h4>${conceptoGeneral}</h4>
                <div class="amount-summary">
                    <span>Total Pagado: $${totalPagado.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    <span>Total Pendiente: $${totalPendiente.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                </div>
                <table style="width: 100%; margin-top: 10px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th>Número</th>
                            <th>Concepto General</th>
                            <th>Concepto Pago</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Archivos</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        solicitudesGrupo.forEach(sol => {
            const numArchivos = sol.archivos ? sol.archivos.length : 0;
            html += `
                <tr>
                    <td>${sol.numero}</td>
                    <td>${sol.conceptoGeneral.substring(0, 40)}...</td>
                    <td>${sol.conceptoPago || 'N/A'}</td>
                    <td>$${sol.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td><span class="status ${sol.estado}">${sol.estado.toUpperCase()}</span></td>
                    <td>${formatearFecha(sol.fechaSolicitud)}</td>
                    <td>
                        <button class="btn" onclick="gestionarArchivos(${sol.id})" style="padding: 5px 10px; font-size: 11px;">
                            ${numArchivos > 0 ? `Archivos (${numArchivos})` : 'Subir'}
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    });

    resultados.innerHTML = html;
}

function gestionarArchivos(solicitudId) {
    solicitudActualArchivos = solicitudId;
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) return;
    
    const modal = document.getElementById('archivosModal');
    const info = document.getElementById('archivosSolicitudInfo');
    const lista = document.getElementById('listaArchivos');
    
    info.innerHTML = `<p><strong>Solicitud:</strong> ${solicitud.numero}</p><p><strong>Concepto:</strong> ${solicitud.conceptoGeneral}</p>`;
    
    if (!solicitud.archivos) {
        solicitud.archivos = [];
    }
    
    const puedeDescargar = usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'coordinador');
    
    let htmlArchivos = '<h4>Archivos Subidos:</h4>';
    if (solicitud.archivos.length === 0) {
        htmlArchivos += '<p>No hay archivos subidos</p>';
    } else {
        solicitud.archivos.forEach((archivo, index) => {
            htmlArchivos += `
                <div class="archivo-item">
                    <span>${archivo.nombre} <small style="color: #999;">(${formatearFecha(archivo.fecha)})</small></span>
                    <div>
                        ${puedeDescargar ? 
                            `<button class="btn btn-secondary" onclick="descargarArchivo(${solicitudId}, ${index})" style="padding: 5px 10px; font-size: 12px;">Descargar</button>
                            <button class="btn btn-danger" onclick="eliminarArchivo(${solicitudId}, ${index})" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>` : 
                            '<span style="color: #999; font-size: 12px;">Solo admin/coordinador puede descargar</span>'}
                    </div>
                </div>
            `;
        });
    }
    
    lista.innerHTML = htmlArchivos;
    modal.style.display = 'block';
}

function subirArchivos() {
    const input = document.getElementById('archivosFactura');
    const files = input.files;
    
    if (files.length === 0) {
        alert('Por favor seleccione al menos un archivo');
        return;
    }
    
    const solicitud = solicitudes.find(s => s.id === solicitudActualArchivos);
    if (!solicitud) return;
    
    if (!solicitud.archivos) {
        solicitud.archivos = [];
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            solicitud.archivos.push({
                nombre: file.name,
                tipo: file.type,
                datos: e.target.result,
                fecha: new Date().toISOString()
                });
            
            if (i === files.length - 1) {
                alert(`${files.length} archivo(s) subido(s) exitosamente`);
                gestionarArchivos(solicitudActualArchivos);
                input.value = '';
            }
        };
        
        reader.readAsDataURL(file);
    }
}

function descargarArchivo(solicitudId, archivoIndex) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !solicitud.archivos || !solicitud.archivos[archivoIndex]) return;
    
    const archivo = solicitud.archivos[archivoIndex];
    const link = document.createElement('a');
    link.href = archivo.datos;
    link.download = archivo.nombre;
    link.click();
}

function eliminarArchivo(solicitudId, archivoIndex) {
    if (!confirm('¿Está seguro de eliminar este archivo?')) return;
    
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !solicitud.archivos) return;
    
    solicitud.archivos.splice(archivoIndex, 1);
    gestionarArchivos(solicitudId);
    alert('Archivo eliminado exitosamente');
}

function cerrarModalArchivos() {
    document.getElementById('archivosModal').style.display = 'none';
    solicitudActualArchivos = null;
}

// SECCIÓN 4 - Gestión de usuario

function cargarUsuarios() {
    const tbody = document.querySelector('#usuariosTable tbody');
    tbody.innerHTML = '';
    
    Object.keys(usuarios).forEach(username => {
        const usuario = usuarios[username];
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${username}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.sucursal ? getSucursalName(usuario.sucursal) : 'N/A'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarUsuario('${username}')" style="padding: 5px 10px; font-size: 12px;">Editar</button>
                ${username !== 'admin_unico' ? `<button class="btn btn-danger" onclick="eliminarUsuario('${username}')" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>` : ''}
            </td>
        `;
    });
}

function mostrarFormularioUsuario(username = null) {
    if (!tienePermiso('gestionar_usuarios')) {
        alert('No tiene permisos para gestionar usuarios');
        return;
    }
    
    const modal = document.getElementById('usuarioModal');
    const title = document.getElementById('usuarioModalTitle');
    const form = document.getElementById('usuarioForm');
    const rolSelect = document.getElementById('usuarioRol');
    
    form.reset();
    editandoUsuario = username;
    
    // Cargar roles dinámicamente
    rolSelect.innerHTML = '<option value="">Seleccione rol</option>';
    Object.keys(rolesConfig).forEach(codigoRol => {
        const option = document.createElement('option');
        option.value = codigoRol;
        option.textContent = rolesConfig[codigoRol].nombre;
        rolSelect.appendChild(option);
    });
    
    if (username) {
        title.textContent = 'Editar Usuario';
        const usuario = usuarios[username];
        document.getElementById('usuarioUsername').value = username;
        document.getElementById('usuarioUsername').readOnly = true;
        document.getElementById('usuarioNombre').value = usuario.nombre;
        document.getElementById('usuarioPassword').value = usuario.password;
        document.getElementById('usuarioRol').value = usuario.rol;
        document.getElementById('usuarioSucursal').value = usuario.sucursal || '';
        toggleSucursalField();
    } else {
        title.textContent = 'Nuevo Usuario';
        document.getElementById('usuarioUsername').readOnly = false;
    }
    
    modal.style.display = 'block';
}

function editarUsuario(username) {
    mostrarFormularioUsuario(username);
}

function eliminarUsuario(username) {
    if (username === 'admin_unico') {
        alert('No se puede eliminar el usuario administrador principal');
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el usuario ${username}?`)) {
        delete usuarios[username];
        guardarUsuariosEnStorage();
        cargarUsuarios();
        alert('Usuario eliminado exitosamente');
    }
}

function toggleSucursalField() {
    const rol = document.getElementById('usuarioRol').value;
    const sucursalGroup = document.getElementById('usuarioSucursalGroup');
    const sucursalSelect = document.getElementById('usuarioSucursal');
    
    if (rol && rolesConfig[rol] && rolesConfig[rol].requiereSucursal) {
        sucursalGroup.style.display = 'block';
        sucursalSelect.required = true;
    } else {
        sucursalGroup.style.display = 'none';
        sucursalSelect.required = false;
        sucursalSelect.value = '';
    }
}

function guardarUsuario(event) {
    event.preventDefault();
    
    const username = document.getElementById('usuarioUsername').value;
    const nombre = document.getElementById('usuarioNombre').value;
    const password = document.getElementById('usuarioPassword').value;
    const rol = document.getElementById('usuarioRol').value;
    const sucursal = document.getElementById('usuarioSucursal').value || null;
    
    if (!editandoUsuario && usuarios[username]) {
        alert('El usuario ya existe');
        return;
    }
    
    usuarios[username] = {
        password: password,
        rol: rol,
        sucursal: sucursal,
        nombre: nombre
    };
    
    guardarUsuariosEnStorage();
    
    cerrarModalUsuario();
    cargarUsuarios();
    alert(editandoUsuario ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
}

function cerrarModalUsuario() {
    document.getElementById('usuarioModal').style.display = 'none';
    editandoUsuario = null;
}

// SECCIÓN 5 - Gestión de beneficiarios

function verificarPermisoAdmin() {
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
        alert('No tiene permisos para realizar esta acción');
        return false;
    }
    return true;
}

function cargarProveedores() {
    const tbody = document.querySelector('#proveedoresTable tbody');
    tbody.innerHTML = '';
    
    beneficiarios.forEach(proveedor => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <strong>${proveedor.nombre}</strong>
                ${proveedor.razonSocial ? `<br><small style="color: #666;">${proveedor.razonSocial}</small>` : ''}
            </td>
            <td>${proveedor.rfc || 'N/A'}</td>
            <td>${proveedor.banco}</td>
            <td>${proveedor.cuenta}</td>
            <td>${proveedor.clabe}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarProveedor(${proveedor.id})" style="padding: 5px 10px; font-size: 12px;">Editar</button>
                <button class="btn" onclick="gestionarCSF(${proveedor.id})" style="padding: 5px 10px; font-size: 12px; background: #17a2b8;">CSF</button>
                <button class="btn btn-danger" onclick="eliminarProveedor(${proveedor.id})" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>
            </td>
        `;
    });
}

function exportarProveedoresCSV() {
    if (beneficiarios.length === 0) {
        alert('No hay proveedores para exportar');
        return;
    }
    
    // Definir encabezados del CSV
    const headers = [
        'ID',
        'Nombre',
        'Razón Social',
        'RFC',
        'Banco',
        'Cuenta',
        'CLABE',
        'Tiene CSF'
    ];
    
    // Crear filas de datos
    const filas = beneficiarios.map(prov => {
        return [
            prov.id,
            `"${(prov.nombre || '').replace(/"/g, '""')}"`,
            `"${(prov.razonSocial || '').replace(/"/g, '""')}"`,
            prov.rfc || '',
            prov.banco || '',
            prov.cuenta || '',
            prov.clabe || '',
            prov.csf ? 'Sí' : 'No'
        ];
    });
    
    // Construir contenido CSV
    let csvContent = headers.join(',') + '\n';
    filas.forEach(fila => {
        csvContent += fila.join(',') + '\n';
    });
    
    // Crear blob y descargar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `proveedores_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Archivo CSV descargado exitosamente');
}

function mostrarFormularioProveedor(id = null) {
    if (!verificarPermisoAdmin()) return;
    
    const modal = document.getElementById('proveedorModal');
    const title = document.getElementById('proveedorModalTitle');
    const form = document.getElementById('proveedorForm');
    
    form.reset();
    editandoProveedor = id;
    
    if (id) {
        title.textContent = 'Editar Proveedor';
        const proveedor = beneficiarios.find(b => b.id === id);
        if (proveedor) {
            document.getElementById('proveedorNombre').value = proveedor.nombre;
            document.getElementById('proveedorRazonSocial').value = proveedor.razonSocial || '';
            document.getElementById('proveedorRFC').value = proveedor.rfc || '';
            document.getElementById('proveedorBanco').value = proveedor.banco;
            document.getElementById('proveedorCuenta').value = proveedor.cuenta;
            document.getElementById('proveedorClabe').value = proveedor.clabe;
        }
    } else {
        title.textContent = 'Nuevo Proveedor';
    }
    
    modal.style.display = 'block';
}

function editarProveedor(id) {
    mostrarFormularioProveedor(id);
}

async function eliminarProveedor(id) {
    if (!verificarPermisoAdmin()) return;
    
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
        try {
            await eliminarBeneficiarioSupabase(id);
            const index = beneficiarios.findIndex(b => b.id === id);
            if (index > -1) {
                beneficiarios.splice(index, 1);
            }
            await cargarDatosDesdeSupabase();
            cargarProveedores();
            cargarBeneficiariosSelect();
            alert('Proveedor eliminado exitosamente');
        } catch (error) {
            alert('Error al eliminar proveedor');
        }
    }
}

async function guardarProveedor(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('proveedorNombre').value;
    const razonSocial = document.getElementById('proveedorRazonSocial').value;
    const rfc = document.getElementById('proveedorRFC').value.toUpperCase();
    const banco = document.getElementById('proveedorBanco').value;
    const cuenta = document.getElementById('proveedorCuenta').value;
    const clabe = document.getElementById('proveedorClabe').value;
    
    try {
        if (editandoProveedor) {
            const proveedor = beneficiarios.find(b => b.id === editandoProveedor);
            if (proveedor) {
                proveedor.nombre = nombre;
                proveedor.razonSocial = razonSocial;
                proveedor.rfc = rfc;
                proveedor.banco = banco;
                proveedor.cuenta = cuenta;
                proveedor.clabe = clabe;
                await guardarBeneficiarioSupabase(proveedor);
            }
        } else {
            const nuevoProveedor = {
                nombre: nombre,
                razonSocial: razonSocial,
                rfc: rfc,
                banco: banco,
                cuenta: cuenta,
                clabe: clabe,
                csf: null
            };
            const proveedorGuardado = await guardarBeneficiarioSupabase(nuevoProveedor);
            beneficiarios.push(proveedorGuardado);
        }
        
        cerrarModalProveedor();
        await cargarDatosDesdeSupabase();
        cargarProveedores();
        cargarBeneficiariosSelect();
        alert(editandoProveedor ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente');
    } catch (error) {
        alert('Error al guardar proveedor');
    }
}

function cerrarModalProveedor() {
    document.getElementById('proveedorModal').style.display = 'none';
    editandoProveedor = null;
}

function gestionarCSF(proveedorId) {
    proveedorActualCSF = proveedorId;
    const proveedor = beneficiarios.find(p => p.id === proveedorId);
    if (!proveedor) return;
    
    const modal = document.getElementById('csfModal');
    const info = document.getElementById('csfProveedorInfo');
    const csfActual = document.getElementById('csfActual');
    
    info.innerHTML = `
        <p><strong>Proveedor:</strong> ${proveedor.nombre}</p>
        ${proveedor.razonSocial ? `<p><strong>Razón Social:</strong> ${proveedor.razonSocial}</p>` : ''}
        <p><strong>RFC:</strong> ${proveedor.rfc || 'N/A'}</p>
    `;
    
    if (proveedor.csf) {
        csfActual.innerHTML = `
            <h4>CSF Actual:</h4>
            <div class="archivo-item">
                <span>${proveedor.csf.nombre} <small style="color: #999;">(${formatearFecha(proveedor.csf.fecha)})</small></span>
                <div>
                    <button class="btn btn-secondary" onclick="descargarCSF(${proveedorId})" style="padding: 5px 10px; font-size: 12px;">Descargar</button>
                    <button class="btn btn-danger" onclick="eliminarCSF(${proveedorId})" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>
                </div>
            </div>
        `;
    } else {
        csfActual.innerHTML = '<p style="color: #999;">No hay CSF cargada</p>';
    }
    
    modal.style.display = 'block';
}

async function subirCSF() {
    const input = document.getElementById('archivoCSF');
    const file = input.files[0];
    
    if (!file) {
        alert('Por favor seleccione un archivo PDF');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
    }
    
    const proveedor = beneficiarios.find(p => p.id === proveedorActualCSF);
    if (!proveedor) return;
    
    mostrarCargando(true);
    
    if (usarSupabase) {
        const url = await subirArchivoSupabase(file, 'csf');
        if (url) {
            proveedor.csf = {
                nombre: file.name,
                datos: url,
                fecha: new Date().toISOString()
            };
            
            await guardarBeneficiarioSupabase(proveedor);
            await cargarDatosDesdeSupabase();
            alert('Constancia de Situación Fiscal subida exitosamente');
            gestionarCSF(proveedorActualCSF);
            input.value = '';
        } else {
            alert('Error al subir el archivo');
        }
    } else {
        const reader = new FileReader();
        reader.onload = function(e) {
            proveedor.csf = {
                nombre: file.name,
                datos: e.target.result,
                fecha: new Date().toISOString()
            };
            
            guardarDatosLocalStorage();
            alert('Constancia de Situación Fiscal subida exitosamente');
            gestionarCSF(proveedorActualCSF);
            input.value = '';
        };
        reader.readAsDataURL(file);
    }
    
    mostrarCargando(false);
}

function descargarCSF(proveedorId) {
    const proveedor = beneficiarios.find(p => p.id === proveedorId);
    if (!proveedor || !proveedor.csf) return;
    
    const link = document.createElement('a');
    link.href = proveedor.csf.datos;
    link.download = proveedor.csf.nombre;
    link.click();
}

async function eliminarCSF(proveedorId) {
    if (!confirm('¿Está seguro de eliminar la Constancia de Situación Fiscal?')) return;
    
    const proveedor = beneficiarios.find(p => p.id === proveedorId);
    if (!proveedor) return;
    
    proveedor.csf = null;
    
    await guardarBeneficiarioSupabase(proveedor);
    await cargarDatosDesdeSupabase();
    gestionarCSF(proveedorId);
    alert('CSF eliminada exitosamente');
}

function cerrarModalCSF() {
    document.getElementById('csfModal').style.display = 'none';
    proveedorActualCSF = null;
    document.getElementById('archivoCSF').value = '';
}

// SECCIÓN 6 - Gestión de Empresas y Cierre de Modales

function cargarEmpresas() {
    const tbody = document.querySelector('#empresasTable tbody');
    tbody.innerHTML = '';
    
    empresas.forEach(empresa => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${empresa.razonSocial || empresa.razon_social || 'N/A'}</td>
            <td>${empresa.rfc || 'N/A'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarEmpresa(${empresa.id})" style="padding: 5px 10px; font-size: 12px;">Editar</button>
                <button class="btn btn-danger" onclick="eliminarEmpresa(${empresa.id})" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>
            </td>
        `;
    });
}

function mostrarFormularioEmpresa(id = null) {
    if (!verificarPermisoAdmin()) return;
    
    const modal = document.getElementById('empresaModal');
    const title = document.getElementById('empresaModalTitle');
    const form = document.getElementById('empresaForm');
    
    form.reset();
    editandoEmpresa = id;
    
    if (id) {
        title.textContent = 'Editar Empresa';
        const empresa = empresas.find(e => e.id === id);
        if (empresa) {
            document.getElementById('empresaRazon').value = empresa.razonSocial;
            document.getElementById('empresaRFC').value = empresa.rfc;
        }
    } else {
        title.textContent = 'Nueva Empresa';
    }
    
    modal.style.display = 'block';
}

function editarEmpresa(id) {
    mostrarFormularioEmpresa(id);
}

async function eliminarEmpresa(id) {
    if (confirm('¿Está seguro de eliminar esta empresa?')) {
        try {
            await eliminarEmpresaSupabase(id);
            const index = empresas.findIndex(e => e.id === id);
            if (index > -1) {
                empresas.splice(index, 1);
            }
            await cargarDatosDesdeSupabase();
            cargarEmpresas();
            cargarEmpresasSelect();
            alert('Empresa eliminada exitosamente');
        } catch (error) {
            alert('Error al eliminar empresa');
        }
    }
}

async function guardarEmpresa(event) {
    event.preventDefault();
    
    const razonSocial = document.getElementById('empresaRazon').value;
    const rfc = document.getElementById('empresaRFC').value.toUpperCase();
    
    try {
        if (editandoEmpresa) {
            const empresa = empresas.find(e => e.id === editandoEmpresa);
            if (empresa) {
                empresa.razonSocial = razonSocial;
                empresa.rfc = rfc;
                await guardarEmpresaSupabase(empresa);
            }
        } else {
            const nuevaEmpresa = {
                razonSocial: razonSocial,
                rfc: rfc
            };
            const empresaGuardada = await guardarEmpresaSupabase(nuevaEmpresa);
            empresas.push(empresaGuardada);
        }
        
        cerrarModalEmpresa();
        await cargarDatosDesdeSupabase();
        cargarEmpresas();
        cargarEmpresasSelect();
        alert(editandoEmpresa ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente');
    } catch (error) {
        alert('Error al guardar empresa');
    }
}

function cerrarModalEmpresa() {
    document.getElementById('empresaModal').style.display = 'none';
    editandoEmpresa = null;
}

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

async function guardarDatos() {
    if (usarSupabase) {
        // Los datos ya se guardan individualmente en Supabase
        return;
    }
    guardarDatosLocalStorage();
}

function cargarDatos() {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    if (solicitudesGuardadas) {
        try {
            solicitudes = JSON.parse(solicitudesGuardadas);
        } catch (e) {
            console.error('Error al cargar solicitudes:', e);
        }
    }
    
    const contadoresGuardados = localStorage.getItem('contadores');
    if (contadoresGuardados) {
        try {
            contadores = JSON.parse(contadoresGuardados);
        } catch (e) {
            console.error('Error al cargar contadores:', e);
        }
    }
    
    const beneficiariosGuardados = localStorage.getItem('beneficiarios');
    if (beneficiariosGuardados) {
        try {
            beneficiarios = JSON.parse(beneficiariosGuardados);
        } catch (e) {
            console.error('Error al cargar beneficiarios:', e);
        }
    }
    
    const empresasGuardadas = localStorage.getItem('empresas');
    if (empresasGuardadas) {
        try {
            empresas = JSON.parse(empresasGuardadas);
        } catch (e) {
            console.error('Error al cargar empresas:', e);
        }
    }
    
    cargarUsuariosDesdeStorage();
}

//cargarDatos();

//window.addEventListener('beforeunload', function() {
//    guardarDatos();
//});

//setInterval(guardarDatos, 30000);

async function marcarComoPagada(solicitudId, estaPagada) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (solicitud) {
        solicitud.pagada = estaPagada;
        if (estaPagada) {
            solicitud.fechaPago = new Date().toISOString();
        } else {
            solicitud.fechaPago = null;
        }
        
        await actualizarSolicitudSupabase(solicitud);
        await cargarDatosDesdeSupabase();
        cargarSolicitudes();
    }
}

function gestionarComprobantePago(solicitudId) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) return;
    
    const modal = document.getElementById('comprobantePagoModal');
    const info = document.getElementById('comprobanteSolicitudInfo');
    const contenido = document.getElementById('comprobanteContenido');
    
    info.innerHTML = `
        <p><strong>Solicitud:</strong> ${solicitud.numero}</p>
        <p><strong>Proveedor:</strong> ${solicitud.proveedor}</p>
        <p><strong>Total:</strong> $${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
    `;
    
    // Guardar ID actual
    modal.setAttribute('data-solicitud-id', solicitudId);
    
    if (solicitud.comprobantePago) {
        const esImagen = solicitud.comprobantePago.tipo.startsWith('image/');
        const esPDF = solicitud.comprobantePago.tipo === 'application/pdf';
        
        let htmlVisualizacion = '';
        if (esImagen) {
            htmlVisualizacion = `
                <div style="text-align: center; margin: 10px 0;">
                    <img src="${solicitud.comprobantePago.datos}" 
                         style="max-width: 100%; max-height: 400px; border: 1px solid #ddd;">
                </div>
            `;
        } else if (esPDF) {
            htmlVisualizacion = `
                <div style="text-align: center; margin: 10px 0;">
                    <p style="font-size: 14px;">📄 Archivo PDF: ${solicitud.comprobantePago.nombre}</p>
                </div>
            `;
        }
        
        contenido.innerHTML = `
            <h4>Comprobante Actual:</h4>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <p><strong>Archivo:</strong> ${solicitud.comprobantePago.nombre}</p>
                <p><strong>Fecha de subida:</strong> ${formatearFecha(solicitud.comprobantePago.fecha)}</p>
                ${htmlVisualizacion}
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn btn-secondary" onclick="descargarComprobantePago(${solicitudId})" style="flex: 1;">
                        Descargar
                    </button>
                    <button class="btn btn-danger" onclick="eliminarComprobantePago(${solicitudId})" style="flex: 1;">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    } else {
        contenido.innerHTML = `
            <p style="color: #999; text-align: center; padding: 20px;">
                No hay comprobante de pago cargado
            </p>
        `;
    }
    
    modal.style.display = 'block';
}

async function subirComprobantePago() {
    const input = document.getElementById('archivoComprobante');
    const file = input.files[0];
    
    if (!file) {
        alert('Por favor seleccione un archivo');
        return;
    }
    
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten archivos PDF o imágenes (JPG, PNG, GIF)');
        return;
    }
    
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Tamaño máximo: 2 MB');
        return;
    }
    
    const modal = document.getElementById('comprobantePagoModal');
    const solicitudId = parseInt(modal.getAttribute('data-solicitud-id'));
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    
    if (!solicitud) return;
    
    mostrarCargando(true);
    
    if (usarSupabase) {
        const url = await subirArchivoSupabase(file, 'comprobantes');
        if (url) {
            solicitud.comprobantePago = {
                nombre: file.name,
                tipo: file.type,
                datos: url,
                fecha: new Date().toISOString()
            };
            
            await actualizarSolicitudSupabase(solicitud);
            await cargarDatosDesdeSupabase();
            alert('Comprobante de pago subido exitosamente');
            gestionarComprobantePago(solicitudId);
            cargarSolicitudes();
            input.value = '';
        } else {
            alert('Error al subir el archivo');
        }
    } else {
        const reader = new FileReader();
        reader.onload = function(e) {
            solicitud.comprobantePago = {
                nombre: file.name,
                tipo: file.type,
                datos: e.target.result,
                fecha: new Date().toISOString()
            };
            
            guardarDatosLocalStorage();
            alert('Comprobante de pago subido exitosamente');
            gestionarComprobantePago(solicitudId);
                        cargarSolicitudes();
            input.value = '';
        };
        reader.readAsDataURL(file);
    }
    
    mostrarCargando(false);
}

function descargarComprobantePago(solicitudId) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !solicitud.comprobantePago) return;
    
    const link = document.createElement('a');
    link.href = solicitud.comprobantePago.datos;
    link.download = solicitud.comprobantePago.nombre;
    link.click();
}

async function eliminarComprobantePago(solicitudId) {
    if (!confirm('¿Está seguro de eliminar el comprobante de pago?')) return;
    
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) return;
    
    solicitud.comprobantePago = null;
    
    await actualizarSolicitudSupabase(solicitud);
    await cargarDatosDesdeSupabase();
    alert('Comprobante eliminado exitosamente');
    gestionarComprobantePago(solicitudId);
    cargarSolicitudes();
}

function cerrarModalComprobante() {
    const modal = document.getElementById('comprobantePagoModal');
    modal.style.display = 'none';
    modal.removeAttribute('data-solicitud-id');
    document.getElementById('archivoComprobante').value = '';
}

// Verificar si el usuario tiene un permiso específico
function tienePermiso(permiso) {
    if (!usuarioActual) return false;
    const rolConfig = rolesConfig[usuarioActual.rol];
    if (!rolConfig) return false;
    return rolConfig.permisos.includes(permiso);
}

// Cargar configuración de roles desde localStorage
function cargarRolesConfig() {
    const rolesGuardados = localStorage.getItem('rolesConfig');
    if (rolesGuardados) {
        try {
            const rolesTemp = JSON.parse(rolesGuardados);
            // Siempre mantener el rol admin con permisos completos
            rolesTemp['admin'] = rolesConfig['admin'];
            rolesConfig = rolesTemp;
        } catch (e) {
            console.error('Error al cargar roles:', e);
        }
    }
}

// Guardar configuración de roles
function guardarRolesConfig() {
    localStorage.setItem('rolesConfig', JSON.stringify(rolesConfig));
}

// Cargar roles al inicio
cargarRolesConfig();

// Cargar tabla de roles
function cargarRoles() {
    if (!tienePermiso('gestionar_roles')) {
        alert('No tiene permisos para gestionar roles');
        return;
    }
    
    const tbody = document.querySelector('#rolesTable tbody');
    tbody.innerHTML = '';
    
    Object.keys(rolesConfig).forEach(codigoRol => {
        const rol = rolesConfig[codigoRol];
        const row = tbody.insertRow();
        
        const permisosResumen = rol.permisos.length > 3 
            ? `${rol.permisos.slice(0, 3).map(p => permisosDisponibles[p]?.substring(0, 20)).join(', ')}...` 
            : rol.permisos.map(p => permisosDisponibles[p]?.substring(0, 30)).join(', ');
        
        row.innerHTML = `
            <td><code>${codigoRol}</code></td>
            <td>${rol.nombre}</td>
            <td style="font-size: 11px;">${permisosResumen}<br><small>(${rol.permisos.length} permisos)</small></td>
            <td>${rol.requiereSucursal ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarRol('${codigoRol}')" 
                        style="padding: 5px 10px; font-size: 12px;">Ver/Editar</button>
                ${!rol.editable ? 
                    '<span style="color: #999; font-size: 11px;">Protegido</span>' :
                    `<button class="btn btn-danger" onclick="eliminarRol('${codigoRol}')" 
                            style="padding: 5px 10px; font-size: 12px;">Eliminar</button>`
                }
            </td>
        `;
    });
}

// Mostrar formulario de rol
function mostrarFormularioRol(codigoRol = null) {
    if (!tienePermiso('gestionar_roles')) {
        alert('No tiene permisos para gestionar roles');
        return;
    }
    
    const modal = document.getElementById('rolModal');
    const title = document.getElementById('rolModalTitle');
    const form = document.getElementById('rolForm');
    const permisosContainer = document.getElementById('permisosCheckboxes');
    
    form.reset();
    editandoRol = codigoRol;
    
    // Generar checkboxes de permisos
    permisosContainer.innerHTML = '';
    Object.keys(permisosDisponibles).forEach(codigoPermiso => {
        if (codigoPermiso === 'gestionar_roles' && codigoRol !== 'admin') {
            return; // Solo admin puede tener este permiso
        }
        
        const div = document.createElement('div');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'permiso';
        checkbox.value = codigoPermiso;
        checkbox.id = `permiso_${codigoPermiso}`;
        
        const label = document.createElement('label');
        label.htmlFor = `permiso_${codigoPermiso}`;
        label.textContent = permisosDisponibles[codigoPermiso];
        
        div.appendChild(checkbox);
        div.appendChild(label);
        permisosContainer.appendChild(div);
    });
    
    if (codigoRol) {
        title.textContent = 'Editar Rol';
        const rol = rolesConfig[codigoRol];
        
        document.getElementById('rolCodigo').value = codigoRol;
        document.getElementById('rolCodigo').readOnly = true;
        document.getElementById('rolNombre').value = rol.nombre;
        document.getElementById('rolRequiereSucursal').checked = rol.requiereSucursal;
        
        // Marcar permisos
        rol.permisos.forEach(permiso => {
            const checkbox = document.querySelector(`input[value="${permiso}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Si no es editable, deshabilitar campos
        if (!rol.editable) {
            document.getElementById('rolCodigo').disabled = true;
            document.getElementById('rolNombre').disabled = true;
            document.getElementById('rolRequiereSucursal').disabled = true;
            document.querySelectorAll('input[name="permiso"]').forEach(cb => cb.disabled = true);
            form.querySelector('button[type="submit"]').style.display = 'none';
        }
    } else {
        title.textContent = 'Nuevo Rol';
        document.getElementById('rolCodigo').readOnly = false;
    }
    
    modal.style.display = 'block';
}

// Editar rol
function editarRol(codigoRol) {
    mostrarFormularioRol(codigoRol);
}

// Guardar rol
function guardarRol(event) {
    event.preventDefault();
    
    const codigoRol = document.getElementById('rolCodigo').value.trim().toLowerCase();
    const nombreRol = document.getElementById('rolNombre').value.trim();
    const requiereSucursal = document.getElementById('rolRequiereSucursal').checked;
    
    const permisosSeleccionados = Array.from(document.querySelectorAll('input[name="permiso"]:checked'))
        .map(cb => cb.value);
    
    if (permisosSeleccionados.length === 0) {
        alert('Debe seleccionar al menos un permiso');
        return;
    }
    
    if (!editandoRol && rolesConfig[codigoRol]) {
        alert('Ya existe un rol con ese código');
        return;
    }
    
    rolesConfig[codigoRol] = {
        nombre: nombreRol,
        permisos: permisosSeleccionados,
        requiereSucursal: requiereSucursal,
        editable: true
    };
    
    guardarRolesConfig();
    cerrarModalRol();
    cargarRoles();
    alert(editandoRol ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente');
}

// Eliminar rol
function eliminarRol(codigoRol) {
    if (!rolesConfig[codigoRol].editable) {
        alert('Este rol está protegido y no puede ser eliminado');
        return;
    }
    
    // Verificar si hay usuarios con este rol
    const usuariosConRol = Object.keys(usuarios).filter(username => usuarios[username].rol === codigoRol);
    if (usuariosConRol.length > 0) {
        alert(`No se puede eliminar este rol porque hay ${usuariosConRol.length} usuario(s) asignado(s) a él. Primero cambie o elimine esos usuarios.`);
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el rol "${rolesConfig[codigoRol].nombre}"?`)) {
        delete rolesConfig[codigoRol];
        guardarRolesConfig();
        cargarRoles();
        alert('Rol eliminado exitosamente');
    }
}

// Cerrar modal de rol
function cerrarModalRol() {
    document.getElementById('rolModal').style.display = 'none';
    editandoRol = null;
    
    // Rehabilitar campos
    document.getElementById('rolCodigo').disabled = false;
    document.getElementById('rolNombre').disabled = false;
    document.getElementById('rolRequiereSucursal').disabled = false;
    document.querySelectorAll('input[name="permiso"]').forEach(cb => cb.disabled = false);
    document.getElementById('rolForm').querySelector('button[type="submit"]').style.display = 'inline-block';
}

// Función para formatear fechas a dd/mm/yyyy
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function calcularTotal() {
    const subtotalInput = document.getElementById('subtotal');
    const impuestosInput = document.getElementById('impuestos');
    const montoImpuestosInput = document.getElementById('montoImpuestos');
    const totalInput = document.getElementById('total');
    
    const subtotal = extraerValorMoneda(subtotalInput.value);
    const porcentajeImpuestos = parseFloat(impuestosInput.value) || 0;
    
    const montoImpuestos = subtotal * (porcentajeImpuestos / 100);
    const total = subtotal + montoImpuestos;
    
    montoImpuestosInput.value = '$' + montoImpuestos.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    totalInput.value = '$' + total.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calcularMontoConceptoPago() {
    const montoTotalInput = document.getElementById('montoConceptoGeneral');
    const porcentajeAnticipoInput = document.getElementById('porcentajeAnticipo');
    const subtotalInput = document.getElementById('subtotal');
    
    const montoTotal = extraerValorMoneda(montoTotalInput.value);
    const porcentajeAnticipo = parseFloat(porcentajeAnticipoInput.value) || 0;
    
    const montoConceptoPago = montoTotal * (porcentajeAnticipo / 100);
    
    subtotalInput.value = '$' + montoConceptoPago.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    // Recalcular el total
    calcularTotal();
}