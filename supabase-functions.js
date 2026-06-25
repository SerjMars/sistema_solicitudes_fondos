// ============================================
// supabase-functions.js - VERSIÓN CORREGIDA
// ============================================

// Verificar que supabase esté disponible
if (!window.supabase) {
    console.error('❌ ERROR CRÍTICO: supabase no está disponible en window');
}
if (typeof window.usarSupabase === 'undefined') {
    console.error('❌ ERROR CRÍTICO: usarSupabase no está disponible en window');
    window.usarSupabase = false;
}

// Variables globales para control de caché
window.ultimaActualizacion = {
    empresas: null,
    beneficiarios: null,
    solicitudes: null
};

const TIEMPO_CACHE = 5 * 60 * 1000; // 5 minutos

// ============================================
// CARGA INICIAL (solo datos maestros)
// ============================================
window.cargarDatosDesdeSupabase = async function(forzarRecarga = false) {
    if (!window.usarSupabase) {
        window.cargarDatosLocalStorage();
        return;
    }
    
    try {
        window.mostrarCargando(true);
        
        await Promise.all([
            window.cargarEmpresasSupabase(forzarRecarga),
            window.cargarBeneficiariosSupabase(forzarRecarga)
        ]);
        
        window.mostrarCargando(false);
        
    } catch (error) {
        console.error('Error al cargar desde Supabase:', error);
        window.cargarDatosLocalStorage();
        window.mostrarCargando(false);
    }
}

// ============================================
// CARGAR EMPRESAS CON CACHE
// ============================================
window.cargarEmpresasSupabase = async function(forzarRecarga = false) {
    const ahora = Date.now();
    
    if (!forzarRecarga && window.ultimaActualizacion.empresas && (ahora - window.ultimaActualizacion.empresas) < TIEMPO_CACHE) {
        const cache = localStorage.getItem('empresas_cache');
        if (cache) {
            window.empresas = JSON.parse(cache);
            return;
        }
    }
    
    try {
        const { data: empresasData, error: empresasError } = await window.supabase
            .from('empresas')
            .select('id, razon_social, rfc')
            .order('id', { ascending: true });
        
        if (empresasError) throw empresasError;
        
        if (empresasData && empresasData.length > 0) {
            window.empresas = empresasData.map(e => ({
                id: e.id,
                razonSocial: e.razon_social,
                rfc: e.rfc
            }));
            
            localStorage.setItem('empresas_cache', JSON.stringify(window.empresas));
            localStorage.setItem('empresas_cache_timestamp', ahora.toString());
            window.ultimaActualizacion.empresas = ahora;
        }
    } catch (error) {
        console.error('Error al cargar empresas:', error);
        const cache = localStorage.getItem('empresas_cache');
        if (cache) {
            window.empresas = JSON.parse(cache);
        }
    }
}

// ============================================
// CARGAR BENEFICIARIOS CON CACHE
// ============================================
window.cargarBeneficiariosSupabase = async function(forzarRecarga = false) {
    const ahora = Date.now();
    
    if (!forzarRecarga && window.ultimaActualizacion.beneficiarios && (ahora - window.ultimaActualizacion.beneficiarios) < TIEMPO_CACHE) {
        const cache = localStorage.getItem('beneficiarios_cache');
        if (cache) {
            window.beneficiarios = JSON.parse(cache);
            return;
        }
    }
    
    try {
        const { data: beneficiariosData, error: beneficiariosError } = await window.supabase
            .from('beneficiarios')
            .select('id, nombre, razon_social, rfc, tipo, banco, cuenta, clabe, csf')
            .order('id', { ascending: true });
        
        if (beneficiariosError) throw beneficiariosError;
        
        if (beneficiariosData && beneficiariosData.length > 0) {
            window.beneficiarios = beneficiariosData.map(b => ({
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
            
            localStorage.setItem('beneficiarios_cache', JSON.stringify(window.beneficiarios));
            localStorage.setItem('beneficiarios_cache_timestamp', ahora.toString());
            window.ultimaActualizacion.beneficiarios = ahora;
        }
    } catch (error) {
        console.error('Error al cargar beneficiarios:', error);
        const cache = localStorage.getItem('beneficiarios_cache');
        if (cache) {
            window.beneficiarios = JSON.parse(cache);
        }
    }
}

// ============================================
// CARGAR SOLICITUDES (bajo demanda, SIN archivos)
// ============================================
window.cargarSolicitudesSupabase = async function(forzarRecarga = true) {
    if (!window.usarSupabase) {
        const solicitudesGuardadas = localStorage.getItem('solicitudes');
        if (solicitudesGuardadas) {
            window.solicitudes = JSON.parse(solicitudesGuardadas);
        }
        return;
    }
    
    try {
        window.mostrarCargando(true);
        
        const { data: solicitudesData, error: solicitudesError } = await window.supabase
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
                gastos_caja_chica,
                flujo_autorizacion,
                rechazo
            `)
            .order('id', { ascending: false });
        
        if (solicitudesError) throw solicitudesError;
        
        if (solicitudesData && solicitudesData.length > 0) {
            window.solicitudes = solicitudesData.map(s => {
                let gastosCajaChica = null;
                if (s.gastos_caja_chica) {
                    try {
                        gastosCajaChica = typeof s.gastos_caja_chica === 'string' 
                            ? JSON.parse(s.gastos_caja_chica) 
                            : s.gastos_caja_chica;
                    } catch (e) {
                        console.error('Error al parsear gastos_caja_chica para solicitud', s.id);
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
                    archivos: [],
                    comprobantePago: s.comprobante_pago_url && s.comprobante_pago_nombre ? {
                        datos: s.comprobante_pago_url,
                        nombre: s.comprobante_pago_nombre
                    } : null,
                    pagada: s.pagada || false,
                    fechaPago: s.fecha_pago,
                    creadoPor: s.creado_por,
                    tipoFormato: s.tipo_formato || 'normal',
                    gastosCajaChica: gastosCajaChica,
                    flujoAutorizacion: s.flujo_autorizacion
                        ? (typeof s.flujo_autorizacion === 'string' ? JSON.parse(s.flujo_autorizacion) : s.flujo_autorizacion)
                        : null,
                    rechazo: s.rechazo
                        ? (typeof s.rechazo === 'string' ? JSON.parse(s.rechazo) : s.rechazo)
                        : null
                };
            });
        }
        
        window.mostrarCargando(false);
        
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        const solicitudesGuardadas = localStorage.getItem('solicitudes');
        if (solicitudesGuardadas) {
            window.solicitudes = JSON.parse(solicitudesGuardadas);
        }
        window.mostrarCargando(false);
    }
}

// ============================================
// CARGAR DESDE LOCALSTORAGE (FALLBACK)
// ============================================
window.cargarDatosLocalStorage = function() {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    if (solicitudesGuardadas) window.solicitudes = JSON.parse(solicitudesGuardadas);
    
    const contadoresGuardados = localStorage.getItem('contadores');
    if (contadoresGuardados) window.contadores = JSON.parse(contadoresGuardados);
    
    const beneficiariosGuardados = localStorage.getItem('beneficiarios');
    if (beneficiariosGuardados) window.beneficiarios = JSON.parse(beneficiariosGuardados);
    
    const empresasGuardadas = localStorage.getItem('empresas');
    if (empresasGuardadas) window.empresas = JSON.parse(empresasGuardadas);
}

// ============================================
// GUARDAR SOLICITUD EN SUPABASE
// ============================================
// Incremento atómico del consecutivo por sucursal (evita folios duplicados
// cuando dos personas crean una solicitud al mismo tiempo).
window.obtenerSiguienteConsecutivoSupabase = async function(sucursal) {
    const { data, error } = await window.supabase.rpc('siguiente_consecutivo', { p_sucursal: sucursal });
    if (error) {
        console.error('Error obteniendo siguiente consecutivo:', error);
        throw error;
    }
    return data;
}

window.guardarSolicitudSupabase = async function(solicitud) {
    if (!window.usarSupabase) {
        window.guardarDatosLocalStorage();
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
            flujo_autorizacion: solicitud.flujoAutorizacion ? JSON.stringify(solicitud.flujoAutorizacion) : null,
            tipo_formato: solicitud.tipoFormato || 'normal',
            gastos_caja_chica: solicitud.gastosCajaChica ? JSON.stringify(solicitud.gastosCajaChica) : null
        };

        const { data, error } = await window.supabase
            .from('solicitudes')
            .insert([solicitudDB])
            .select();
        
        if (error) {
            console.error('Error de Supabase:', error);
            throw error;
        }

        return { ...solicitud, id: data[0].id };
    } catch (error) {
        console.error('Error guardando solicitud:', error);
        throw error;
    }
}

// ============================================
// ACTUALIZAR SOLICITUD EN SUPABASE
// ============================================
window.actualizarSolicitudSupabase = async function(solicitud) {
    if (!window.usarSupabase) {
        window.guardarDatosLocalStorage();
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
            gastos_caja_chica: solicitud.gastosCajaChica ? JSON.stringify(solicitud.gastosCajaChica) : null,
            flujo_autorizacion: solicitud.flujoAutorizacion ? JSON.stringify(solicitud.flujoAutorizacion) : null,
            rechazo: solicitud.rechazo ? JSON.stringify(solicitud.rechazo) : null
        };

        const { error } = await window.supabase
            .from('solicitudes')
            .update(solicitudDB)
            .eq('id', solicitud.id);
        
        if (error) {
            console.error('Error de Supabase al actualizar:', error);
            throw error;
        }
        
    } catch (error) {
        console.error('Error actualizando solicitud:', error);
        throw error;
    }
}

// ============================================
// GUARDAR EMPRESA EN SUPABASE
// ============================================
window.guardarEmpresaSupabase = async function(empresa) {
    try {
        window.ultimaActualizacion.empresas = null;
        
        if (empresa.id && empresa.id < 2147483647) {
            const { data, error } = await window.supabase
                .from('empresas')
                .update({
                    razon_social: empresa.razonSocial,
                    rfc: empresa.rfc
                })
                .eq('id', empresa.id)
                .select()
                .single();
            
            if (error) throw error;
            
            return {
                id: data.id,
                razonSocial: data.razon_social,
                rfc: data.rfc
            };
        } else {
            const { data, error } = await window.supabase
                .from('empresas')
                .insert([{
                    razon_social: empresa.razonSocial,
                    rfc: empresa.rfc
                }])
                .select()
                .single();
            
            if (error) throw error;
            
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
window.eliminarEmpresaSupabase = async function(id) {
    if (!window.usarSupabase) {
        window.guardarDatosLocalStorage();
        return;
    }

    try {
        const { error } = await window.supabase
            .from('empresas')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        window.ultimaActualizacion.empresas = null;
    } catch (error) {
        console.error('Error eliminando empresa:', error);
        throw error;
    }
}

// ============================================
// GUARDAR BENEFICIARIO EN SUPABASE
// ============================================
window.guardarBeneficiarioSupabase = async function(beneficiario) {
    try {
        window.ultimaActualizacion.beneficiarios = null;
        
        if (beneficiario.id && beneficiario.id < 2147483647) {
            const { data, error } = await window.supabase
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
            const { data, error } = await window.supabase
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
window.eliminarBeneficiarioSupabase = async function(id) {
    if (!window.usarSupabase) {
        window.guardarDatosLocalStorage();
        return;
    }

    try {
        const { error } = await window.supabase
            .from('beneficiarios')
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        window.ultimaActualizacion.beneficiarios = null;
    } catch (error) {
        console.error('Error eliminando beneficiario:', error);
        throw error;
    }
}

// ============================================
// SUBIR ARCHIVO A SUPABASE STORAGE
// ============================================
window.subirArchivoSupabase = async function(file, carpeta = 'comprobantes') {
    if (!window.usarSupabase) return null;
    
    const cliente = window.supabase;
    
    if (!cliente) {
        console.error('❌ ERROR: window.supabase no está definido');
        alert('Error: No se pudo conectar con Supabase Storage');
        return null;
    }
    
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        
        const { data, error } = await cliente.storage
            .from(carpeta)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            console.error('❌ Error subiendo archivo:', error);
            alert(`Error al subir archivo: ${error.message}\n\n¿El bucket "${carpeta}" existe en Supabase Storage?`);
            return null;
        }
        
        const { data: urlData } = cliente.storage
            .from(carpeta)
            .getPublicUrl(fileName);
        
        return urlData.publicUrl;
        
    } catch (error) {
        console.error('❌ Error en subirArchivoSupabase:', error);
        alert(`Error inesperado: ${error.message}`);
        return null;
    }
}

// ============================================
// FUNCIÓN PARA MOSTRAR/OCULTAR INDICADOR DE CARGA
// ============================================
window.mostrarCargando = function(mostrar) {
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
window.guardarDatosLocalStorage = function() {
    localStorage.setItem('solicitudes', JSON.stringify(window.solicitudes || []));
    localStorage.setItem('contadores', JSON.stringify(window.contadores || {}));
    localStorage.setItem('beneficiarios', JSON.stringify(window.beneficiarios || []));
    localStorage.setItem('empresas', JSON.stringify(window.empresas || []));
}

// ============================================
// ELIMINAR SOLICITUD DE SUPABASE (SOLO ADMIN)
// ============================================
window.eliminarSolicitudSupabase = async function(id) {
    if (!window.usarSupabase) {
        const index = window.solicitudes.findIndex(s => s.id === id);
        if (index > -1) {
            window.solicitudes.splice(index, 1);
            window.guardarDatosLocalStorage();
        }
        return;
    }

    try {
        const { error } = await window.supabase
            .from('solicitudes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
    } catch (error) {
        console.error('Error eliminando solicitud:', error);
        throw error;
    }
}