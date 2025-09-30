// SECCIÓN 1 - Variables globales y funciones de inicialización

let usuarios = {
    'ags_jefe': { password: 'ags2025', rol: 'jefe', sucursal: 'AGS', nombre: 'Jefe Aguascalientes' },
    'leo_jefe': { password: 'leo2025', rol: 'jefe', sucursal: 'LEO', nombre: 'Jefe León' },
    'can_jefe': { password: 'can2025', rol: 'jefe', sucursal: 'CAN', nombre: 'Jefe Cancún' },
    'mty_jefe': { password: 'mty2025', rol: 'jefe', sucursal: 'MTY', nombre: 'Jefe Monterrey' },
    'gdl_jefe': { password: 'gdl2025', rol: 'jefe', sucursal: 'GDL', nombre: 'Jefe Guadalajara' },
    'vsa_jefe': { password: 'vsa2025', rol: 'jefe', sucursal: 'VSA', nombre: 'Jefe Villahermosa' },
    'coordinador': { password: 'coord2025', rol: 'coordinador', sucursal: null, nombre: 'Coordinador de Sucursales' },
    'smaurer': { password: 'smaurer', rol: 'admin', sucursal: null, nombre: 'Sergio Maurer - Administrador General' }
};

let beneficiarios = [
    {
        id: 1,
        nombre: 'ESPECTACULARES, S.A. DE C.V.',
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
let contadores = { AGS: 0, LEO: 0, CAN: 0, MTY: 0, GDL: 0, VSA: 0 };
let editandoUsuario = null;
let editandoBeneficiario = null;
let editandoEmpresa = null;
let solicitudActualArchivos = null;
let usuarioActual = null;

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
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
    cargarBeneficiariosSelect();
    cargarEmpresasSelect();
    cargarSolicitudesVinculadas();
}

function obtenerNombreRol(rol) {
    const roles = {
        'admin': 'Administrador General',
        'coordinador': 'Coordinador de Sucursales',
        'jefe': 'Jefe de Sucursal'
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
        'VSA': 'Villahermosa'
    };
    return nombres[code] || code;
}

function switchTab(tabName) {
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
    const camposMoneda = ['montoConceptoGeneral', 'subtotal', 'descuento'];
    
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
    if (!select) return;
    select.innerHTML = '<option value="" selected>Sin vincular</option>';
    
    solicitudes.forEach(solicitud => {
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

function cargarBeneficiariosSelect() {
    const select = document.getElementById('beneficiario');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione beneficiario</option>';
    
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
        document.getElementById('proveedor').value = beneficiario.nombre;
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

function crearSolicitud(event) {
    event.preventDefault();
    
    const beneficiarioId = document.getElementById('beneficiario').value;
    const empresaId = document.getElementById('empresa').value;
    const sucursal = document.getElementById('sucursal').value;
    const numeroAutomatico = document.getElementById('numeroAutomatico').checked;
    
    if (!beneficiarioId) {
        alert('Por favor seleccione un beneficiario');
        return;
    }
    
    if (!empresaId) {
        alert('Por favor seleccione una empresa');
        return;
    }
    
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
    
    const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) || 0;
    const montoImpuestos = extraerValorMoneda(document.getElementById('montoImpuestos').value);
    
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
        descuento: extraerValorMoneda(document.getElementById('descuento').value),
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
    
    solicitudes.push(solicitud);
    
    if (numeroConsecutivo > contadores[sucursal]) {
        contadores[sucursal] = numeroConsecutivo;
    }
    
    guardarDatos();
    
    alert('Solicitud creada exitosamente con número: ' + numero);
    limpiarFormulario();
    switchTab('solicitudes');
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
    document.getElementById('descuento').value = '$0.00';
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
    
    solicitudes.forEach(solicitud => {
        const empresa = empresas.find(e => e.id === solicitud.empresaId);
        const row = tbody.insertRow();
        
        const botonesAccion = `
            <button class="btn" onclick="verDetalle(${solicitud.id})" style="padding: 5px 10px; font-size: 12px;">Ver</button>
            ${solicitud.estado === 'pendiente' ? 
                `<button class="btn btn-success" onclick="autorizarSolicitud(${solicitud.id})" style="padding: 5px 10px; font-size: 12px;">Autorizar</button>` : 
                ''}
            <button class="btn btn-danger" onclick="cancelarSolicitud(${solicitud.id})" style="padding: 5px 10px; font-size: 12px;">Cancelar</button>
        `;
        
        row.innerHTML = `
            <td>${solicitud.numero}</td>
            <td>${getSucursalName(solicitud.sucursal)}</td>
            <td>${empresa ? empresa.razonSocial : 'N/A'}</td>
            <td>${solicitud.proveedor}</td>
            <td>${solicitud.conceptoGeneral.substring(0, 30)}...</td>
            <td>$${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
            <td><span class="status ${solicitud.estado}">${solicitud.estado.toUpperCase()}</span></td>
            <td>${new Date(solicitud.fechaSolicitud).toLocaleDateString('es-MX')}</td>
            <td class="acciones-column">${botonesAccion}</td>
        `;
    });
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
    
    let htmlVinculadas = '';
    if (solicitud.solicitudesVinculadas && solicitud.solicitudesVinculadas.length > 0) {
        htmlVinculadas = '<div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 3px solid #d01f34;"><strong>Solicitudes Vinculadas:</strong><ul style="margin: 5px 0 0 20px;">';
        solicitud.solicitudesVinculadas.forEach(idVinculada => {
            const solVinculada = solicitudes.find(s => s.id == idVinculada);
            if (solVinculada) {
                htmlVinculadas += `<li>${solVinculada.numero} - ${solVinculada.conceptoGeneral}</li>`;
            }
        });
        htmlVinculadas += '</ul></div>';
    }
    
    content.innerHTML = `
        <div id="contenidoImprimible" style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: white;">
            
            <!-- Logo ATM -->
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="logo-atm.png" alt="ATM Espectaculares" style="max-width: 300px; height: auto;" onerror="this.style.display='none'">
            </div>
            
            <!-- Encabezado con borde -->
            <div style="border: 3px solid #d01f34; padding: 20px; margin-bottom: 20px;">
                <div style="border: 1px solid #606060; padding: 15px;">
                    <h2 style="text-align: center; color: #d01f34; margin: 0 0 10px 0; font-size: 22px;">SOLICITUD DE FONDOS</h2>
                    <h3 style="text-align: center; color: #606060; margin: 0; font-size: 18px;">${solicitud.numero}</h3>
                    <hr style="border: none; border-top: 1px solid #d01f34; margin: 15px 0;">
                    
                    <!-- Información General -->
                    <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border: 1px solid #606060;">
                        <table style="width: 100%; font-size: 12px;">
                            <tr>
                                <td style="padding: 5px; width: 30%;"><strong>EMPRESA:</strong></td>
                                <td style="padding: 5px;">${empresa ? empresa.razonSocial : 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>RFC:</strong></td>
                                <td style="padding: 5px;">${empresa ? empresa.rfc : 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>PROVEEDOR:</strong></td>
                                <td style="padding: 5px;">${solicitud.proveedor}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>FECHA:</strong></td>
                                <td style="padding: 5px;">${new Date(solicitud.fechaSolicitud).toLocaleDateString('es-MX')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>SUCURSAL:</strong></td>
                                <td style="padding: 5px;">${getSucursalName(solicitud.sucursal)}</td>
                            </tr>
                            ${solicitud.claveAnuncio ? `
                            <tr>
                                <td style="padding: 5px;"><strong>CLAVE ANUNCIO:</strong></td>
                                <td style="padding: 5px;">${solicitud.claveAnuncio}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                    
                    ${htmlVinculadas}
                    
                    <!-- Concepto -->
                    <div style="margin: 15px 0;">
                        <div style="background: #d01f34; color: white; padding: 8px; font-weight: bold; font-size: 12px;">CONCEPTO</div>
                        <div style="padding: 10px; border: 1px solid #606060; border-top: none; font-size: 11px;">
                            <p style="margin: 5px 0;"><strong>Concepto General:</strong></p>
                            <p style="margin: 5px 0;">${solicitud.conceptoGeneral}</p>
                            <p style="margin: 10px 0 5px 0;"><strong>Monto Total del Concepto General:</strong> $${(solicitud.montoConceptoGeneral || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                            ${solicitud.conceptoPago ? `
                                <p style="margin: 10px 0 5px 0;"><strong>Concepto de Pago Específico:</strong></p>
                                <p style="margin: 5px 0;">${solicitud.conceptoPago}</p>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Montos -->
                    <div style="margin: 15px 0;">
                        <div style="background: #d01f34; color: white; padding: 8px; font-weight: bold; font-size: 12px;">MONTOS</div>
                        <div style="padding: 10px; border: 1px solid #606060; border-top: none;">
                            <table style="width: 100%; font-size: 11px; background: #fafafa;">
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Monto del Concepto de Pago:</td>
                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${solicitud.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Descuento:</td>
                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${solicitud.descuento.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Impuestos (${solicitud.porcentajeImpuestos || 0}%):</td>
                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${(solicitud.impuestos || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                                <tr style="font-weight: bold; font-size: 13px;">
                                    <td style="padding: 8px; background: #f0f0f0;">TOTAL A PAGAR:</td>
                                    <td style="padding: 8px; text-align: right; background: #f0f0f0;">$${solicitud.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Datos Bancarios -->
                    <div style="margin: 15px 0;">
                        <div style="background: #d01f34; color: white; padding: 8px; font-weight: bold; font-size: 12px;">DATOS BANCARIOS</div>
                        <div style="padding: 10px; border: 1px solid #606060; border-top: none; font-size: 11px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 5px; width: 30%;"><strong>Banco:</strong></td>
                                    <td style="padding: 5px;">${solicitud.banco}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px;"><strong>Cuenta:</strong></td>
                                    <td style="padding: 5px;">${solicitud.cuenta}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px;"><strong>CLABE:</strong></td>
                                    <td style="padding: 5px;">${solicitud.clabe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px;"><strong>Ciudad:</strong></td>
                                    <td style="padding: 5px;">${solicitud.ciudad}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #d01f34; margin: 15px 0;">
                    
                    <!-- Estado y Firmas -->
                    <div style="font-size: 11px; margin: 15px 0;">
                        <p><strong>Estado:</strong> <span class="status ${solicitud.estado}" style="display: inline-block; padding: 5px 10px; border-radius: 3px;">${solicitud.estado.toUpperCase()}</span></p>
                        <p><strong>Fecha de solicitud:</strong> ${new Date(solicitud.fechaSolicitud).toLocaleDateString('es-MX')}</p>
                        ${solicitud.fechaAutorizacion ? `<p><strong>Fecha de autorización:</strong> ${new Date(solicitud.fechaAutorizacion).toLocaleDateString('es-MX')}</p>` : ''}
                        ${solicitud.archivos && solicitud.archivos.length > 0 ? `<p><strong>Archivos adjuntos:</strong> ${solicitud.archivos.length} archivo(s)</p>` : ''}
                    </div>
                    
                    <!-- Área de Firma -->
                    <div style="margin-top: 30px; text-align: center;">
                        <div style="border: 1px solid #606060; width: 250px; height: 60px; margin: 0 auto;"></div>
                        <p style="margin: 10px 0 0 0; font-weight: bold; font-size: 11px;">Gerente de Sucursales</p>
                        <p style="margin: 5px 0 0 0; font-size: 10px;">Sergio Maurer</p>
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
                        padding: 20px;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .status {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 3px;
                    font-size: 12px;
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
                    max-width: 300px;
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

function autorizarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud && solicitud.estado === 'pendiente') {
        if (confirm('¿Está seguro de autorizar esta solicitud?')) {
            solicitud.estado = 'autorizada';
            solicitud.fechaAutorizacion = new Date().toISOString();
            cargarSolicitudes();
            alert('Solicitud autorizada exitosamente');
        }
    }
}

function cancelarSolicitud(id) {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud && solicitud.estado !== 'cancelada') {
        if (confirm('¿Está seguro de cancelar esta solicitud?')) {
            solicitud.estado = 'cancelada';
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
    doc.rect(20, yPos - 5, 170, 42, 'F');
    doc.setDrawColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.rect(20, yPos - 5, 170, 42);
    
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
    doc.text(solicitud.proveedor, 55, yPos);
    
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
                    <td>${new Date(sol.fechaSolicitud).toLocaleDateString('es-MX')}</td>
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
                    <span>${archivo.nombre} <small style="color: #999;">(${new Date(archivo.fecha).toLocaleDateString('es-MX')})</small></span>
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
                ${username !== 'smaurer' ? `<button class="btn btn-danger" onclick="eliminarUsuario('${username}')" style="padding: 5px 10px; font-size: 12px;">Eliminar</button>` : ''}
            </td>
        `;
    });
}

function mostrarFormularioUsuario(username = null) {
    if (!verificarPermisoAdmin()) return;
    
    const modal = document.getElementById('usuarioModal');
    const title = document.getElementById('usuarioModalTitle');
    const form = document.getElementById('usuarioForm');
    
    form.reset();
    editandoUsuario = username;
    
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
    if (username === 'smaurer') {
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
    
    if (rol === 'jefe') {
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
            <td>${proveedor.nombre}</td>
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

function eliminarProveedor(id) {
    if (!verificarPermisoAdmin()) return;
    
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
        const index = beneficiarios.findIndex(b => b.id === id);
        if (index > -1) {
            beneficiarios.splice(index, 1);
            cargarProveedores();
            cargarBeneficiariosSelect();
            guardarDatos();
            alert('Proveedor eliminado exitosamente');
        }
    }
}

function guardarProveedor(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('proveedorNombre').value;
    const rfc = document.getElementById('proveedorRFC').value.toUpperCase();
    const banco = document.getElementById('proveedorBanco').value;
    const cuenta = document.getElementById('proveedorCuenta').value;
    const clabe = document.getElementById('proveedorClabe').value;
    
    if (editandoProveedor) {
        const proveedor = beneficiarios.find(b => b.id === editandoProveedor);
        if (proveedor) {
            proveedor.nombre = nombre;
            proveedor.rfc = rfc;
            proveedor.banco = banco;
            proveedor.cuenta = cuenta;
            proveedor.clabe = clabe;
        }
    } else {
        const nuevoId = beneficiarios.length > 0 ? Math.max(...beneficiarios.map(b => b.id)) + 1 : 1;
        beneficiarios.push({
            id: nuevoId,
            nombre: nombre,
            rfc: rfc,
            banco: banco,
            cuenta: cuenta,
            clabe: clabe,
            csf: null
        });
    }
    
    cerrarModalProveedor();
    cargarProveedores();
    cargarBeneficiariosSelect();
    guardarDatos();
    alert(editandoProveedor ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente');
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
        <p><strong>RFC:</strong> ${proveedor.rfc || 'N/A'}</p>
    `;
    
    if (proveedor.csf) {
        csfActual.innerHTML = `
            <h4>CSF Actual:</h4>
            <div class="archivo-item">
                <span>${proveedor.csf.nombre} <small style="color: #999;">(${new Date(proveedor.csf.fecha).toLocaleDateString('es-MX')})</small></span>
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

function subirCSF() {
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
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        proveedor.csf = {
            nombre: file.name,
            datos: e.target.result,
            fecha: new Date().toISOString()
        };
        
        guardarDatos();
        alert('Constancia de Situación Fiscal subida exitosamente');
        gestionarCSF(proveedorActualCSF);
        input.value = '';
    };
    
    reader.readAsDataURL(file);
}

function descargarCSF(proveedorId) {
    const proveedor = beneficiarios.find(p => p.id === proveedorId);
    if (!proveedor || !proveedor.csf) return;
    
    const link = document.createElement('a');
    link.href = proveedor.csf.datos;
    link.download = proveedor.csf.nombre;
    link.click();
}

function eliminarCSF(proveedorId) {
    if (!confirm('¿Está seguro de eliminar la Constancia de Situación Fiscal?')) return;
    
    const proveedor = beneficiarios.find(p => p.id === proveedorId);
    if (!proveedor) return;
    
    proveedor.csf = null;
    guardarDatos();
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
            <td>${empresa.razonSocial}</td>
            <td>${empresa.rfc}</td>
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

function eliminarEmpresa(id) {
    if (confirm('¿Está seguro de eliminar esta empresa?')) {
        const index = empresas.findIndex(e => e.id === id);
        if (index > -1) {
            empresas.splice(index, 1);
            cargarEmpresas();
            cargarEmpresasSelect();
            alert('Empresa eliminada exitosamente');
        }
    }
}

function guardarEmpresa(event) {
    event.preventDefault();
    
    const razonSocial = document.getElementById('empresaRazon').value;
    const rfc = document.getElementById('empresaRFC').value.toUpperCase();
    
    if (editandoEmpresa) {
        const empresa = empresas.find(e => e.id === editandoEmpresa);
        if (empresa) {
            empresa.razonSocial = razonSocial;
            empresa.rfc = rfc;
        }
    } else {
        const nuevoId = empresas.length > 0 ? Math.max(...empresas.map(e => e.id)) + 1 : 1;
        empresas.push({
            id: nuevoId,
            razonSocial: razonSocial,
            rfc: rfc
        });
    }
    
    cerrarModalEmpresa();
    cargarEmpresas();
    cargarEmpresasSelect();
    alert(editandoEmpresa ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente');
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

function crearSolicitud(event) {
    event.preventDefault();
    
    const beneficiarioId = document.getElementById('beneficiario').value;
    const empresaId = document.getElementById('empresa').value;
    const sucursal = document.getElementById('sucursal').value;
    const numeroAutomatico = document.getElementById('numeroAutomatico').checked;
    
    if (!beneficiarioId) {
        alert('Por favor seleccione un beneficiario');
        return;
    }
    
    if (!empresaId) {
        alert('Por favor seleccione una empresa');
        return;
    }
    
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
    
    const porcentajeImpuestos = parseFloat(document.getElementById('impuestos').value) || 0;
    const montoImpuestos = extraerValorMoneda(document.getElementById('montoImpuestos').value);
    
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
        descuento: extraerValorMoneda(document.getElementById('descuento').value),
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
        archivos: []
    };
    
    solicitudes.push(solicitud);
    
    if (numeroConsecutivo > contadores[sucursal]) {
        contadores[sucursal] = numeroConsecutivo;
    }
    
    alert('Solicitud creada exitosamente con número: ' + numero);
    limpiarFormulario();
    switchTab('solicitudes');
}

function guardarDatos() {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    localStorage.setItem('contadores', JSON.stringify(contadores));
    localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
    localStorage.setItem('empresas', JSON.stringify(empresas));
    guardarUsuariosEnStorage();
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

cargarDatos();

window.addEventListener('beforeunload', function() {
    guardarDatos();
});

setInterval(guardarDatos, 30000);