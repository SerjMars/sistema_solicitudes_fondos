// SECCIÓN 1 - Variables globales y funciones de inicialización

let usuarios = {
    // ADMIN
    'admin_unico': { 
        password: 'admin2025', 
        rol: 'admin', 
        sucursal: null, 
        nombre: 'Administrador General',
        gerencia: null,
        empresaId: null,
        empresasIds: null
    },
    
    // JEFES DE SUCURSAL (requieren sucursal y gerencia)
    'ags_jefe': { 
        password: 'ags2025', 
        rol: 'jefe', 
        sucursal: 'AGS', 
        nombre: 'Jefe Aguascalientes',
        gerencia: 'GCS',  // ✅ Pertenece a Gerencia de Sucursales
        empresaId: null,
        empresasIds: null
    },
    'leo_jefe': { 
        password: 'leo2025', 
        rol: 'jefe', 
        sucursal: 'LEO', 
        nombre: 'Jefe León',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    'can_jefe': { 
        password: 'can2025', 
        rol: 'jefe', 
        sucursal: 'CAN', 
        nombre: 'Jefe Cancún',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    'mty_jefe': { 
        password: 'mty2025', 
        rol: 'jefe', 
        sucursal: 'MTY', 
        nombre: 'Jefe Monterrey',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    'gdl_jefe': { 
        password: 'gdl2025', 
        rol: 'jefe', 
        sucursal: 'GDL', 
        nombre: 'Jefe Guadalajara',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    'vsa_jefe': { 
        password: 'vsa2025', 
        rol: 'jefe', 
        sucursal: 'VSA', 
        nombre: 'Jefe Villahermosa',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    
    // COORDINADORES (requieren gerencia, pueden o no tener sucursal)
    'coordinador_sucursales': { 
        password: 'cos2025', 
        rol: 'coordinador', 
        sucursal: 'COS',  // Coordinador de Sucursales
        nombre: 'Coordinador de Sucursales',
        gerencia: 'GCS',
        empresaId: null,
        empresasIds: null
    },
    'coordinador_monitoreo': {
        password: 'mon2025',
        rol: 'coordinador',
        sucursal: 'MON',
        nombre: 'Coordinador de Monitoreo e Iluminación',
        gerencia: 'GCC',  // ✅ Pertenece a Gerencia de Centro
        empresaId: null,
        empresasIds: null
    },
    
    // GERENCIAS (nuevos roles)
    'gerente_sucursales': {
        password: 'gcs2025',
        rol: 'gerencia_sucursales',
        sucursal: null,
        nombre: 'Gerente de Sucursales',
        gerencia: null,  // Es la gerencia misma
        empresaId: null,
        empresasIds: null
    },
    'gerente_centro': {
        password: 'gcc2025',
        rol: 'gerencia_centro',
        sucursal: null,
        nombre: 'Gerente de Centro',
        gerencia: null,
        empresaId: null,
        empresasIds: null
    },
    
    // DIRECCIONES (nuevos roles)
    'director_operaciones': {
        password: 'dop2025',
        rol: 'direccion_operaciones',
        sucursal: null,
        nombre: 'Director de Operaciones',
        gerencia: null,
        empresaId: null,
        empresasIds: null
    },
    'director_general': {
        password: 'dir2025',
        rol: 'direccion_general',
        sucursal: null,
        nombre: 'Director General',
        gerencia: null,
        empresaId: null,
        empresasIds: null
    },
    
    // CONTABILIDAD (requiere una empresa)
    'contabilidad_user': {
        password: 'cont2025',
        rol: 'contabilidad',
        sucursal: null,
        nombre: 'Usuario Contabilidad',
        gerencia: null,
        empresaId: 1,  // ✅ Asignado a una empresa específica
        empresasIds: null
    },
    
    // TESORERÍA (puede tener múltiples empresas)
    'tesoreria_user': {
        password: 'tes2025',
        rol: 'tesoreria',
        sucursal: null,
        nombre: 'Usuario Tesorería',
        gerencia: null,
        empresaId: null,
        empresasIds: [1, 2, 3]  // ✅ Puede atender múltiples empresas
    }
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
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: false,
        editable: false
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
        requiereGerencia: true,
        requiereEmpresa: false,
        requiereEmpresas: false,
        editable: true
    },
    'coordinador': {
        nombre: 'Coordinador',
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
        requiereGerencia: true,
        requiereEmpresa: false,
        requiereEmpresas: false,
        editable: true
    },
    'gerencia_sucursales': {
        nombre: 'Gerencia de Sucursales',
        codigo: 'GCS',
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
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: false,
        nivelAutorizacion: 2,
        editable: true
    },
    'gerencia_centro': {
        nombre: 'Gerencia de Centro',
        codigo: 'GCC',
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
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: false,
        nivelAutorizacion: 2,
        editable: true
    },
    'direccion_operaciones': {
        nombre: 'Dirección de Operaciones',
        codigo: 'DOP',
        permisos: [
            'ver_todas_solicitudes',
            'crear_solicitud',
            'editar_solicitud',
            'autorizar_solicitud',
            'cancelar_solicitud',
            'marcar_pagada',
            'gestionar_comprobantes',
            'descargar_archivos',
            'exportar_csv',
            'gestionar_usuarios',
            'gestionar_proveedores'
        ],
        requiereSucursal: false,
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: false,
        nivelAutorizacion: 3,
        editable: true
    },
    'direccion_general': {
        nombre: 'Dirección General',
        codigo: 'DIR',
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
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: false,
        nivelAutorizacion: 4,
        editable: true
    },
    'contabilidad': {
        nombre: 'Contabilidad',
        codigo: 'CONT',
        permisos: [
            'ver_todas_solicitudes',
            'descargar_archivos',
            'exportar_csv'
        ],
        requiereSucursal: false,
        requiereGerencia: false,
        requiereEmpresa: true,
        requiereEmpresas: false,
        soloRevisa: true,
        nivelAutorizacion: 0,
        editable: true
    },
    'tesoreria': {
        nombre: 'Tesorería',
        codigo: 'TES',
        permisos: [
            'ver_todas_solicitudes',
            'marcar_pagada',
            'gestionar_comprobantes',
            'descargar_archivos',
            'exportar_csv'
        ],
        requiereSucursal: false,
        requiereGerencia: false,
        requiereEmpresa: false,
        requiereEmpresas: true,
        soloPaga: true,
        nivelAutorizacion: 0,
        editable: true
    }    
};

console.log('✅ rolesConfig cargado correctamente:', rolesConfig);
console.log('✅ Jefe requiere gerencia:', rolesConfig['jefe']?.requiereGerencia);

let beneficiarios = [
    {
        id: 1,
        nombre: 'ESPECTACULARES, S.A. DE C.V.',
        razonSocial: 'ESPECTACULARES SOCIEDAD ANONIMA DE CAPITAL VARIABLE',
        rfc: 'ESP123456789',
        tipo: 'proveedor',
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
    //CDMX: 0,
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

let archivosTemporales = [];

let contadorFilasGastos = 0;
let gastosTemporales = [];

// Variables para almacenar archivos
let archivosPDFGastos = {};
let archivosXMLGastos = {};

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
    cargarBeneficiariosSelectCajaChica();
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
        sucursalSelect.value = usuarioActual.sucursal;
        sucursalSelect.disabled = true;
        sucursalSelect.style.background = '#f8f9fa';
        sucursalSelect.style.cursor = 'not-allowed';
    } else {
        sucursalSelect.disabled = false;
        sucursalSelect.style.background = 'white';
        sucursalSelect.style.cursor = 'pointer';
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
        //'CDMX': 'Ciudad de México',
        'GCC': 'Gerencia Centro',
        'GCS': 'Gerencia de Departamentos',
        'DOP': 'Dirección de Operaciones',
        'DIR': 'Dirección General',
        'CMP': 'Compras'
    };
    return nombres[code] || code;
}

function switchTab(tabName, event) {
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
    
    // Remover active de todas las pestañas y contenidos
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Agregar active a la pestaña clickeada (si hay evento)
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            const tabText = tab.textContent.toLowerCase();
            if (tabText.includes(tabName.toLowerCase()) || 
                (tabName === 'nueva' && tabText.includes('nueva solicitud'))) {
                tab.classList.add('active');
            }
        });
    }
    
    // Mostrar el contenido de la pestaña
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Cargar datos según la pestaña (CON CARGA BAJO DEMANDA)
    if (tabName === 'solicitudes') {
        // Cargar solicitudes solo cuando se accede a la pestaña
        cargarSolicitudesSupabase().then(() => {
            cargarSolicitudes();
        }).catch(error => {
            console.error('Error al cargar solicitudes:', error);
            cargarSolicitudes(); // Intentar cargar lo que haya en memoria
        });
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

// Manejar selección de archivos en nueva solicitud
document.addEventListener('DOMContentLoaded', function() {
    const inputArchivos = document.getElementById('archivosNuevaSolicitud');
    if (inputArchivos) {
        inputArchivos.addEventListener('change', function() {
            mostrarArchivosTemporales();
        });
    }
});

function mostrarArchivosTemporales() {
    const input = document.getElementById('archivosNuevaSolicitud');
    const lista = document.getElementById('listaArchivosNuevaSolicitud');
    
    if (!input.files || input.files.length === 0) {
        lista.innerHTML = '';
        return;
    }
    
    let html = '<h5 style="font-size: 14px; margin-bottom: 10px;">Archivos seleccionados:</h5>';
    
    Array.from(input.files).forEach((file, index) => {
        html += `
            <div class="archivo-item" style="padding: 10px; background: white; margin: 8px 0; border-radius: 5px; border: 1px solid #ddd;">
                <span style="font-size: 13px;">${file.name} <small style="color: #999;">(${(file.size / 1024).toFixed(2)} KB)</small></span>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

async function procesarArchivosNuevaSolicitud() {
    const input = document.getElementById('archivosNuevaSolicitud');
    const archivos = [];
    
    if (!input.files || input.files.length === 0) {
        return archivos;
    }
    
    for (let file of input.files) {
        const reader = new FileReader();
        const archivoPromise = new Promise((resolve) => {
            reader.onload = function(e) {
                resolve({
                    nombre: file.name,
                    tipo: file.type,
                    datos: e.target.result,
                    fecha: new Date().toISOString()
                });
            };
            reader.readAsDataURL(file);
        });
        
        archivos.push(await archivoPromise);
    }
    
    return archivos;
}

// Función auxiliar para establecer required de forma segura
function setRequired(elementId, isRequired) {
    const element = document.getElementById(elementId);
    if (element) {
        element.required = isRequired;
    } else {
        console.warn(`Elemento '${elementId}' no encontrado en el DOM`);
    }
}

// Cambiar entre formatos
function cambiarFormato(formato) {
    const tipoFormato = document.getElementById('tipoFormato');
    const formatoNormal = document.getElementById('formatoNormal');
    const formatoCajaChica = document.getElementById('formatoCajaChica');
    const btnNormal = document.getElementById('btnFormatoNormal');
    const btnCajaChica = document.getElementById('btnFormatoCajaChica');
    const vincularGroup = document.getElementById('vincularSolicitudGroup');
    const claveAnuncioGroup = document.getElementById('claveAnuncio').closest('.form-group');
    
    if (formato === 'normal') {
        tipoFormato.value = 'normal';
        formatoNormal.style.display = 'block';
        formatoCajaChica.style.display = 'none';
        vincularGroup.style.display = 'block';
        claveAnuncioGroup.style.display = 'block';
        btnNormal.classList.add('active');
        btnCajaChica.classList.remove('active');
        
        // Hacer campos requeridos para formato normal
        setRequired('conceptoGeneral', true);
        setRequired('montoConceptoGeneral', true);
        setRequired('subtotal', true);
        setRequired('total', true);
        setRequired('beneficiario', true);
        setRequired('proveedor', true);
        setRequired('banco', true);
        setRequired('cuenta', true);
        setRequired('clabe', true);
        // NO incluir 'ciudad' porque ya no existe
        
        // Quitar requerimiento de caja chica
        setRequired('beneficiarioCajaChica', false);
        setRequired('proveedorCajaChica', false);
        setRequired('bancoCajaChica', false);
        setRequired('cuentaCajaChica', false);
        setRequired('clabeCajaChica', false);
        // NO incluir 'ciudadCajaChica' porque ya no existe
        
    } else {
        tipoFormato.value = 'cajaChica';
        formatoNormal.style.display = 'none';
        formatoCajaChica.style.display = 'block';
        vincularGroup.style.display = 'none';
        claveAnuncioGroup.style.display = 'none';
        btnNormal.classList.remove('active');
        btnCajaChica.classList.add('active');
        
        // Quitar requerimiento de formato normal
        setRequired('conceptoGeneral', false);
        setRequired('montoConceptoGeneral', false);
        setRequired('subtotal', false);
        setRequired('total', false);
        setRequired('beneficiario', false);
        setRequired('proveedor', false);
        setRequired('banco', false);
        setRequired('cuenta', false);
        setRequired('clabe', false);
        // NO incluir 'ciudad' porque ya no existe
        
        // Hacer campos requeridos para caja chica
        setRequired('beneficiarioCajaChica', true);
        setRequired('proveedorCajaChica', true);
        setRequired('bancoCajaChica', true);
        setRequired('cuentaCajaChica', true);
        setRequired('clabeCajaChica', true);
        // NO incluir 'ciudadCajaChica' porque ya no existe
        
        // ===== LIMPIAR Y RESETEAR GASTOS =====
        const tbody = document.getElementById('bodyGastos');
        if (tbody) {
            // Limpiar todas las filas existentes
            tbody.innerHTML = '';
        }
        
        // Resetear contadores y archivos
        contadorFilasGastos = 0;
        archivosPDFGastos = {};
        archivosXMLGastos = {};
        
        // Resetear total
        const totalReembolsar = document.getElementById('totalReembolsar');
        if (totalReembolsar) {
            totalReembolsar.textContent = '$0.00';
        }
        
        // Agregar UNA sola fila inicial
        agregarFilaGasto();
    }
}

// Agregar fila de gasto con archivos
function agregarFilaGasto() {

    console.log(`Agregando fila de gasto. Contador actual: ${contadorFilasGastos} -> ${contadorFilasGastos + 1}`);

    const tbody = document.getElementById('bodyGastos');
    const fila = tbody.insertRow();
    const id = ++contadorFilasGastos;
    
    fila.innerHTML = `
        <td>
            <input type="date" id="fecha_${id}" class="gasto-campo" required 
                   value="${new Date().toISOString().split('T')[0]}">
        </td>
        <td>
            <input type="text" id="factura_${id}" class="gasto-campo" placeholder="Núm. factura" required>
        </td>
        <td>
            <input type="text" id="descripcion_${id}" class="gasto-campo" placeholder="Descripción del gasto" required>
        </td>
        <td>
            <div class="autocomplete-container">
                <input type="text" id="proveedor_${id}" class="gasto-campo" 
                       placeholder="Nombre del proveedor" required
                       oninput="mostrarAutocomplete(${id})"
                       onfocus="mostrarAutocomplete(${id})"
                       onblur="setTimeout(() => ocultarAutocomplete(${id}), 200)">
                <div id="autocomplete_${id}" class="autocomplete-list"></div>
            </div>
        </td>
        <td>
            <input type="text" id="monto_${id}" class="gasto-campo" placeholder="$0.00" required
                oninput="formatearMoneda(this)" 
                onblur="formatearMonedaCompleto(this); calcularTotalReembolso()"
                onkeyup="calcularTotalReembolso()">
        </td>
        <td>
            <input type="file" id="archivoPDF_${id}" accept=".pdf,.jpg,.jpeg,.png" 
                   onchange="manejarArchivoPDF(${id})" 
                   style="display: none;">
            <button type="button" id="btnSubirPDF_${id}" class="btn btn-secondary" 
                    onclick="document.getElementById('archivoPDF_${id}').click()"
                    style="padding: 4px 8px; font-size: 11px; width: 100%;">
                Subir
            </button>
            <div id="statusPDF_${id}" class="archivo-status pendiente" style="display: block;">
                Sin archivo
            </div>
        </td>
        <td>
            <input type="file" id="archivoXML_${id}" accept=".xml" 
                   onchange="manejarArchivoXML(${id})" 
                   style="display: none;">
            <button type="button" id="btnSubirXML_${id}" class="btn btn-secondary" 
                    onclick="document.getElementById('archivoXML_${id}').click()"
                    style="padding: 4px 8px; font-size: 11px; width: 100%;">
                XML
            </button>
            <div id="statusXML_${id}" class="archivo-status pendiente" style="display: block;">
                Opcional
            </div>
        </td>
        <td style="text-align: center;">
            <input type="checkbox" id="autorizado_${id}" class="checkbox-autorizado" checked 
                   onchange="calcularTotalReembolso()">
        </td>
        <td style="text-align: center;">
            <button type="button" class="btn btn-danger" onclick="eliminarFilaGasto(this)" 
                    style="padding: 5px 10px; font-size: 12px;">✕</button>
        </td>
    `;
}

// Manejar archivo PDF/Imagen
function manejarArchivoPDF(id) {
    const input = document.getElementById(`archivoPDF_${id}`);
    const status = document.getElementById(`statusPDF_${id}`);
    const btnSubir = document.getElementById(`btnSubirPDF_${id}`);
    const file = input.files[0];
    
    if (!file) return;
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Tamaño máximo: 5 MB');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        archivosPDFGastos[id] = {
            nombre: file.name,
            tipo: file.type,
            datos: e.target.result
        };
        
        // Actualizar botón
        if (btnSubir) {
            btnSubir.style.background = '#28a745';
            btnSubir.textContent = '✓ Cargado';
        }
        
        status.textContent = file.name;
        status.className = 'archivo-status cargado';
        status.style.display = 'block';
        
        // Resto del código de botones...
        const botonesAnteriores = status.parentNode.querySelectorAll('.btn-accion-archivo');
        botonesAnteriores.forEach(btn => btn.remove());
        
        const containerBotones = document.createElement('div');
        containerBotones.style.display = 'flex';
        containerBotones.style.gap = '4px';
        containerBotones.style.marginTop = '4px';
        
        const btnVer = document.createElement('button');
        btnVer.type = 'button';
        btnVer.className = 'btn-accion-archivo';
        btnVer.textContent = '👁';
        btnVer.title = 'Ver archivo';
        btnVer.onclick = () => verArchivoGasto(id, 'pdf');
        
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-accion-archivo btn-eliminar';
        btnEliminar.textContent = '🗑';
        btnEliminar.title = 'Eliminar archivo';
        btnEliminar.onclick = () => eliminarArchivoPDFGasto(id);
        
        containerBotones.appendChild(btnVer);
        containerBotones.appendChild(btnEliminar);
        status.parentNode.appendChild(containerBotones);
    };
    reader.readAsDataURL(file);
}

// Manejar archivo XML
function manejarArchivoXML(id) {
    const input = document.getElementById(`archivoXML_${id}`);
    const status = document.getElementById(`statusXML_${id}`);
    const file = input.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        archivosXMLGastos[id] = {
            nombre: file.name,
            tipo: file.type,
            datos: e.target.result
        };
        
        status.textContent = file.name;
        status.className = 'archivo-status cargado';
        status.style.display = 'block';
        
        // Limpiar botones anteriores si existen
        const botonesAnteriores = status.parentNode.querySelectorAll('.btn-accion-archivo');
        botonesAnteriores.forEach(btn => btn.remove());
        
        // Contenedor de botones
        const containerBotones = document.createElement('div');
        containerBotones.style.display = 'flex';
        containerBotones.style.gap = '4px';
        containerBotones.style.marginTop = '4px';
        
        // Botón Descargar
        const btnDescargar = document.createElement('button');
        btnDescargar.type = 'button';
        btnDescargar.className = 'btn-accion-archivo';
        btnDescargar.textContent = '⬇';
        btnDescargar.title = 'Descargar archivo';
        btnDescargar.onclick = () => descargarArchivoGasto(id, 'xml');
        
        // Botón Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-accion-archivo btn-eliminar';
        btnEliminar.textContent = '🗑';
        btnEliminar.title = 'Eliminar archivo';
        btnEliminar.onclick = () => eliminarArchivoXMLGasto(id);
        
        containerBotones.appendChild(btnDescargar);
        containerBotones.appendChild(btnEliminar);
        status.parentNode.appendChild(containerBotones);
    };
    reader.readAsDataURL(file);
}

// Ver archivo de gasto
function verArchivoGasto(id, tipo) {
    const archivo = tipo === 'pdf' ? archivosPDFGastos[id] : archivosXMLGastos[id];
    if (!archivo) return;
    
    const ventana = window.open('', '_blank');
    if (archivo.tipo === 'application/pdf') {
        ventana.document.write(`
            <html>
            <head><title>${archivo.nombre}</title></head>
            <body style="margin:0;">
                <iframe src="${archivo.datos}" style="width:100%;height:100vh;border:none;"></iframe>
            </body>
            </html>
        `);
    } else {
        ventana.document.write(`
            <html>
            <head><title>${archivo.nombre}</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
                <img src="${archivo.datos}" style="max-width:100%;max-height:100vh;">
            </body>
            </html>
        `);
    }
}

// Eliminar archivo PDF de un gasto
function eliminarArchivoPDFGasto(id) {
    if (!confirm('¿Está seguro de eliminar este archivo PDF/Imagen?')) return;
    
    // Eliminar del objeto
    delete archivosPDFGastos[id];
    
    // Limpiar input file
    const input = document.getElementById(`archivoPDF_${id}`);
    input.value = '';
    
    // Resetear botón
    const btnSubir = document.getElementById(`btnSubirPDF_${id}`);
    if (btnSubir) {
        btnSubir.style.background = '';
        btnSubir.textContent = 'Subir';
    }
    
    // Resetear status
    const status = document.getElementById(`statusPDF_${id}`);
    status.textContent = 'Sin archivo';
    status.className = 'archivo-status pendiente';
    status.style.display = 'block';
    
    // Eliminar botones
    const botones = status.parentNode.querySelectorAll('.btn-accion-archivo');
    botones.forEach(btn => btn.remove());
}

// Eliminar archivo XML de un gasto
function eliminarArchivoXMLGasto(id) {
    if (!confirm('¿Está seguro de eliminar este archivo XML?')) return;
    
    // Eliminar del objeto
    delete archivosXMLGastos[id];
    
    // Limpiar input file
    const input = document.getElementById(`archivoXML_${id}`);
    input.value = '';
    
    // Resetear status
    const status = document.getElementById(`statusXML_${id}`);
    status.textContent = 'Opcional';
    status.className = 'archivo-status pendiente';
    status.style.display = 'block';
    
    // Eliminar botones
    const botones = status.parentNode.querySelectorAll('.btn-accion-archivo');
    botones.forEach(btn => btn.remove());
}

// Descargar archivo de gasto
function descargarArchivoGasto(id, tipo) {
    const archivo = tipo === 'xml' ? archivosXMLGastos[id] : archivosPDFGastos[id];
    if (!archivo) return;
    
    const link = document.createElement('a');
    link.href = archivo.datos;
    link.download = archivo.nombre;
    link.click();
}

// Eliminar fila de gasto
function eliminarFilaGasto(btn) {
    const tbody = document.getElementById('bodyGastos');
    const totalFilas = tbody.querySelectorAll('tr').length;
    
    // No permitir eliminar si solo hay una fila
    if (totalFilas === 1) {
        alert('Debe mantener al menos un gasto. Si desea eliminarlo, limpie los campos.');
        return;
    }
    
    const fila = btn.closest('tr');
    const inputs = fila.querySelectorAll('input[type="file"]');
    
    // Obtener el ID de la fila
    const id = inputs[0].id.split('_')[1];
    
    // Eliminar archivos asociados
    delete archivosPDFGastos[id];
    delete archivosXMLGastos[id];
    
    fila.remove();
    calcularTotalReembolso();
    
    console.log(`✓ Fila de gasto ${id} eliminada. Filas restantes: ${tbody.querySelectorAll('tr').length}`);
}

function limpiarFilaGasto(id) {
    // Limpiar campos
    const fecha = document.getElementById(`fecha_${id}`);
    const factura = document.getElementById(`factura_${id}`);
    const descripcion = document.getElementById(`descripcion_${id}`);
    const proveedor = document.getElementById(`proveedor_${id}`);
    const monto = document.getElementById(`monto_${id}`);
    
    if (fecha) fecha.value = new Date().toISOString().split('T')[0];
    if (factura) factura.value = '';
    if (descripcion) descripcion.value = '';
    if (proveedor) proveedor.value = '';
    if (monto) monto.value = '';
    
    // Limpiar archivos
    eliminarArchivoPDFGasto(id);
    eliminarArchivoXMLGasto(id);
    
    // Recalcular total
    calcularTotalReembolso();
}

// Calcular total a reembolsar
function calcularTotalReembolso() {
    const filas = document.querySelectorAll('#bodyGastos tr');
    let total = 0;
    
    filas.forEach(fila => {
        const inputs = fila.querySelectorAll('input[type="text"], input[type="checkbox"]');
        
        // Buscar el campo de monto (contiene $)
        let montoInput = null;
        let autorizadoCheckbox = null;
        
        inputs.forEach(input => {
            if (input.type === 'text' && input.value.includes('$')) {
                montoInput = input;
            }
            if (input.type === 'checkbox') {
                autorizadoCheckbox = input;
            }
        });
        
        if (montoInput && autorizadoCheckbox && autorizadoCheckbox.checked) {
            const montoValor = extraerValorMoneda(montoInput.value);
            total += montoValor;
        }
    });
    
    document.getElementById('totalReembolsar').textContent = 
        '$' + total.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Obtener datos de gastos con archivos
function obtenerDatosGastos() {
    const filas = document.querySelectorAll('#bodyGastos tr');
    const gastos = [];
    
    filas.forEach((fila, index) => {
        const inputs = fila.querySelectorAll('input');
        const idFila = inputs[5].id.split('_')[1]; // Obtener ID del input file
        
        gastos.push({
            fecha: inputs[0].value,
            factura: inputs[1].value,
            descripcion: inputs[2].value,
            proveedor: inputs[3].value, // Ahora es texto libre
            monto: extraerValorMoneda(inputs[4].value),
            archivoPDF: archivosPDFGastos[idFila] || null,
            archivoXML: archivosXMLGastos[idFila] || null,
            autorizado: inputs[7].checked
        });
    });
    
    return gastos;
}

// Validar gastos caja chica
function validarGastosCajaChica() {
    const filas = document.querySelectorAll('#bodyGastos tr');
    
    if (filas.length === 0) {
        alert('Debe agregar al menos un gasto');
        return false;
    }
    
    let gastosValidos = 0;
    let errores = [];
    
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const inputs = fila.querySelectorAll('input');
        const numeroFila = i + 1;
        
        // Obtener el ID de la fila para los archivos
        const idFila = inputs[5].id.split('_')[1];
        
        // Validar campos obligatorios de texto
        const fecha = inputs[0].value;
        const factura = inputs[1].value;
        const descripcion = inputs[2].value;
        const proveedor = inputs[3].value;
        const monto = inputs[4].value;
        
        if (!fecha || !factura || !descripcion || !proveedor || !monto) {
            errores.push(`Fila ${numeroFila}: Todos los campos de texto son obligatorios`);
            continue;
        }
        
        // Validar que el monto sea válido
        const montoNumerico = extraerValorMoneda(monto);
        if (montoNumerico <= 0) {
            errores.push(`Fila ${numeroFila}: El monto debe ser mayor a $0.00`);
            continue;
        }
        
        // Validar archivo PDF obligatorio
        if (!archivosPDFGastos[idFila]) {
            errores.push(`Fila ${numeroFila}: Debe adjuntar el comprobante PDF/Imagen`);
            continue;
        }
        
        gastosValidos++;
    }
    
    // Mostrar errores si existen
    if (errores.length > 0) {
        const mensajeError = 'Se encontraron los siguientes errores:\n\n' + errores.join('\n');
        alert(mensajeError);
        return false;
    }
    
    // Validar que haya al menos un gasto válido
    if (gastosValidos === 0) {
        alert('Debe tener al menos un gasto completo y válido');
        return false;
    }
    
    return true;
}

// Cargar datos del beneficiario para caja chica
function cargarDatosBeneficiarioCajaChica() {
    const beneficiarioId = document.getElementById('beneficiarioCajaChica').value;
    if (!beneficiarioId) {
        document.getElementById('proveedorCajaChica').value = '';
        document.getElementById('bancoCajaChica').value = '';
        document.getElementById('cuentaCajaChica').value = '';
        document.getElementById('clabeCajaChica').value = '';
        return;
    }
    
    const beneficiario = beneficiarios.find(b => b.id == beneficiarioId);
    if (beneficiario) {
        document.getElementById('proveedorCajaChica').value = beneficiario.razonSocial || beneficiario.nombre;
        document.getElementById('bancoCajaChica').value = beneficiario.banco;
        document.getElementById('cuentaCajaChica').value = beneficiario.cuenta;
        document.getElementById('clabeCajaChica').value = beneficiario.clabe;
    }
}

// Cargar beneficiarios en select de caja chica
function cargarBeneficiariosSelectCajaChica() {
    const select = document.getElementById('beneficiarioCajaChica');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione solicitante</option>';
    
    // Filtrar solo jefes de sucursal
    const jefesSucursal = beneficiarios.filter(b => b.tipo === 'jefe_sucursal');
    
    jefesSucursal.forEach(beneficiario => {
        const option = document.createElement('option');
        option.value = beneficiario.id;
        option.textContent = beneficiario.nombre;
        select.appendChild(option);
    });
}

// Mostrar autocompletado de proveedores
function mostrarAutocomplete(id) {
    const input = document.getElementById(`proveedor_${id}`);
    const lista = document.getElementById(`autocomplete_${id}`);
    const valor = input.value.toLowerCase().trim();
    
    if (valor.length === 0) {
        lista.classList.remove('active');
        return;
    }
    
    // Filtrar proveedores
    const proveedoresFiltrados = beneficiarios.filter(b => 
        (b.tipo === 'proveedor' || !b.tipo) && 
        b.nombre.toLowerCase().includes(valor)
    );
    
    if (proveedoresFiltrados.length === 0) {
        lista.classList.remove('active');
        return;
    }
    
    // Crear items de la lista
    lista.innerHTML = '';
    proveedoresFiltrados.forEach(proveedor => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        
        // Resaltar coincidencia
        const nombreProveedor = proveedor.nombre;
        const index = nombreProveedor.toLowerCase().indexOf(valor);
        const antes = nombreProveedor.substring(0, index);
        const coincidencia = nombreProveedor.substring(index, index + valor.length);
        const despues = nombreProveedor.substring(index + valor.length);
        
        item.innerHTML = `${antes}<strong>${coincidencia}</strong>${despues}`;
        
        item.onclick = () => seleccionarProveedor(id, proveedor.nombre);
        lista.appendChild(item);
    });
    
    lista.classList.add('active');
}

// Ocultar autocompletado
function ocultarAutocomplete(id) {
    const lista = document.getElementById(`autocomplete_${id}`);
    lista.classList.remove('active');
}

// Seleccionar proveedor del autocompletado
function seleccionarProveedor(id, nombreProveedor) {
    const input = document.getElementById(`proveedor_${id}`);
    input.value = nombreProveedor;
    ocultarAutocomplete(id);
}

async function crearSolicitud(event) {
    event.preventDefault();
    
    console.log('=== CREAR/ACTUALIZAR SOLICITUD ===');
    
    const form = document.getElementById('solicitudForm');
    const editingId = form.getAttribute('data-editing-id');
    const isEditing = editingId !== null && editingId !== '';
    
    console.log('Modo edición:', isEditing);
    console.log('ID editando:', editingId);
    
    const tipoFormato = document.getElementById('tipoFormato').value;
    const empresaId = document.getElementById('empresa').value;
    const sucursal = document.getElementById('sucursal').value;
    
    console.log('Tipo formato:', tipoFormato);
    console.log('Empresa ID:', empresaId);
    console.log('Sucursal:', sucursal);
    
    // Si NO estamos editando, validar empresa
    if (!isEditing && !empresaId) {
        alert('Por favor seleccione una empresa');
        return;
    }
    
    // Validaciones según el tipo de formato
    if (tipoFormato === 'cajaChica') {
        // Validaciones para Caja Chica
        if (!validarGastosCajaChica()) {
            return;
        }
        
        const beneficiarioCajaChicaId = document.getElementById('beneficiarioCajaChica').value;
        if (!beneficiarioCajaChicaId) {
            alert('Por favor seleccione un solicitante');
            return;
        }
        
        if (!empresaId) {
            alert('Por favor seleccione una empresa');
            return;
        }
    } else {
        // Validaciones para formato normal
        const beneficiarioId = document.getElementById('beneficiario').value;
        
        if (!beneficiarioId) {
            alert('Por favor seleccione un beneficiario');
            return;
        }
        
        if (!empresaId) {
            alert('Por favor seleccione una empresa');
            return;
        }
    }
    
    if (isEditing) {
        // ===== MODO EDICIÓN =====
        console.log('Entrando a modo edición');
        
        const solicitud = solicitudes.find(s => s.id == editingId);
        
        if (!solicitud) {
            alert('Error: Solicitud no encontrada');
            console.error('Solicitud no encontrada con ID:', editingId);
            return;
        }
        
        if (solicitud.estado !== 'pendiente') {
            alert('Solo se pueden editar solicitudes con estado pendiente');
            console.error('Estado de solicitud no es pendiente:', solicitud.estado);
            return;
        }
        
        console.log('Solicitud encontrada:', solicitud.numero);
        console.log('Tipo de formato:', solicitud.tipoFormato);
        
        try {
            if (solicitud.tipoFormato === 'cajaChica') {
                // ===== ACTUALIZAR SOLICITUD DE CAJA CHICA =====
                console.log('Actualizando solicitud de caja chica');
                
                const beneficiarioCajaChicaId = document.getElementById('beneficiarioCajaChica').value;
                
                if (!beneficiarioCajaChicaId) {
                    alert('Por favor seleccione un solicitante');
                    return;
                }
                
                if (!validarGastosCajaChica()) {
                    console.log('Validación de gastos falló');
                    return;
                }
                
                const gastos = obtenerDatosGastos();
                const totalReembolsar = gastos
                    .filter(g => g.autorizado)
                    .reduce((sum, g) => sum + g.monto, 0);
                
                console.log('Gastos obtenidos:', gastos.length);
                console.log('Total a reembolsar:', totalReembolsar);
                
                // Actualizar campos
                solicitud.empresaId = parseInt(empresaId);
                solicitud.beneficiarioId = parseInt(beneficiarioCajaChicaId);
                solicitud.proveedor = document.getElementById('proveedorCajaChica').value;
                solicitud.banco = document.getElementById('bancoCajaChica').value;
                solicitud.cuenta = document.getElementById('cuentaCajaChica').value;
                solicitud.clabe = document.getElementById('clabeCajaChica').value;
                solicitud.ciudad = '';
                solicitud.subtotal = totalReembolsar;
                solicitud.total = totalReembolsar;
                solicitud.montoConceptoGeneral = totalReembolsar;
                solicitud.gastosCajaChica = gastos;
                
                console.log('Datos actualizados, guardando en Supabase...');
                
                // Guardar en Supabase
                await actualizarSolicitudSupabase(solicitud);
                
                // En lugar de recargar todo, solo actualizar el array local
                const index = solicitudes.findIndex(s => s.id === solicitud.id);
                if (index !== -1) {
                    solicitudes[index] = { ...solicitud };
                }

                // NO recargar desde Supabase inmediatamente
                // await cargarDatosDesdeSupabase();
                
                console.log('✓ Solicitud de caja chica actualizada');
                
            } else {
                // ===== ACTUALIZAR SOLICITUD NORMAL =====
                console.log('Actualizando solicitud normal');
                
                const beneficiarioId = document.getElementById('beneficiario').value;
                const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) || 0;
                const montoImpuestos = extraerValorMoneda(document.getElementById('montoImpuestos').value);
                
                solicitud.empresaId = parseInt(empresaId);
                solicitud.beneficiarioId = parseInt(beneficiarioId);
                solicitud.proveedor = document.getElementById('proveedor').value;
                solicitud.conceptoGeneral = document.getElementById('conceptoGeneral').value;
                solicitud.montoConceptoGeneral = extraerValorMoneda(document.getElementById('montoConceptoGeneral').value);
                solicitud.conceptoPago = document.getElementById('conceptoPago').value;
                solicitud.claveAnuncio = document.getElementById('claveAnuncio').value || '';
                solicitud.subtotal = extraerValorMoneda(document.getElementById('subtotal').value);
                solicitud.descuento = 0;
                solicitud.porcentajeImpuestos = porcentajeImpuestos;
                solicitud.impuestos = montoImpuestos;
                solicitud.total = extraerValorMoneda(document.getElementById('total').value);
                solicitud.banco = document.getElementById('banco').value;
                solicitud.cuenta = document.getElementById('cuenta').value;
                solicitud.clabe = document.getElementById('clabe').value;
                solicitud.ciudad = '';
                
                await actualizarSolicitudSupabase(solicitud);
                //await cargarDatosDesdeSupabase();
                // Actualizar array local
                const index = solicitudes.findIndex(s => s.id === solicitud.id);
                if (index !== -1) {
                    solicitudes[index] = { ...solicitud };
                }

                console.log('✓ Solicitud normal actualizada');
            }
            
            alert('Solicitud actualizada exitosamente: ' + solicitud.numero);
            
            // Limpiar modo edición
            form.removeAttribute('data-editing-id');
            
            // Restaurar botón
            const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
            submitButton.textContent = 'Crear Solicitud';
            submitButton.style.background = '';
            
            // Ocultar botón cancelar
            const btnCancelar = document.getElementById('btnCancelarEdicion');
            if (btnCancelar) {
                btnCancelar.style.display = 'none';
            }
            
            limpiarFormulario();
            cargarSolicitudes();
            switchTab('solicitudes');
            
        } catch (error) {
            console.error('Error al actualizar solicitud:', error);
            alert('Error al actualizar la solicitud: ' + error.message);
        }
        
        return; // Salir de la función después de actualizar
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
        const archivosAdjuntos = await procesarArchivosNuevaSolicitud();
        
        let solicitud;
        
        if (tipoFormato === 'cajaChica') {
            // Solicitud de Reembolso de Caja Chica
            const beneficiarioCajaChicaId = document.getElementById('beneficiarioCajaChica').value;
            const gastos = obtenerDatosGastos();
            const totalReembolsar = gastos
                .filter(g => g.autorizado)
                .reduce((sum, g) => sum + g.monto, 0);
            
            const beneficiario = beneficiarios.find(b => b.id == beneficiarioCajaChicaId);
            
            solicitud = {
                id: Date.now(),
                numero: numero,
                numeroConsecutivo: numeroConsecutivo,
                sucursal: sucursal,
                empresaId: parseInt(empresaId),
                beneficiarioId: parseInt(beneficiarioCajaChicaId),
                proveedor: document.getElementById('proveedorCajaChica').value,
                conceptoGeneral: 'Reembolso de gastos de caja chica',
                montoConceptoGeneral: totalReembolsar,
                conceptoPago: 'Reembolso de gastos',
                claveAnuncio: '',
                subtotal: totalReembolsar,
                descuento: 0,
                porcentajeImpuestos: 0,
                impuestos: 0,
                total: totalReembolsar,
                banco: document.getElementById('bancoCajaChica').value,
                cuenta: document.getElementById('cuentaCajaChica').value,
                clabe: document.getElementById('clabeCajaChica').value,
                ciudad: '',
                estado: 'pendiente',
                fechaSolicitud: new Date().toISOString(),
                fechaAutorizacion: null,
                solicitudesVinculadas: [],
                archivos: archivosAdjuntos,
                creadoPor: usuarioActual.username,
                tipoFormato: 'cajaChica',
                gastosCajaChica: gastos
            };
        } else {
            // Solicitud Normal
            const beneficiarioId = document.getElementById('beneficiario').value;
            const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) || 0;
            const montoImpuestos = extraerValorMoneda(document.getElementById('montoImpuestos').value);
            
            const solicitudesVinculadasSelect = document.getElementById('solicitudVinculada');
            const solicitudesVinculadas = Array.from(solicitudesVinculadasSelect.selectedOptions)
                .map(option => option.value)
                .filter(val => val !== '');
            
            solicitud = {
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
                ciudad: '',
                estado: 'pendiente',
                fechaSolicitud: new Date().toISOString(),
                fechaAutorizacion: null,
                solicitudesVinculadas: solicitudesVinculadas,
                archivos: archivosAdjuntos,
                creadoPor: usuarioActual.username,
                tipoFormato: 'normal',
                gastosCajaChica: null
            };
        }
        
        try {
            const solicitudGuardada = await guardarSolicitudSupabase(solicitud);
            solicitudes.push(solicitudGuardada);
            contadores[sucursal] = numeroConsecutivo;
            
            // Recargar solicitudes después de crear
            await cargarSolicitudesSupabase();
            
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
            
            // Si era caja chica, asegurar que solo haya una fila
            const tipoFormato = document.getElementById('tipoFormato').value;
            if (tipoFormato === 'cajaChica') {
                const tbody = document.getElementById('bodyGastos');
                if (tbody && tbody.querySelectorAll('tr').length === 0) {
                    agregarFilaGasto();
                }
            }
        } else {
            limpiarFormulario();
            cargarSolicitudes();
            switchTab('solicitudes');
        }
    }
}

function limpiarFormulario() {
    // Limpiar formulario básico
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
    
    // Limpiar solicitudes vinculadas
    const solicitudVinculadaSelect = document.getElementById('solicitudVinculada');
    if (solicitudVinculadaSelect) {
        Array.from(solicitudVinculadaSelect.options).forEach((opt, index) => {
            opt.selected = (opt.value === '');
        });
    }

    // Limpiar archivos de nueva solicitud
    document.getElementById('archivosNuevaSolicitud').value = '';
    document.getElementById('listaArchivosNuevaSolicitud').innerHTML = '';
    
    // ===== LIMPIAR CAJA CHICA =====
    
    // 1. Limpiar campos de beneficiario de caja chica
    const beneficiarioCajaChica = document.getElementById('beneficiarioCajaChica');
    const proveedorCajaChica = document.getElementById('proveedorCajaChica');
    const bancoCajaChica = document.getElementById('bancoCajaChica');
    const cuentaCajaChica = document.getElementById('cuentaCajaChica');
    const clabeCajaChica = document.getElementById('clabeCajaChica');
    
    if (beneficiarioCajaChica) beneficiarioCajaChica.value = '';
    if (proveedorCajaChica) proveedorCajaChica.value = '';
    if (bancoCajaChica) bancoCajaChica.value = '';
    if (cuentaCajaChica) cuentaCajaChica.value = '';
    if (clabeCajaChica) clabeCajaChica.value = '';
    
    // 2. Limpiar todas las filas de gastos
    const tbody = document.getElementById('bodyGastos');
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    // 3. Resetear contadores y archivos de gastos
    contadorFilasGastos = 0;
    archivosPDFGastos = {};
    archivosXMLGastos = {};
    
    // 4. Resetear total a reembolsar
    const totalReembolsar = document.getElementById('totalReembolsar');
    if (totalReembolsar) {
        totalReembolsar.textContent = '$0.00';
    }
    
    // 5. Agregar UNA sola fila inicial si estamos en modo caja chica
    const tipoFormato = document.getElementById('tipoFormato').value;
    if (tipoFormato === 'cajaChica' && tbody) {
        agregarFilaGasto();
    }
    
    console.log('✓ Formulario limpiado completamente');
    console.log('  - Contador gastos reseteado a:', contadorFilasGastos);
    console.log('  - Archivos PDF limpiados');
    console.log('  - Archivos XML limpiados');

    console.log('=== FORMULARIO LIMPIO ===');
    console.log('Contador:', contadorFilasGastos);
    console.log('Archivos PDF:', Object.keys(archivosPDFGastos).length);
    console.log('Archivos XML:', Object.keys(archivosXMLGastos).length);
    console.log('Filas en tabla:', document.querySelectorAll('#bodyGastos tr').length);
    console.log('========================');
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
    
    // Ordenar por fecha descendente (más reciente primero)
    solicitudesFiltradas.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud));
    
    // Separar por estado
    const pendientes = solicitudesFiltradas.filter(s => s.estado === 'pendiente');
    const finalizadas = solicitudesFiltradas.filter(s => s.estado === 'autorizada' || s.estado === 'cancelada');
    
    // Función para crear fila
    const crearFila = (solicitud) => {
        const empresa = empresas.find(e => e.id === solicitud.empresaId);
        const row = tbody.insertRow();
        
        const tieneComprobante = solicitud.comprobantePago ? true : false;
        const iconoComprobante = tieneComprobante ? '📄' : '';
        
        const puedeEditar = tienePermiso('editar_solicitud') && solicitud.estado === 'pendiente';
        const puedeAutorizar = tienePermiso('autorizar_solicitud') && solicitud.estado === 'pendiente';
        const puedeCancelar = tienePermiso('cancelar_solicitud');
        const puedeDescargarArchivos = tienePermiso('descargar_archivos');
        const puedeEliminar = usuarioActual && usuarioActual.rol === 'admin'; // ✅ NUEVO

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
                ${puedeEliminar ? 
                    `<button class="btn" onclick="eliminarSolicitud(${solicitud.id})" 
                            style="padding: 5px; font-size: 16px; background: #8b0000; color: white; grid-column: 1 / -1;" title="Eliminar permanentemente (ADMIN)">
                        🗑 ELIMINAR
                    </button>` : ''}
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
        
        const columnaOrigen = `
            <div style="font-size: 13px; line-height: 1.5;">
                <div style="font-weight: 600; color: var(--primary-color);">${solicitud.numero}</div>
                <div style="color: #6c757d; font-size: 12px;">${getSucursalName(solicitud.sucursal)}</div>
                <div style="color: #495057; font-size: 12px;">${empresa ? empresa.razonSocial : 'N/A'}</div>
            </div>
        `;
        
        // Contar TODOS los archivos
        let totalArchivos = 0;

        // Archivos adjuntos generales
        if (solicitud.archivos && solicitud.archivos.length > 0) {
            totalArchivos += solicitud.archivos.length;
        }

        // Archivos de gastos de caja chica
        if (solicitud.tipoFormato === 'cajaChica' && solicitud.gastosCajaChica) {
            solicitud.gastosCajaChica.forEach(gasto => {
                if (gasto.archivoPDF) totalArchivos++;
                if (gasto.archivoXML) totalArchivos++;
            });
        }

        // Crear columna de archivos
        let columnaArchivos = '';

        if (puedeDescargarArchivos) {
            columnaArchivos = `
                <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                    <span style="font-size: 11px; font-weight: 600; color: #495057;">${totalArchivos} archivo(s)</span>
                    
                    ${totalArchivos > 0 ? `
                        <button class="btn" onclick="descargarArchivosZip(${solicitud.id})" 
                                style="padding: 4px 10px; font-size: 10px; background: #17a2b8; color: white; white-space: nowrap;">
                            ↓ ZIP
                        </button>
                    ` : ''}
                    
                    ${solicitud.tipoFormato !== 'cajaChica' ? `
                        <button class="btn" onclick="subirFacturaSolicitud(${solicitud.id})" 
                                style="padding: 4px 10px; font-size: 10px; background: #28a745; color: white; white-space: nowrap;">
                            ↑ PDF y XML
                        </button>
                    ` : ''}
                </div>
            `;
        } else {
            // Sin permisos, solo mostrar contador
            columnaArchivos = totalArchivos > 0 
                ? `<span style="font-size: 11px;">${totalArchivos} archivo(s)</span>` 
                : '-';
        }
        
        row.innerHTML = `
            <td style="min-width: 180px;">${columnaOrigen}</td>
            <td style="min-width: 280px;">
                <div style="font-size: 13px; line-height: 1.5;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                        <span style="font-weight: 600; color: #2c3e50;">
                            ${solicitud.proveedor}
                        </span>
                        ${solicitud.tipoFormato === 'cajaChica' 
                            ? '<span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">REEMBOLSO</span>' 
                            : ''}
                    </div>
                    <div style="color: #6c757d; font-size: 12px; line-height: 1.4;">
                        ${solicitud.conceptoGeneral.length > 90 
                            ? solicitud.conceptoGeneral.substring(0, 90) + '...' 
                            : solicitud.conceptoGeneral}
                    </div>
                </div>
            </td>
            <td style="white-space: nowrap;">$${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
            <td><span class="status ${solicitud.estado}">${solicitud.estado.toUpperCase()}</span></td>
            <td style="white-space: nowrap;">${formatearFecha(solicitud.fechaSolicitud)}</td>
            <td style="text-align: center;">${columnaArchivos}</td>
            <td>${columnaPagada}</td>
            <td class="acciones-column">${botonesAccion}</td>
        `;
    };
    
    // Agregar sección de pendientes
    if (pendientes.length > 0) {
        const headerRow = tbody.insertRow();
        headerRow.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
        headerRow.innerHTML = `
            <td colspan="8" style="padding: 12px; font-weight: 700; color: #856404; text-align: center; font-size: 14px;">
                📋 SOLICITUDES PENDIENTES (${pendientes.length})
            </td>
        `;
        
        pendientes.forEach(sol => crearFila(sol));
    }
    
    // Agregar sección de finalizadas
    if (finalizadas.length > 0) {
        const headerRow = tbody.insertRow();
        headerRow.style.background = 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)';
        headerRow.innerHTML = `
            <td colspan="8" style="padding: 12px; font-weight: 700; color: #3d4f82; text-align: center; font-size: 14px;">
                📁 SOLICITUDES FINALIZADAS (${finalizadas.length})
            </td>
        `;
        
        finalizadas.forEach(sol => crearFila(sol));
    }
    
    if (pendientes.length === 0 && finalizadas.length === 0) {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                No hay solicitudes para mostrar
            </td>
        `;
    }
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
        //'Ciudad',
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
            //sol.ciudad || '',
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
    console.log('=== EDITANDO SOLICITUD ===');
    console.log('ID recibido:', id);
    
    const solicitud = solicitudes.find(s => s.id === id);
    console.log('Solicitud encontrada:', solicitud);
    
    if (!solicitud || solicitud.estado !== 'pendiente') {
        alert('Solo se pueden editar solicitudes con estado pendiente');
        console.log('Estado de solicitud:', solicitud?.estado);
        return;
    }
    
    console.log('Cambiando a pestaña nueva...');
    // Cambiar a la pestaña de nueva solicitud
    switchTab('nueva');
    
    // Determinar el tipo de formato
    const esCajaChica = solicitud.tipoFormato === 'cajaChica';
    console.log('¿Es caja chica?:', esCajaChica);
    
    if (esCajaChica) {
        // ===== EDITAR SOLICITUD DE CAJA CHICA =====
        console.log('Cargando modo edición CAJA CHICA...');
        
        // Cambiar al formato de caja chica
        cambiarFormato('cajaChica');
        
        // **USAR requestAnimationFrame para asegurar que el DOM esté listo**
        requestAnimationFrame(() => {
            setTimeout(() => {
                cargarDatosCajaChicaEdicion(solicitud, id);
            }, 50);
        });
        
    } else {
        // ===== EDITAR SOLICITUD NORMAL =====
        console.log('Cargando modo edición NORMAL...');
        
        // Cambiar al formato normal
        cambiarFormato('normal');
        
        // **USAR requestAnimationFrame para asegurar que el DOM esté listo**
        requestAnimationFrame(() => {
            setTimeout(() => {
                cargarDatosNormalEdicion(solicitud, id);
            }, 50);
        });
    }
}

function cargarDatosNormalEdicion(solicitud, solicitudId) {
    console.log('→ Asignando valores a campos NORMAL...');
    
    try {
        // Cargar datos básicos
        document.getElementById('empresa').value = solicitud.empresaId;
        document.getElementById('sucursal').value = solicitud.sucursal;
        
        // **DESHABILITAR SUCURSAL**
        const sucursal = document.getElementById('sucursal');
        sucursal.disabled = true;
        sucursal.style.background = '#f8f9fa';
        sucursal.style.cursor = 'not-allowed';
        
        document.getElementById('beneficiario').value = solicitud.beneficiarioId;
        
        // Cargar datos del beneficiario
        cargarDatosBeneficiario();
        
        document.getElementById('conceptoGeneral').value = solicitud.conceptoGeneral;
        document.getElementById('montoConceptoGeneral').value = '$' + solicitud.montoConceptoGeneral.toLocaleString('es-MX', {minimumFractionDigits: 2});
        document.getElementById('conceptoPago').value = solicitud.conceptoPago || '';
        document.getElementById('claveAnuncio').value = solicitud.claveAnuncio || '';
        document.getElementById('subtotal').value = '$' + solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2});
        
        // ❌ LÍNEA ELIMINADA:
        // document.getElementById('descuento').value = '$' + solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2});
        
        document.getElementById('impuestos').value = solicitud.porcentajeImpuestos;
        
        // Calcular total
        calcularTotal();
        
        console.log('✓ Valores asignados correctamente');
        
        // Marcar modo edición AL FINAL
        finalizarConfiguracionEdicion(solicitudId, solicitud);
        
    } catch (error) {
        console.error('✗ Error al cargar datos:', error);
        alert('Error al cargar los datos de la solicitud. Por favor, intente nuevamente.');
    }
}

// Nueva función para cargar datos de solicitud CAJA CHICA en modo edición
function cargarDatosCajaChicaEdicion(solicitud, solicitudId) {
    console.log('Asignando valores a campos CAJA CHICA...');
    
    // Verificar que los elementos existan
    const empresa = document.getElementById('empresa');
    const sucursal = document.getElementById('sucursal');
    const beneficiarioCajaChica = document.getElementById('beneficiarioCajaChica');
    
    if (!empresa || !sucursal || !beneficiarioCajaChica) {
        console.error('Elementos no encontrados. Reintentando...');
        setTimeout(() => cargarDatosCajaChicaEdicion(solicitud, solicitudId), 100);
        return;
    }
    
    console.log('Elementos encontrados. Procediendo...');
    
    // Cargar datos básicos
    empresa.value = solicitud.empresaId;
    sucursal.value = solicitud.sucursal;
    beneficiarioCajaChica.value = solicitud.beneficiarioId;
    
    // **DESHABILITAR SUCURSAL**
    sucursal.disabled = true;
    sucursal.style.background = '#f8f9fa';
    sucursal.style.cursor = 'not-allowed';
    
    // Cargar datos del beneficiario
    cargarDatosBeneficiarioCajaChica();
    
    // Limpiar tabla de gastos actual
    const tbody = document.getElementById('bodyGastos');
    tbody.innerHTML = '';
    
    // Resetear contadores y archivos
    contadorFilasGastos = 0;
    archivosPDFGastos = {};
    archivosXMLGastos = {};
    
    // Cargar gastos de la solicitud
    if (solicitud.gastosCajaChica && solicitud.gastosCajaChica.length > 0) {
        solicitud.gastosCajaChica.forEach(gasto => {
            const id = ++contadorFilasGastos;
            
            // Crear fila
            const fila = tbody.insertRow();
            fila.innerHTML = `
                <td>
                    <input type="date" id="fecha_${id}" class="gasto-campo" required 
                           value="${gasto.fecha}">
                </td>
                <td>
                    <input type="text" id="factura_${id}" class="gasto-campo" 
                           placeholder="Núm. factura" required value="${gasto.factura}">
                </td>
                <td>
                    <input type="text" id="descripcion_${id}" class="gasto-campo" 
                           placeholder="Descripción del gasto" required value="${gasto.descripcion}">
                </td>
                <td>
                    <div class="autocomplete-container">
                        <input type="text" id="proveedor_${id}" class="gasto-campo" 
                               placeholder="Nombre del proveedor" required value="${gasto.proveedor}"
                               oninput="mostrarAutocomplete(${id})"
                               onfocus="mostrarAutocomplete(${id})"
                               onblur="setTimeout(() => ocultarAutocomplete(${id}), 200)">
                        <div id="autocomplete_${id}" class="autocomplete-list"></div>
                    </div>
                </td>
                <td>
                    <input type="text" id="monto_${id}" class="gasto-campo" 
                           placeholder="$0.00" required value="$${gasto.monto.toLocaleString('es-MX', {minimumFractionDigits: 2})}"
                        oninput="formatearMoneda(this)" 
                        onblur="formatearMonedaCompleto(this); calcularTotalReembolso()"
                        onkeyup="calcularTotalReembolso()">
                </td>
                <td>
                    <input type="file" id="archivoPDF_${id}" accept=".pdf,.jpg,.jpeg,.png" 
                           onchange="manejarArchivoPDF(${id})" 
                           style="display: none;">
                    <button type="button" id="btnSubirPDF_${id}" class="btn btn-secondary" 
                            onclick="document.getElementById('archivoPDF_${id}').click()"
                            style="padding: 4px 8px; font-size: 11px; width: 100%; ${gasto.archivoPDF ? 'background: #28a745;' : ''}">
                        ${gasto.archivoPDF ? '✓ Cargado' : 'Subir'}
                    </button>
                    <div id="statusPDF_${id}" class="archivo-status ${gasto.archivoPDF ? 'cargado' : 'pendiente'}" 
                         style="display: block;">
                        ${gasto.archivoPDF ? gasto.archivoPDF.nombre : 'Sin archivo'}
                    </div>
                </td>
                <td>
                    <input type="file" id="archivoXML_${id}" accept=".xml" 
                           onchange="manejarArchivoXML(${id})" 
                           style="display: none;">
                    <button type="button" id="btnSubirXML_${id}" class="btn btn-secondary" 
                            onclick="document.getElementById('archivoXML_${id}').click()"
                            style="padding: 4px 8px; font-size: 11px; width: 100%; ${gasto.archivoXML ? 'background: #28a745;' : ''}">
                        ${gasto.archivoXML ? '✓ XML' : 'XML'}
                    </button>
                    <div id="statusXML_${id}" class="archivo-status ${gasto.archivoXML ? 'cargado' : 'pendiente'}" 
                         style="display: block;">
                        ${gasto.archivoXML ? gasto.archivoXML.nombre : 'Opcional'}
                    </div>
                </td>
                <td style="text-align: center;">
                    <input type="checkbox" id="autorizado_${id}" class="checkbox-autorizado" 
                           ${gasto.autorizado ? 'checked' : ''} onchange="calcularTotalReembolso()">
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-danger" onclick="eliminarFilaGasto(this)" 
                            style="padding: 5px 10px; font-size: 12px;">✕</button>
                </td>
            `;
            
            // Restaurar archivos
            if (gasto.archivoPDF) {
                archivosPDFGastos[id] = gasto.archivoPDF;
                
                // Agregar botones de acción para PDF
                const statusPDF = document.getElementById(`statusPDF_${id}`);
                const containerBotones = document.createElement('div');
                containerBotones.style.display = 'flex';
                containerBotones.style.gap = '4px';
                containerBotones.style.marginTop = '4px';
                
                const btnVer = document.createElement('button');
                btnVer.type = 'button';
                btnVer.className = 'btn-accion-archivo';
                btnVer.textContent = '👁';
                btnVer.title = 'Ver archivo';
                btnVer.onclick = () => verArchivoGasto(id, 'pdf');
                
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'button';
                btnEliminar.className = 'btn-accion-archivo btn-eliminar';
                btnEliminar.textContent = '🗑';
                btnEliminar.title = 'Eliminar archivo';
                btnEliminar.onclick = () => eliminarArchivoPDFGasto(id);
                
                containerBotones.appendChild(btnVer);
                containerBotones.appendChild(btnEliminar);
                statusPDF.parentNode.appendChild(containerBotones);
            }
            
            if (gasto.archivoXML) {
                archivosXMLGastos[id] = gasto.archivoXML;
                
                // Agregar botones de acción para XML
                const statusXML = document.getElementById(`statusXML_${id}`);
                const containerBotones = document.createElement('div');
                containerBotones.style.display = 'flex';
                containerBotones.style.gap = '4px';
                containerBotones.style.marginTop = '4px';
                
                const btnDescargar = document.createElement('button');
                btnDescargar.type = 'button';
                btnDescargar.className = 'btn-accion-archivo';
                btnDescargar.textContent = '⬇';
                btnDescargar.title = 'Descargar archivo';
                btnDescargar.onclick = () => descargarArchivoGasto(id, 'xml');
                
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'button';
                btnEliminar.className = 'btn-accion-archivo btn-eliminar';
                btnEliminar.textContent = '🗑';
                btnEliminar.title = 'Eliminar archivo';
                btnEliminar.onclick = () => eliminarArchivoXMLGasto(id);
                
                containerBotones.appendChild(btnDescargar);
                containerBotones.appendChild(btnEliminar);
                statusXML.parentNode.appendChild(containerBotones);
            }
        });
        
        // Calcular total
        calcularTotalReembolso();
    }
    
    // Marcar modo edición AL FINAL
    finalizarConfiguracionEdicion(solicitudId, solicitud);
}

// Función helper para finalizar la configuración del modo edición
function finalizarConfiguracionEdicion(id, solicitud) {
    // Marcar que estamos editando (guardar el ID)
    const form = document.getElementById('solicitudForm');
    form.setAttribute('data-editing-id', id);
    console.log('Atributo data-editing-id establecido:', form.getAttribute('data-editing-id'));
    
    // Cambiar el texto del botón
    const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
    submitButton.textContent = 'Actualizar Solicitud';
    submitButton.style.background = '#ffc107';

    // Mostrar botón cancelar
    const btnCancelar = document.getElementById('btnCancelarEdicion');
    if (btnCancelar) {
        btnCancelar.style.display = 'inline-block';
    }

    console.log('=== MODO EDICIÓN ACTIVADO ===');
    alert('Editando solicitud ' + solicitud.numero + '. Modifique los campos necesarios y presione "Actualizar Solicitud"');
}

// Nueva función helper para finalizar la configuración del modo edición
function finalizarConfiguracionEdicion(id, solicitud) {
    // Marcar que estamos editando (guardar el ID)
    const form = document.getElementById('solicitudForm');
    form.setAttribute('data-editing-id', id);
    console.log('Atributo data-editing-id establecido:', form.getAttribute('data-editing-id'));
    
    // Cambiar el texto del botón
    const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
    submitButton.textContent = 'Actualizar Solicitud';
    submitButton.style.background = '#ffc107';

    // Mostrar botón cancelar
    const btnCancelar = document.getElementById('btnCancelarEdicion');
    if (btnCancelar) {
        btnCancelar.style.display = 'inline-block';
    }

    console.log('=== MODO EDICIÓN ACTIVADO ===');
    alert('Editando solicitud ' + solicitud.numero + '. Modifique los campos necesarios y presione "Actualizar Solicitud"');
}

function cancelarEdicion() {
    if (!confirm('¿Está seguro de cancelar la edición? Los cambios no guardados se perderán.')) {
        return;
    }
    
    console.log('Cancelando edición...');
    
    const form = document.getElementById('solicitudForm');
    form.removeAttribute('data-editing-id');
    
    // Restaurar botón de submit
    const submitButton = document.querySelector('#solicitudForm button[type="submit"]');
    submitButton.textContent = 'Crear Solicitud';
    submitButton.style.background = '';
    
    // Ocultar botón cancelar
    const btnCancelar = document.getElementById('btnCancelarEdicion');
    if (btnCancelar) {
        btnCancelar.style.display = 'none';
    }
    
    // Limpiar formulario
    limpiarFormulario();
    
    // Volver a la pestaña de solicitudes
    switchTab('solicitudes');
    
    console.log('✓ Edición cancelada');
}

// SECCIÓN 2 - Visualización y PDF Mejorado

function verDetalle(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (!solicitud) return;
    
    // ===== DEBUGGING TEMPORAL =====
    console.log('=== VER DETALLE DE SOLICITUD ===');
    console.log('ID:', solicitud.id);
    console.log('Número:', solicitud.numero);
    console.log('Tipo:', solicitud.tipoFormato);
    console.log('Gastos Caja Chica:', solicitud.gastosCajaChica);
    console.log('================================');
    // ==============================

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
    
    // Determinar el título según el tipo de formato
const tituloSolicitud = solicitud.tipoFormato === 'cajaChica' 
    ? 'SOLICITUD DE REEMBOLSO DE GASTOS DE CAJA CHICA' 
    : 'SOLICITUD DE FONDOS';

// ===== VERIFICACIÓN CRÍTICA =====
// console.log('=== VERIFICANDO TIPO DE FORMATO ===');
// console.log('ID Solicitud:', solicitud.id);
// console.log('Tipo formato:', solicitud.tipoFormato);
// console.log('¿Es caja chica?:', solicitud.tipoFormato === 'cajaChica');
// console.log('Gastos disponibles:', solicitud.gastosCajaChica);
// console.log('================================');

// Generar contenido según el tipo de formato
let htmlTablaContenido = '';
let htmlSeccionConcepto = '';

if (solicitud.tipoFormato === 'cajaChica') {
    // ===== FORMATO CAJA CHICA =====
    // Verificar que existan gastos en esta solicitud
    if (!solicitud.gastosCajaChica || !Array.isArray(solicitud.gastosCajaChica)) {
        console.warn('No hay gastos de caja chica para esta solicitud:', solicitud.id);
        solicitud.gastosCajaChica = [];
    }
    
    // Filtrar SOLO los gastos autorizados de ESTA solicitud
    const gastosAutorizados = solicitud.gastosCajaChica.filter(g => g.autorizado === true);
    const totalAutorizado = gastosAutorizados.reduce((sum, g) => sum + (g.monto || 0), 0);
    
    console.log('Gastos de esta solicitud:', solicitud.gastosCajaChica);
    console.log('Gastos autorizados:', gastosAutorizados);
    console.log('Total autorizado:', totalAutorizado);
    
    htmlTablaContenido = `
        <div style="margin: 8px 0; padding: 6px; background: #f8f9fa; border: 1px solid #9c27b0;">
            <strong style="font-size: 9px; display: block; margin-bottom: 4px;">DESGLOSE DE GASTOS AUTORIZADOS:</strong>
            <table style="width: 100%; font-size: 9px; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e0e0e0;">
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Fecha Factura</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Factura/Nota</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Descripción</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: left;">Proveedor</th>
                        <th style="padding: 3px; border: 1px solid #ccc; text-align: right;">Monto</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (gastosAutorizados.length > 0) {
        gastosAutorizados.forEach(gasto => {
            const fechaFormateada = formatearFecha(gasto.fecha);
            htmlTablaContenido += `
                <tr>
                    <td style="padding: 3px; border: 1px solid #ccc;">${fechaFormateada}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;">${gasto.factura}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;">${gasto.descripcion}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;">${gasto.proveedor || 'N/A'}</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: right;">$${gasto.monto.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                </tr>
            `;
        });
    } else {
        htmlTablaContenido += `
            <tr>
                <td colspan="5" style="padding: 3px; border: 1px solid #ccc; text-align: center; color: #999;">
                    No hay gastos autorizados
                </td>
            </tr>
        `;
    }
    
    htmlTablaContenido += `
                <tr style="background: #fff3cd; font-weight: bold;">
                    <td colspan="4" style="padding: 3px; border: 1px solid #ccc; text-align: right;">TOTAL A REEMBOLSAR:</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: right;">$${totalAutorizado.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                </tr>
            </tbody>
        </table>
        </div>
    `;
    
    // Botón para descargar archivos (solo para caja chica)
    if (gastosAutorizados.length > 0 && gastosAutorizados.some(g => g.archivoPDF || g.archivoXML)) {
        htmlTablaContenido += `
            <div style="margin-top: 10px; text-align: center;">
                <button class="btn" onclick="descargarArchivosGastosZip(${solicitud.id})" 
                        style="padding: 8px 16px; background: #17a2b8; color: white; font-size: 11px;">
                    📦 Descargar Todos los Archivos (ZIP)
                </button>
            </div>
        `;
    }
    
    // NO mostrar sección de concepto para caja chica
    htmlSeccionConcepto = '';
    
} else {
    // ===== FORMATO NORMAL =====
    const solicitudesRelacionadas = solicitudes.filter(sol => 
        sol.conceptoGeneral === solicitud.conceptoGeneral && sol.estado !== 'cancelada');
    
    const totalPagosRealizados = solicitudesRelacionadas
        .reduce((sum, sol) => sum + sol.subtotal, 0);
    
    const montoPendiente = (solicitud.montoConceptoGeneral || 0) - totalPagosRealizados;
    
    htmlTablaContenido = `
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
            
            htmlTablaContenido += `
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
        htmlTablaContenido += `
            <tr>
                <td colspan="5" style="padding: 3px; border: 1px solid #ccc; text-align: center; color: #999;">
                    No hay pagos registrados para este concepto
                </td>
            </tr>
        `;
    }
    
    htmlTablaContenido += `
                <tr style="background: #fff3cd; font-weight: bold;">
                    <td colspan="3" style="padding: 3px; border: 1px solid #ccc; text-align: right;">MONTO PENDIENTE DE PAGO:</td>
                    <td style="padding: 3px; border: 1px solid #ccc; text-align: right;">$${montoPendiente.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td style="padding: 3px; border: 1px solid #ccc;"></td>
                </tr>
            </tbody>
        </table>
        </div>
    `;
    
    // SÍ mostrar sección de concepto para formato normal
    htmlSeccionConcepto = `
        <!-- CONCEPTO (solo para formato normal) -->
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
    `;
}
    
    content.innerHTML = `
        <div id="contenidoImprimible" style="font-family: Arial, sans-serif; padding: 10px; max-width: 100%; margin: 0 auto; background: white;">
            
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
                    <h2 style="text-align: center; color: #d01f34; margin: 0 0 4px 0; font-size: 14px;">${tituloSolicitud}</h2>
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
                    
                    ${htmlTablaContenido}
                    
                    <!-- PROVEEDOR/SOLICITANTE -->
                    <div style="margin: 8px 0;">
                        <div style="background: #d01f34; color: white; padding: 4px; font-weight: bold; font-size: 9px;">
                            ${solicitud.tipoFormato === 'cajaChica' ? 'SOLICITANTE' : 'PROVEEDOR'}
                        </div>
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
                                ${solicitud.tipoFormato !== 'cajaChica' ? `
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>RAZÓN SOCIAL:</strong></td>
                                    <td style="padding: 2px; word-wrap: break-word;">${proveedor ? proveedor.razonSocial : solicitud.proveedor}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>RFC:</strong></td>
                                    <td style="padding: 2px;">${proveedor ? proveedor.rfc : 'N/A'}</td>
                                </tr>
                                ` : ''}
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
                                <!-- <tr> -->
                                <!--     <td style="padding: 2px; vertical-align: top;"><strong>CIUDAD:</strong></td> -->
                                <!--     <td style="padding: 2px;">${solicitud.ciudad}</td> -->
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    ${solicitud.tipoFormato !== 'cajaChica' ? `
                    <!-- CONCEPTO (solo para formato normal) -->
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
                    ` : ''}
                    
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
                                ${solicitud.tipoFormato !== 'cajaChica' ? `
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Descuento:</strong></td>
                                    <td style="padding: 2px;">$${solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px; vertical-align: top;"><strong>Impuestos (${solicitud.porcentajeImpuestos || 0}%):</strong></td>
                                    <td style="padding: 2px;">$${(solicitud.impuestos || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                ` : ''}
                                <tr style="font-weight: bold; font-size: 9px; background: #f0f0f0;">
                                    <td style="padding: 3px; vertical-align: top;"><strong>TOTAL A ${solicitud.tipoFormato === 'cajaChica' ? 'REEMBOLSAR' : 'PAGAR'}:</strong></td>
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
            await cargarSolicitudesSupabase(); // Recargar solicitudes
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
            await cargarSolicitudesSupabase(); // Recargar solicitudes
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
    
    // yPos += 7;
    // doc.text('Ciudad:', 25, yPos);
    // doc.text(solicitud.ciudad, 50, yPos);

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

// Abrir modal para subir factura (PDF y XML) a una solicitud normal
async function subirFacturaSolicitud(solicitudId) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) {
        alert('Solicitud no encontrada');
        return;
    }
    
    if (solicitud.tipoFormato === 'cajaChica') {
        alert('Las solicitudes de reembolso de caja chica tienen sus archivos en cada gasto');
        return;
    }
    
    solicitudActualArchivos = solicitudId;
    
    const modal = document.getElementById('archivosModal');
    const info = document.getElementById('archivosSolicitudInfo');
    const lista = document.getElementById('listaArchivos');
    
    info.innerHTML = `
        <p><strong>Solicitud:</strong> ${solicitud.numero}</p>
        <p><strong>Concepto:</strong> ${solicitud.conceptoGeneral}</p>
        <p style="color: #17a2b8; font-weight: 600; margin-top: 10px;">
            📄 Subir Factura (PDF y XML)
        </p>
    `;
    
    // ✅ CARGAR ARCHIVOS BAJO DEMANDA (solo si no están ya cargados)
    if (!solicitud.archivos || solicitud.archivos.length === 0) {
        mostrarCargando(true);
        try {
            await cargarArchivosDeUnaolicitud(solicitudId);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        } finally {
            mostrarCargando(false);
        }
    }
    
    const puedeDescargar = tienePermiso('descargar_archivos');
    
    let htmlArchivos = '<h4>Archivos Subidos:</h4>';
    
    if (!solicitud.archivos || solicitud.archivos.length === 0) {
        htmlArchivos += '<p style="color: #999;">No hay archivos subidos</p>';
    } else {
        solicitud.archivos.forEach((archivo, index) => {
            const extension = obtenerExtensionDeArchivo(archivo.nombre).toLowerCase();
            const esPDF = extension === 'pdf' || archivo.tipo === 'application/pdf';
            const esXML = extension === 'xml' || archivo.tipo === 'application/xml' || archivo.tipo === 'text/xml';
            const esImagen = archivo.tipo?.startsWith('image/');
            
            let icono = '📄';
            if (esPDF) icono = '📕';
            else if (esXML) icono = '📃';
            else if (esImagen) icono = '🖼️';
            
            htmlArchivos += `
                <div class="archivo-item">
                    <span>${icono} ${archivo.nombre} <small style="color: #999;">(${formatearFecha(archivo.fecha)})</small></span>
                    <div style="display: flex; gap: 5px;">
                        ${puedeDescargar ? `
                            <button class="btn btn-secondary" onclick="descargarArchivo(${solicitudId}, ${index})" 
                                    style="padding: 5px 10px; font-size: 12px;">
                                ↓ Descargar
                            </button>
                            <button class="btn btn-danger" onclick="eliminarArchivo(${solicitudId}, ${index})" 
                                    style="padding: 5px 10px; font-size: 12px;">
                                🗑 Eliminar
                            </button>
                        ` : '<span style="color: #999; font-size: 12px;">Solo admin/coordinador puede descargar</span>'}
                    </div>
                </div>
            `;
        });
    }
    
    lista.innerHTML = htmlArchivos;
    modal.style.display = 'block';
}

// Descargar todos los archivos de una solicitud en ZIP. Bajo demanda
async function descargarArchivosZip(solicitudId) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) {
        alert('Solicitud no encontrada');
        return;
    }
    
    mostrarCargando(true);
    
    // ✅ CARGAR ARCHIVOS BAJO DEMANDA si no están cargados
    if (!solicitud.archivos || solicitud.archivos.length === 0) {
        try {
            await cargarArchivosDeUnaSolicitud(solicitudId);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    }
    
    const zip = new JSZip();
    let totalArchivos = 0;
    
    try {
        // Si es solicitud de caja chica, incluir archivos de gastos
        if (solicitud.tipoFormato === 'cajaChica' && solicitud.gastosCajaChica) {
            const gastosAutorizados = solicitud.gastosCajaChica.filter(g => g.autorizado);
            
            gastosAutorizados.forEach((gasto, index) => {
                const numeroGasto = index + 1;
                const prefijo = `Gasto_${numeroGasto}_${gasto.factura}`;
                
                // Agregar PDF/Imagen
                if (gasto.archivoPDF) {
                    const base64Data = gasto.archivoPDF.datos.split(',')[1];
                    const extension = obtenerExtensionDeArchivo(gasto.archivoPDF.nombre);
                    zip.file(`${prefijo}.${extension}`, base64Data, {base64: true});
                    totalArchivos++;
                }
                
                // Agregar XML
                if (gasto.archivoXML) {
                    const base64Data = gasto.archivoXML.datos.split(',')[1];
                    zip.file(`${prefijo}.xml`, base64Data, {base64: true});
                    totalArchivos++;
                }
            });
        }
        
        // Agregar archivos adjuntos generales de la solicitud
        if (solicitud.archivos && solicitud.archivos.length > 0) {
            solicitud.archivos.forEach((archivo, index) => {
                const base64Data = archivo.datos.split(',')[1];
                const nombreArchivo = archivo.nombre || `archivo_${index + 1}`;
                zip.file(`Adjuntos/${nombreArchivo}`, base64Data, {base64: true});
                totalArchivos++;
            });
        }
        
        if (totalArchivos === 0) {
            mostrarCargando(false);
            alert('No hay archivos para descargar en esta solicitud');
            return;
        }
        
        // Generar el ZIP
        const content = await zip.generateAsync({type: 'blob'});
        mostrarCargando(false);
        
        // Descargar
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${solicitud.numero}_archivos.zip`;
        link.click();
        
        alert(`ZIP generado con ${totalArchivos} archivo(s)`);
        
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al generar ZIP:', error);
        alert('Error al generar el archivo ZIP');
    }
}

// Función auxiliar para obtener extensión de archivo
function obtenerExtensionDeArchivo(nombreArchivo) {
    const partes = nombreArchivo.split('.');
    return partes[partes.length - 1];
}

async function subirArchivos() {
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
    
    mostrarCargando(true);
    
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validar tamaño (máximo 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert(`El archivo "${file.name}" es demasiado grande. Tamaño máximo: 10 MB`);
                continue;
            }
            
            // Leer archivo
            const reader = new FileReader();
            const archivoPromise = new Promise((resolve) => {
                reader.onload = function(e) {
                    resolve({
                        nombre: file.name,
                        tipo: file.type,
                        datos: e.target.result,
                        fecha: new Date().toISOString()
                    });
                };
                reader.readAsDataURL(file);
            });
            
            const archivo = await archivoPromise;
            solicitud.archivos.push(archivo);
        }
        
        // Guardar cambios
        await actualizarSolicitudSupabase(solicitud);
        
        // Actualizar array local
        const index = solicitudes.findIndex(s => s.id === solicitudActualArchivos);
        if (index !== -1) {
            solicitudes[index] = { ...solicitud };
        }
        
        mostrarCargando(false);
        
        alert(`${files.length} archivo(s) subido(s) exitosamente`);
        
        // Refrescar modal y tabla
        subirFacturaSolicitud(solicitudActualArchivos);
        cargarSolicitudes();
        
        input.value = '';
        
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al subir archivos:', error);
        alert('Error al subir archivos: ' + error.message);
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

async function eliminarArchivo(solicitudId, archivoIndex) {
    if (!confirm('¿Está seguro de eliminar este archivo?')) return;
    
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !solicitud.archivos) return;
    
    const nombreArchivo = solicitud.archivos[archivoIndex].nombre;
    
    mostrarCargando(true);
    
    try {
        solicitud.archivos.splice(archivoIndex, 1);
        
        // Guardar cambios
        await actualizarSolicitudSupabase(solicitud);
        
        // Actualizar array local
        const index = solicitudes.findIndex(s => s.id === solicitudId);
        if (index !== -1) {
            solicitudes[index] = { ...solicitud };
        }
        
        mostrarCargando(false);
        
        // Refrescar modal y tabla
        subirFacturaSolicitud(solicitudActualArchivos);
        cargarSolicitudes();
        
        alert(`Archivo "${nombreArchivo}" eliminado exitosamente`);
        
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al eliminar archivo:', error);
        alert('Error al eliminar archivo: ' + error.message);
    }
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

function editarUsuario(username) {
    mostrarFormularioUsuario(username);
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

    // ✅ AGREGAR EVENTO EXPLÍCITAMENTE
    rolSelect.onchange = toggleSucursalField;
    
    if (username) {
        // MODO EDICIÓN
        title.textContent = 'Editar Usuario';
        const usuario = usuarios[username];
        
        document.getElementById('usuarioUsername').value = username;
        document.getElementById('usuarioUsername').readOnly = true;
        document.getElementById('usuarioNombre').value = usuario.nombre;
        document.getElementById('usuarioPassword').value = usuario.password;
        document.getElementById('usuarioRol').value = usuario.rol;
        document.getElementById('usuarioSucursal').value = usuario.sucursal || '';
        
        // ✅ NUEVO: Cargar gerencia
        if (usuario.gerencia) {
            document.getElementById('usuarioGerencia').value = usuario.gerencia;
        }
        
        // ✅ NUEVO: Cargar empresa (Contabilidad - una sola)
        if (usuario.empresaId) {
            // Primero hacer visible el campo y llenarlo
            toggleSucursalField();
            setTimeout(() => {
                document.getElementById('usuarioEmpresa').value = usuario.empresaId;
            }, 100);
        }
        
        // ✅ NUEVO: Cargar empresas (Tesorería - múltiples)
        if (usuario.empresasIds && usuario.empresasIds.length > 0) {
            // Primero hacer visible el campo y llenarlo
            toggleSucursalField();
            setTimeout(() => {
                const empresasSelect = document.getElementById('usuarioEmpresas');
                if (empresasSelect && empresasSelect.options.length > 0) {
                    Array.from(empresasSelect.options).forEach(option => {
                        if (usuario.empresasIds.includes(parseInt(option.value))) {
                            option.selected = true;
                        }
                    });
                }
            }, 100);
        }
        
        // Actualizar campos visibles según el rol
        toggleSucursalField();
        
    } else {
        // MODO CREACIÓN
        title.textContent = 'Nuevo Usuario';
        document.getElementById('usuarioUsername').readOnly = false;
    }
    
    modal.style.display = 'block';
}

function toggleSucursalField() {
    console.log('🔍 toggleSucursalField llamada');
    
    const rol = document.getElementById('usuarioRol').value;
    console.log('Rol seleccionado:', rol);
    
    const rolConfig = rolesConfig[rol];
    console.log('Configuración del rol:', rolConfig);
    console.log('requiereGerencia:', rolConfig?.requiereGerencia);
    
    // Campo Sucursal
    const sucursalGroup = document.getElementById('usuarioSucursalGroup');
    const sucursalSelect = document.getElementById('usuarioSucursal');
    
    console.log('sucursalGroup:', sucursalGroup);
    
    if (rolConfig && rolConfig.requiereSucursal) {
        sucursalGroup.style.display = 'block';
        sucursalSelect.required = true;
    } else {
        sucursalGroup.style.display = 'none';
        sucursalSelect.required = false;
        sucursalSelect.value = '';
    }
    
    // ✅ Campo Gerencia
    const gerenciaGroup = document.getElementById('usuarioGerenciaGroup');
    const gerenciaSelect = document.getElementById('usuarioGerencia');
    
    console.log('🔍 gerenciaGroup encontrado:', gerenciaGroup);
    console.log('🔍 gerenciaSelect encontrado:', gerenciaSelect);
    
    if (rolConfig && rolConfig.requiereGerencia) {
        console.log('✅ Mostrando campo de gerencia');
        gerenciaGroup.style.display = 'block';
        gerenciaSelect.required = true;
    } else {
        console.log('❌ Ocultando campo de gerencia');
        gerenciaGroup.style.display = 'none';
        gerenciaSelect.required = false;
        gerenciaSelect.value = '';
    }
    
    // Campo Empresa (Contabilidad - una sola)
    const empresaGroup = document.getElementById('usuarioEmpresaGroup');
    const empresaSelect = document.getElementById('usuarioEmpresa');
    
    if (rolConfig && rolConfig.requiereEmpresa) {
        empresaGroup.style.display = 'block';
        empresaSelect.required = true;
        // Llenar con empresas disponibles
        cargarEmpresasEnSelect(empresaSelect, false);
    } else {
        empresaGroup.style.display = 'none';
        empresaSelect.required = false;
        empresaSelect.value = '';
    }
    
    // Campo Empresas (Tesorería - múltiples)
    const empresasGroup = document.getElementById('usuarioEmpresasGroup');
    const empresasSelect = document.getElementById('usuarioEmpresas');
    
    if (rolConfig && rolConfig.requiereEmpresas) {
        empresasGroup.style.display = 'block';
        empresasSelect.required = true;
        // Llenar con empresas disponibles
        cargarEmpresasEnSelect(empresasSelect, true);
    } else {
        empresasGroup.style.display = 'none';
        empresasSelect.required = false;
        empresasSelect.innerHTML = '';
    }
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

function guardarUsuario(event) {
    event.preventDefault();
    
    const username = document.getElementById('usuarioUsername').value;
    const nombre = document.getElementById('usuarioNombre').value;
    const password = document.getElementById('usuarioPassword').value;
    const rol = document.getElementById('usuarioRol').value;
    const sucursal = document.getElementById('usuarioSucursal').value || null;
    const gerencia = document.getElementById('usuarioGerencia').value || null;  // ✅ NUEVO
    const empresaId = document.getElementById('usuarioEmpresa').value || null;  // ✅ NUEVO
    
    // ✅ NUEVO: Obtener múltiples empresas para Tesorería
    let empresasIds = null;
    const empresasSelect = document.getElementById('usuarioEmpresas');
    if (empresasSelect && empresasSelect.options.length > 0) {
        empresasIds = Array.from(empresasSelect.selectedOptions).map(opt => parseInt(opt.value));
        if (empresasIds.length === 0) empresasIds = null;
    }
    
    if (!editandoUsuario && usuarios[username]) {
        alert('El usuario ya existe');
        return;
    }
    
    usuarios[username] = {
        password: password,
        rol: rol,
        sucursal: sucursal,
        nombre: nombre,
        gerencia: gerencia,        // ✅ NUEVO
        empresaId: empresaId ? parseInt(empresaId) : null,  // ✅ NUEVO
        empresasIds: empresasIds   // ✅ NUEVO
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
        const tipoTexto = proveedor.tipo === 'jefe_sucursal' ? 'Jefe de Sucursal' : 'Proveedor';
        
        row.innerHTML = `
            <td>
                <strong>${proveedor.nombre}</strong>
                ${proveedor.razonSocial ? `<br><small style="color: #666;">${proveedor.razonSocial}</small>` : ''}
            </td>
            <td>${proveedor.rfc || 'N/A'}</td>
            <td><span style="padding: 4px 8px; background: ${proveedor.tipo === 'jefe_sucursal' ? '#e3f2fd' : '#fff3e0'}; border-radius: 4px; font-size: 12px;">${tipoTexto}</span></td>
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
            document.getElementById('proveedorTipo').value = proveedor.tipo || 'proveedor';
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
            await cargarBeneficiariosSupabase(true); // Forzar recarga
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
    const tipo = document.getElementById('proveedorTipo').value;
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
                proveedor.tipo = tipo;
                proveedor.banco = banco;
                proveedor.cuenta = cuenta;
                proveedor.clabe = clabe;
                
                if (usarSupabase) {
                    await guardarBeneficiarioSupabase(proveedor);
                    await cargarBeneficiariosSupabase(true); // Forzar recarga
                } else {
                    guardarDatosLocalStorage();
                }
            }
        } else {
            const nuevoProveedor = {
                nombre: nombre,
                razonSocial: razonSocial,
                rfc: rfc,
                tipo: tipo,
                banco: banco,
                cuenta: cuenta,
                clabe: clabe,
                csf: null
            };
            
            if (usarSupabase) {
                const proveedorGuardado = await guardarBeneficiarioSupabase(nuevoProveedor);
                await cargarBeneficiariosSupabase(true); // Forzar recarga
            } else {
                nuevoProveedor.id = Date.now();
                beneficiarios.push(nuevoProveedor);
                guardarDatosLocalStorage();
            }
        }
        
        cerrarModalProveedor();
        
        cargarProveedores();
        cargarBeneficiariosSelect();
        cargarBeneficiariosSelectCajaChica();
        
        alert(editandoProveedor ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente');
    } catch (error) {
        console.error('ERROR al guardar:', error);
        alert('Error al guardar proveedor: ' + error.message);
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

// Nueva función auxiliar para cargar empresas en los selects
function cargarEmpresasEnSelect(selectElement, multiple) {
    if (!multiple) {
        selectElement.innerHTML = '<option value="">Seleccione empresa</option>';
    } else {
        selectElement.innerHTML = '';
    }
    
    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa.id;
        option.textContent = `${empresa.razonSocial} (${empresa.rfc})`;
        selectElement.appendChild(option);
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
            await cargarEmpresasSupabase(true); // Forzar recarga
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
                await cargarEmpresasSupabase(true); // Forzar recarga
            }
        } else {
            const nuevaEmpresa = {
                razonSocial: razonSocial,
                rfc: rfc
            };
            
            if (usarSupabase) {
                await guardarEmpresaSupabase(nuevaEmpresa);
                await cargarEmpresasSupabase(true); // Forzar recarga
            } else {
                nuevaEmpresa.id = Date.now();
                empresas.push(nuevaEmpresa);
                guardarDatosLocalStorage();
            }
        }
        
        cerrarModalEmpresa();
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
            const beneficiariosTemp = JSON.parse(beneficiariosGuardados);
            // Asegurar que todos tengan la propiedad tipo
            beneficiarios = beneficiariosTemp.map(b => ({
                ...b,
                tipo: b.tipo || 'proveedor' // <-- LÍNEA CRÍTICA
            }));
            //console.log('Beneficiarios cargados desde localStorage:', beneficiarios);
        } catch (e) {
            //console.error('Error al cargar beneficiarios:', e);
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
        await cargarSolicitudesSupabase(); // Recargar solicitudes
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

function cargarDatosLocalStorage() {
    cargarDatos(); // Llama a la función existente
}

function guardarDatosLocalStorage() {
    try {
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
        localStorage.setItem('contadores', JSON.stringify(contadores));
        localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
        localStorage.setItem('empresas', JSON.stringify(empresas));
        //console.log('Datos guardados en localStorage correctamente');
    } catch (e) {
        //console.error('Error al guardar en localStorage:', e);
    }
}

async function descargarArchivosGastosZip(solicitudId) {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !solicitud.gastosCajaChica) {
        alert('No hay archivos para descargar');
        return;
    }
    
    const gastosAutorizados = solicitud.gastosCajaChica.filter(g => g.autorizado);
    const archivosParaDescargar = [];
    
    gastosAutorizados.forEach((gasto, index) => {
        if (gasto.archivoPDF) {
            archivosParaDescargar.push({
                nombre: `${index + 1}_${gasto.factura}_${gasto.archivoPDF.nombre}`,
                datos: gasto.archivoPDF.datos
            });
        }
        if (gasto.archivoXML) {
            archivosParaDescargar.push({
                nombre: `${index + 1}_${gasto.factura}_${gasto.archivoXML.nombre}`,
                datos: gasto.archivoXML.datos
            });
        }
    });
    
    if (archivosParaDescargar.length === 0) {
        alert('No hay archivos adjuntos en los gastos autorizados');
        return;
    }
    
    // Nota: La funcionalidad de ZIP requiere una librería externa
    // Por ahora, descargar archivos individualmente
    if (confirm(`Se descargarán ${archivosParaDescargar.length} archivos. ¿Desea continuar?`)) {
        archivosParaDescargar.forEach((archivo, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = archivo.datos;
                link.download = archivo.nombre;
                link.click();
            }, index * 500); // Retraso de 500ms entre descargas
        });
        
        alert('Descargando archivos...');
    }
}

async function eliminarSolicitud(id) {
    // Verificar que solo el admin pueda eliminar
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
        alert('Solo el administrador puede eliminar solicitudes de la base de datos');
        return;
    }
    
    const solicitud = solicitudes.find(s => s.id === id);
    if (!solicitud) {
        alert('Solicitud no encontrada');
        return;
    }
    
    // Confirmación con advertencia fuerte
    const confirmacion = confirm(
        `⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE ⚠️\n\n` +
        `¿Está completamente seguro de ELIMINAR PERMANENTEMENTE la siguiente solicitud?\n\n` +
        `Número: ${solicitud.numero}\n` +
        `Proveedor: ${solicitud.proveedor}\n` +
        `Concepto: ${solicitud.conceptoGeneral}\n` +
        `Total: $${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}\n` +
        `Estado: ${solicitud.estado}\n\n` +
        `Esta solicitud será eliminada COMPLETAMENTE de la base de datos.`
    );
    
    if (!confirmacion) return;
    
    // Segunda confirmación
    const segundaConfirmacion = confirm(
        `¿REALMENTE desea eliminar la solicitud ${solicitud.numero}?\n\n` +
        `Esta es su última oportunidad para cancelar.`
    );
    
    if (!segundaConfirmacion) return;
    
    try {
        mostrarCargando(true);
        
        // Eliminar de Supabase
        await eliminarSolicitudSupabase(id);
        
        // Eliminar del array local
        const index = solicitudes.findIndex(s => s.id === id);
        if (index > -1) {
            solicitudes.splice(index, 1);
        }
        
        mostrarCargando(false);
        
        // Recargar la tabla
        cargarSolicitudes();
        
        alert(`✓ Solicitud ${solicitud.numero} eliminada permanentemente de la base de datos`);
        
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al eliminar solicitud:', error);
        alert('Error al eliminar la solicitud: ' + error.message);
    }
}