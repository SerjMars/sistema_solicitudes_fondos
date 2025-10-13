// ============================================
// FUNCIONES DE SUPABASE
// ============================================

// Cargar todos los datos desde Supabase
async function cargarDatosDesdeSupabase() {
    if (!usarSupabase) {
        cargarDatosLocalStorage();
        return;
    }
    
    try {
        mostrarCargando(true);
        
        // Cargar empresas
        const { data: empresasData, error: empresasError } = await supabaseClient
            .from('empresas')
            .select('*')
            .order('id', { ascending: true });
        
        if (empresasError) throw empresasError;
        
        if (empresasData && empresasData.length > 0) {
            empresas = empresasData.map(e => ({
                id: e.id,
                razonSocial: e.razon_social,
                rfc: e.rfc
            }));
        }
        
        // Cargar beneficiarios
        const { data: beneficiariosData, error: beneficiariosError } = await supabaseClient
            .from('beneficiarios')
            .select('*')
            .order('id', { ascending: true });
        
        if (beneficiariosError) throw beneficiariosError;
        
        if (beneficiariosData && beneficiariosData.length > 0) {
            beneficiarios = beneficiariosData.map(b => ({
                id: b.id,
                nombre: b.nombre,
                razonSocial: b.razon_social,
                rfc: b.rfc,
                tipo: b.tipo || 'proveedor', // <-- ASEGÚRATE QUE ESTA LÍNEA ESTÉ
                banco: b.banco,
                cuenta: b.cuenta,
                clabe: b.clabe,
                csf: b.csf
            }));
        }
        
        // Cargar solicitudes
        const { data: solicitudesData, error: solicitudesError } = await supabaseClient
            .from('solicitudes')
            .select('*')
            .order('id', { ascending: false });
        
        if (solicitudesError) throw solicitudesError;
        
        if (solicitudesData && solicitudesData.length > 0) {
    solicitudes = solicitudesData.map(s => {
        // Parsear gastos_caja_chica si viene como string
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
            archivos: s.archivos || [],
            comprobantePago: s.comprobante_pago,
            pagada: s.pagada || false,
            fechaPago: s.fecha_pago,
            creadoPor: s.creado_por,
            tipoFormato: s.tipo_formato || 'normal',
            gastosCajaChica: gastosCajaChica  // ← USAR LA VARIABLE PARSEADA
        };
    });
}
        
        // console.log('✅ Datos cargados desde Supabase correctamente');
        // console.log('Beneficiarios cargados:', beneficiarios);
        mostrarCargando(false);
        
    } catch (error) {
        // console.error('❌ Error al cargar desde Supabase:', error);
        // console.log('Usando localStorage como respaldo');
        cargarDatosLocalStorage();
        mostrarCargando(false);
    }
}

// Cargar desde localStorage (fallback)
function cargarDatosDesdeLocalStorage() {
    const solicitudesGuardadas = localStorage.getItem('solicitudes');
    if (solicitudesGuardadas) solicitudes = JSON.parse(solicitudesGuardadas);
    
    const contadoresGuardados = localStorage.getItem('contadores');
    if (contadoresGuardados) contadores = JSON.parse(contadoresGuardados);
    
    const beneficiariosGuardados = localStorage.getItem('beneficiarios');
    if (beneficiariosGuardados) beneficiarios = JSON.parse(beneficiariosGuardados);
    
    const empresasGuardadas = localStorage.getItem('empresas');
    if (empresasGuardadas) empresas = JSON.parse(empresasGuardadas);
}

// Guardar solicitud en Supabase
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
            
            // ⭐ CAMPOS CRÍTICOS - ASEGÚRATE QUE ESTÉN ⭐
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

// Actualizar solicitud en Supabase
async function actualizarSolicitudSupabase(solicitud) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return;
    }

    try {
        console.log('Actualizando en Supabase:', solicitud.id);
        
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
            
            // ARCHIVOS
            archivos: solicitud.archivos ? JSON.stringify(solicitud.archivos) : null,
            
            // CAMPOS PARA CAJA CHICA
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

// Guardar empresa en Supabase
async function guardarEmpresaSupabase(empresa) {
    try {
        if (empresa.id && empresa.id < 2147483647) {
            // Actualizar empresa existente
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
            
            return {
                id: data.id,
                razonSocial: data.razon_social,
                rfc: data.rfc
            };
        } else {
            // Insertar nueva empresa (sin ID)
            const { data, error } = await supabaseClient
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

// Eliminar empresa de Supabase
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
    } catch (error) {
        console.error('Error eliminando empresa:', error);
        throw error;
    }
}

// Guardar beneficiario en Supabase
async function guardarBeneficiarioSupabase(beneficiario) {
    try {
        // Si el beneficiario ya tiene un ID válido de Supabase (menor a 2147483647)
        if (beneficiario.id && beneficiario.id < 2147483647) {
            // Actualizar beneficiario existente
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
            // Insertar nuevo beneficiario (sin especificar ID, Supabase lo genera)
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
            
            console.log('✅ Beneficiario guardado en Supabase:', data);
            
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

// Eliminar beneficiario de Supabase
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
    } catch (error) {
        console.error('Error eliminando beneficiario:', error);
        throw error;
    }
}

// Subir archivo a Supabase Storage
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

// Función para mostrar/ocultar indicador de carga
function mostrarCargando(mostrar) {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = '<div style="text-align: center; padding: 20px;"><p>Cargando datos...</p></div>';
        loader.style.position = 'fixed';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        loader.style.background = 'white';
        loader.style.padding = '20px';
        loader.style.borderRadius = '10px';
        loader.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        loader.style.zIndex = '10000';
        document.body.appendChild(loader);
    }
    loader.style.display = mostrar ? 'block' : 'none';
}

// Guardar en localStorage (fallback)
function guardarDatosLocalStorage() {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    localStorage.setItem('contadores', JSON.stringify(contadores));
    localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
    localStorage.setItem('empresas', JSON.stringify(empresas));
}