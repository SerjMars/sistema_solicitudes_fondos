// ============================================
// FUNCIONES DE SUPABASE CON CACHE Y CARGA SELECTIVA
// ============================================

// Variables globales para control de caché
let ultimaActualizacion = {
    empresas: null,
    beneficiarios: null,
    solicitudes: null
};

const TIEMPO_CACHE = 5 * 60 * 1000; // 5 minutos en milisegundos

// ============================================
// CARGA INICIAL (solo datos maestros)
// ============================================
async function cargarDatosDesdeSupabase(forzarRecarga = false) {
    if (!usarSupabase) {
        cargarDatosLocalStorage();
        return;
    }
    
    try {
        mostrarCargando(true);
        
        // Cargar en paralelo empresas y beneficiarios
        await Promise.all([
            cargarEmpresasSupabase(forzarRecarga),
            cargarBeneficiariosSupabase(forzarRecarga)
        ]);
        
        console.log('✓ Datos maestros cargados');
        mostrarCargando(false);
        
    } catch (error) {
        console.error('Error al cargar desde Supabase:', error);
        cargarDatosLocalStorage();
        mostrarCargando(false);
    }
}

// ============================================
// CARGAR EMPRESAS CON CACHE
// ============================================
async function cargarEmpresasSupabase(forzarRecarga = false) {
    const ahora = Date.now();
    
    // Verificar si usar caché
    if (!forzarRecarga && ultimaActualizacion.empresas && (ahora - ultimaActualizacion.empresas) < TIEMPO_CACHE) {
        const cache = localStorage.getItem('empresas_cache');
        if (cache) {
            empresas = JSON.parse(cache);
            console.log('✓ Empresas cargadas desde caché');
            return;
        }
    }
    
    // Cargar desde Supabase
    try {
        const { data: empresasData, error: empresasError } = await supabaseClient
            .from('empresas')
            .select('id, razon_social, rfc')
            .order('id', { ascending: true });
        
        if (empresasError) throw empresasError;
        
        if (empresasData && empresasData.length > 0) {
            empresas = empresasData.map(e => ({
                id: e.id,
                razonSocial: e.razon_social,
                rfc: e.rfc
            }));
            
            // Guardar en caché
            localStorage.setItem('empresas_cache', JSON.stringify(empresas));
            localStorage.setItem('empresas_cache_timestamp', ahora.toString());
            ultimaActualizacion.empresas = ahora;
            
            console.log('✓ Empresas cargadas desde Supabase');
        }
    } catch (error) {
        console.error('Error al cargar empresas:', error);
        // Intentar cargar desde caché aunque esté vencido
        const cache = localStorage.getItem('empresas_cache');
        if (cache) {
            empresas = JSON.parse(cache);
            console.log('⚠ Usando caché vencido de empresas');
        }
    }
}

// ============================================
// CARGAR BENEFICIARIOS CON CACHE
// ============================================
async function cargarBeneficiariosSupabase(forzarRecarga = false) {
    const ahora = Date.now();
    
    // Verificar si usar caché
    if (!forzarRecarga && ultimaActualizacion.beneficiarios && (ahora - ultimaActualizacion.beneficiarios) < TIEMPO_CACHE) {
        const cache = localStorage.getItem('beneficiarios_cache');
        if (cache) {
            beneficiarios = JSON.parse(cache);
            console.log('✓ Beneficiarios cargados desde caché');
            return;
        }
    }
    
    // Cargar desde Supabase
    try {
        const { data: beneficiariosData, error: beneficiariosError } = await supabaseClient
            .from('beneficiarios')
            .select('id, nombre, razon_social, rfc, tipo, banco, cuenta, clabe, csf')
            .order('id', { ascending: true });
        
        if (beneficiariosError) throw beneficiariosError;
        
        if (beneficiariosData && beneficiariosData.length > 0) {
            beneficiarios = beneficiariosData.map(b => ({
                id: b.id,
                nombre: b.nombre,
                razonSocial: b.razon_social,
                rfc: b.rfc,
                tipo: b.tipo || 'proveedor',
                banco: b.banco,
                cuenta: b.cuenta,
                clabe: b.clabe,
                csf: b.csf
            }));
            
            // Guardar en caché
            localStorage.setItem('beneficiarios_cache', JSON.stringify(beneficiarios));
            localStorage.setItem('beneficiarios_cache_timestamp', ahora.toString());
            ultimaActualizacion.beneficiarios = ahora;
            
            console.log('✓ Beneficiarios cargados desde Supabase');
        }
    } catch (error) {
        console.error('Error al cargar beneficiarios:', error);
        // Intentar cargar desde caché aunque esté vencido
        const cache = localStorage.getItem('beneficiarios_cache');
        if (cache) {
            beneficiarios = JSON.parse(cache);
            console.log('⚠ Usando caché vencido de beneficiarios');
        }
    }
}

// ============================================
// CARGAR SOLICITUDES (bajo demanda, SIN archivos)
// ============================================
async function cargarSolicitudesSupabase(forzarRecarga = true) {
    if (!usarSupabase) {
        const solicitudesGuardadas = localStorage.getItem('solicitudes');
        if (solicitudesGuardadas) {
            solicitudes = JSON.parse(solicitudesGuardadas);
        }
        return;
    }
    
    try {
        mostrarCargando(true);
        
        // ✅ CAMBIO CRÍTICO: No traer archivos en la carga inicial
        const { data: solicitudesData, error: solicitudesError } = await supabaseClient
            .from('solicitudes')
            .select(`
                id,
                numero,
                numero_consecutivo,
                sucursal,
                empresa_id,
                beneficiario_id,
                proveedor,
                concepto_general,
                monto_concepto_general,
                concepto_pago,
                clave_anuncio,
                subtotal,
                descuento,
                porcentaje_impuestos,
                impuestos,
                total,
                banco,
                cuenta,
                clabe,
                ciudad,
                estado,
                fecha_solicitud,
                fecha_autorizacion,
                solicitudes_vinculadas,
                comprobante_pago_url,
                comprobante_pago_nombre,
                pagada,
                fecha_pago,
                creado_por,
                tipo_formato,
                gastos_caja_chica
            `)  // ⚠️ NO incluir 'archivos' aquí
            .order('id', { ascending: false });
        
        if (solicitudesError) throw solicitudesError;
        
        if (solicitudesData && solicitudesData.length > 0) {
            solicitudes = solicitudesData.map(s => {
                let gastosCajaChica = null;
                if (s.gastos_caja_chica) {
                    try {
                        gastosCajaChica = typeof s.gastos_caja_chica === 'string' 
                            ? JSON.parse(s.gastos_caja_chica) 
                            : s.gastos_caja_chica;
                    } catch (e) {
                        console.error('Error al parsear gastos_caja_chica para solicitud', s.id, ':', e);
                        gastosCajaChica = null;
                    }
                }
                
                return {
                    id: s.id,
                    numero: s.numero,
                    numeroConsecutivo: s.numero_consecutivo,
                    sucursal: s.sucursal,
                    empresaId: s.empresa_id,
                    beneficiarioId: s.beneficiario_id,
                    proveedor: s.proveedor,
                    conceptoGeneral: s.concepto_general,
                    montoConceptoGeneral: s.monto_concepto_general,
                    conceptoPago: s.concepto_pago,
                    claveAnuncio: s.clave_anuncio,
                    subtotal: s.subtotal,
                    descuento: s.descuento,
                    porcentajeImpuestos: s.porcentaje_impuestos,
                    impuestos: s.impuestos,
                    total: s.total,
                    banco: s.banco,
                    cuenta: s.cuenta,
                    clabe: s.clabe,
                    ciudad: s.ciudad,
                    estado: s.estado,
                    fechaSolicitud: s.fecha_solicitud,
                    fechaAutorizacion: s.fecha_autorizacion,
                    solicitudesVinculadas: s.solicitudes_vinculadas || [],
                    archivos: [], // ✅ Inicializar vacío, se cargará bajo demanda
                    comprobantePago: s.comprobante_pago_url ? {
                        nombre: s.comprobante_pago_nombre,
                        datos: s.comprobante_pago_url
                    } : null,
                    pagada: s.pagada || false,
                    fechaPago: s.fecha_pago,
                    creadoPor: s.creado_por,
                    tipoFormato: s.tipo_formato || 'normal',
                    gastosCajaChica: gastosCajaChica
                };
            });
            
            console.log('✓ Solicitudes cargadas desde Supabase (sin archivos adjuntos)');
        }
        
        mostrarCargando(false);
        
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        mostrarCargando(false);
        throw error;
    }
}

// ============================================
// CARGAR ARCHIVOS DE UNA SOLICITUD ESPECÍFICA (bajo demanda)
// ============================================
async function cargarArchivosDeUnasolicitud(solicitudId) {
    if (!usarSupabase) return [];
    
    try {
        const { data, error } = await supabaseClient
            .from('solicitudes')
            .select('archivos')
            .eq('id', solicitudId)
            .single();
        
        if (error) throw error;
        
        // Parsear archivos si vienen como string
        let archivos = [];
        if (data.archivos) {
            try {
                archivos = typeof data.archivos === 'string' 
                    ? JSON.parse(data.archivos) 
                    : data.archivos;
            } catch (e) {
                console.error('Error al parsear archivos:', e);
                archivos = [];
            }
        }
        
        // Actualizar la solicitud en el array local
        const solicitud = solicitudes.find(s => s.id === solicitudId);
        if (solicitud) {
            solicitud.archivos = archivos;
        }
        
        return archivos;
        
    } catch (error) {
        console.error('Error al cargar archivos de solicitud:', error);
        return [];
    }
}

// ============================================
// FUNCIÓN PARA REFRESCAR TODO (botón manual)
// ============================================
async function refrescarTodosDatos() {
    if (confirm('¿Desea recargar todos los datos desde el servidor?')) {
        // Limpiar caché
        localStorage.removeItem('empresas_cache');
        localStorage.removeItem('beneficiarios_cache');
        ultimaActualizacion = {
            empresas: null,
            beneficiarios: null,
            solicitudes: null
        };
        
        mostrarCargando(true);
        
        try {
            await Promise.all([
                cargarEmpresasSupabase(true),
                cargarBeneficiariosSupabase(true),
                cargarSolicitudesSupabase(true)
            ]);
            
            // Recargar vistas
            cargarEmpresas();
            cargarProveedores();
            cargarSolicitudes();
            cargarBeneficiariosSelect();
            cargarBeneficiariosSelectCajaChica();
            cargarEmpresasSelect();
            
            alert('Datos actualizados correctamente');
        } catch (error) {
            alert('Error al actualizar datos');
        } finally {
            mostrarCargando(false);
        }
    }
}

// Cargar desde localStorage (fallback)
function cargarDatosDesdeLocalStorage() {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    if (solicitudesGuardadas) solicitudes = JSON.parse(solicitudesGuardadas);
    
    const contadoresGuardados = localStorage.getItem('contadores');
    if (contadoresGuardados) contadores = JSON.parse(contadoresGuardados);
    
    const beneficiariosCache = localStorage.getItem('beneficiarios_cache');
    if (beneficiariosCache) beneficiarios = JSON.parse(beneficiariosCache);
    
    const empresasCache = localStorage.getItem('empresas_cache');
    if (empresasCache) empresas = JSON.parse(empresasCache);
}

// ============================================
// GUARDAR SOLICITUD EN SUPABASE
// ============================================
async function guardarSolicitudSupabase(solicitud) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return solicitud;
    }

    try {
        const solicitudDB = {
            numero: solicitud.numero,
            numero_consecutivo: solicitud.numeroConsecutivo,
            sucursal: solicitud.sucursal,
            empresa_id: solicitud.empresaId,
            beneficiario_id: solicitud.beneficiarioId,
            proveedor: solicitud.proveedor,
            concepto_general: solicitud.conceptoGeneral,
            monto_concepto_general: solicitud.montoConceptoGeneral,
            concepto_pago: solicitud.conceptoPago,
            clave_anuncio: solicitud.claveAnuncio,
            subtotal: solicitud.subtotal,
            descuento: solicitud.descuento,
            porcentaje_impuestos: solicitud.porcentajeImpuestos,
            impuestos: solicitud.impuestos,
            total: solicitud.total,
            banco: solicitud.banco,
            cuenta: solicitud.cuenta,
            clabe: solicitud.clabe,
            ciudad: solicitud.ciudad,
            estado: solicitud.estado,
            pagada: solicitud.pagada || false,
            fecha_solicitud: solicitud.fechaSolicitud,
            creado_por: solicitud.creadoPor,
            solicitudes_vinculadas: solicitud.solicitudesVinculadas ? JSON.stringify(solicitud.solicitudesVinculadas) : null,
            tipo_formato: solicitud.tipoFormato || 'normal',
            gastos_caja_chica: solicitud.gastosCajaChica ? JSON.stringify(solicitud.gastosCajaChica) : null
        };

        const { data, error } = await supabaseClient
            .from('solicitudes')
            .insert([solicitudDB])
            .select();
        
        if (error) {
            console.error('Error de Supabase:', error);
            throw error;
        }

        // Actualizar contador
        await supabaseClient
            .from('contadores')
            .update({ contador: solicitud.numeroConsecutivo })
            .eq('sucursal', solicitud.sucursal);

        return { ...solicitud, id: data[0].id };
    } catch (error) {
        console.error('Error guardando solicitud:', error);
        throw error;
    }
}

// ============================================
// ACTUALIZAR SOLICITUD EN SUPABASE
// ============================================
async function actualizarSolicitudSupabase(solicitud) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return;
    }

    try {
        const solicitudDB = {
            empresa_id: solicitud.empresaId,
            beneficiario_id: solicitud.beneficiarioId,
            proveedor: solicitud.proveedor,
            concepto_general: solicitud.conceptoGeneral,
            monto_concepto_general: solicitud.montoConceptoGeneral,
            concepto_pago: solicitud.conceptoPago,
            clave_anuncio: solicitud.claveAnuncio,
            subtotal: solicitud.subtotal,
            descuento: solicitud.descuento,
            porcentaje_impuestos: solicitud.porcentajeImpuestos,
            impuestos: solicitud.impuestos,
            total: solicitud.total,
            banco: solicitud.banco,
            cuenta: solicitud.cuenta,
            clabe: solicitud.clabe,
            ciudad: solicitud.ciudad,
            estado: solicitud.estado,
            pagada: solicitud.pagada || false,
            fecha_autorizacion: solicitud.fechaAutorizacion,
            fecha_pago: solicitud.fechaPago,
            comprobante_pago_url: solicitud.comprobantePago?.datos || null,
            comprobante_pago_nombre: solicitud.comprobantePago?.nombre || null,
            archivos: solicitud.archivos ? JSON.stringify(solicitud.archivos) : null,
            tipo_formato: solicitud.tipoFormato || 'normal',
            gastos_caja_chica: solicitud.gastosCajaChica ? JSON.stringify(solicitud.gastosCajaChica) : null
        };

        const { error } = await supabaseClient
            .from('solicitudes')
            .update(solicitudDB)
            .eq('id', solicitud.id);
        
        if (error) {
            console.error('Error de Supabase al actualizar:', error);
            throw error;
        }
        
        console.log('✓ Actualización en Supabase exitosa');
        
    } catch (error) {
        console.error('Error actualizando solicitud:', error);
        throw error;
    }
}

// ============================================
// GUARDAR EMPRESA EN SUPABASE
// ============================================
async function guardarEmpresaSupabase(empresa) {
    try {
        if (empresa.id && empresa.id < 2147483647) {
            const { data, error } = await supabaseClient
                .from('empresas')
                .update({
                    razon_social: empresa.razonSocial,
                    rfc: empresa.rfc
                })
                .eq('id', empresa.id)
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidar caché
            ultimaActualizacion.empresas = null;
            
            return {
                id: data.id,
                razonSocial: data.razon_social,
                rfc: data.rfc
            };
        } else {
            const { data, error } = await supabaseClient
                .from('empresas')
                .insert([{
                    razon_social: empresa.razonSocial,
                    rfc: empresa.rfc
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidar caché
            ultimaActualizacion.empresas = null;
            
            return {
                id: data.id,
                razonSocial: data.razon_social,
                rfc: data.rfc
            };
        }
    } catch (error) {
        console.error('Error guardando empresa:', error);
        throw error;
    }
}

// ============================================
// ELIMINAR EMPRESA DE SUPABASE
// ============================================
async function eliminarEmpresaSupabase(id) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('empresas')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        // Invalidar caché
        ultimaActualizacion.empresas = null;
    } catch (error) {
        console.error('Error eliminando empresa:', error);
        throw error;
    }
}

// ============================================
// GUARDAR BENEFICIARIO EN SUPABASE
// ============================================
async function guardarBeneficiarioSupabase(beneficiario) {
    try {
        if (beneficiario.id && beneficiario.id < 2147483647) {
            const { data, error } = await supabaseClient
                .from('beneficiarios')
                .update({
                    nombre: beneficiario.nombre,
                    razon_social: beneficiario.razonSocial,
                    rfc: beneficiario.rfc,
                    tipo: beneficiario.tipo || 'proveedor',
                    banco: beneficiario.banco,
                    cuenta: beneficiario.cuenta,
                    clabe: beneficiario.clabe,
                    csf: beneficiario.csf
                })
                .eq('id', beneficiario.id)
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidar caché
            ultimaActualizacion.beneficiarios = null;
            
            return {
                id: data.id,
                nombre: data.nombre,
                razonSocial: data.razon_social,
                rfc: data.rfc,
                tipo: data.tipo,
                banco: data.banco,
                cuenta: data.cuenta,
                clabe: data.clabe,
                csf: data.csf
            };
        } else {
            const { data, error } = await supabaseClient
                .from('beneficiarios')
                .insert([{
                    nombre: beneficiario.nombre,
                    razon_social: beneficiario.razonSocial,
                    rfc: beneficiario.rfc,
                    tipo: beneficiario.tipo || 'proveedor',
                    banco: beneficiario.banco,
                    cuenta: beneficiario.cuenta,
                    clabe: beneficiario.clabe,
                    csf: beneficiario.csf
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Invalidar caché
            ultimaActualizacion.beneficiarios = null;
            
            return {
                id: data.id,
                nombre: data.nombre,
                razonSocial: data.razon_social,
                rfc: data.rfc,
                tipo: data.tipo,
                banco: data.banco,
                cuenta: data.cuenta,
                clabe: data.clabe,
                csf: data.csf
            };
        }
    } catch (error) {
        console.error('Error guardando beneficiario:', error);
        throw error;
    }
}

// ============================================
// ELIMINAR BENEFICIARIO DE SUPABASE
// ============================================
async function eliminarBeneficiarioSupabase(id) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('beneficiarios')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        // Invalidar caché
        ultimaActualizacion.beneficiarios = null;
    } catch (error) {
        console.error('Error eliminando beneficiario:', error);
        throw error;
    }
}

// ============================================
// SUBIR ARCHIVO A SUPABASE STORAGE
// ============================================
async function subirArchivoSupabase(file, carpeta) {
    if (!usarSupabase) return null;

    try {
        const nombreArchivo = `${Date.now()}_${file.name}`;
        const { data, error } = await supabaseClient.storage
            .from('archivos-solicitudes')
            .upload(`${carpeta}/${nombreArchivo}`, file);
        
        if (error) throw error;

        const { data: urlData } = supabaseClient.storage
            .from('archivos-solicitudes')
            .getPublicUrl(`${carpeta}/${nombreArchivo}`);
        
        return urlData.publicUrl;
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        return null;
    }
}

// ============================================
// FUNCIÓN PARA MOSTRAR/OCULTAR INDICADOR DE CARGA
// ============================================
function mostrarCargando(mostrar) {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #4a5e9d; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                <p style="color: #4a5e9d; font-weight: 600;">Cargando datos...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        loader.style.position = 'fixed';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        loader.style.background = 'white';
        loader.style.padding = '30px';
        loader.style.borderRadius = '10px';
        loader.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        loader.style.zIndex = '10000';
        document.body.appendChild(loader);
    }
    loader.style.display = mostrar ? 'block' : 'none';
}

// ============================================
// GUARDAR EN LOCALSTORAGE (FALLBACK)
// ============================================
function guardarDatosLocalStorage() {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    localStorage.setItem('contadores', JSON.stringify(contadores));
    localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
    localStorage.setItem('empresas', JSON.stringify(empresas));
}

// ============================================
// ELIMINAR SOLICITUD DE SUPABASE (SOLO ADMIN)
// ============================================
async function eliminarSolicitudSupabase(id) {
    if (!usarSupabase) {
        const index = solicitudes.findIndex(s => s.id === id);
        if (index > -1) {
            solicitudes.splice(index, 1);
            guardarDatosLocalStorage();
        }
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('solicitudes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        console.log('✓ Solicitud eliminada de Supabase');
        
    } catch (error) {
        console.error('Error eliminando solicitud:', error);
        throw error;
    }
}