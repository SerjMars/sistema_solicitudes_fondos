// ============================================
// FUNCIONES DE SUPABASE
// ============================================

// Cargar todos los datos desde Supabase
async function cargarDatosDesdeSupabase() {
    if (!usarSupabase) {
        cargarDatosDesdeLocalStorage();
        return;
    }

    try {
        // Mostrar indicador de carga
        mostrarCargando(true);

        // Cargar empresas
        const { data: empresasData, error: empresasError } = await supabaseClient
            .from('empresas')
            .select('*');
        if (empresasError) throw empresasError;
        empresas = empresasData.map(e => ({
            id: e.id,
            razonSocial: e.razon_social,
            rfc: e.rfc
        })) || [];

        // Cargar beneficiarios
        const { data: beneficiariosData, error: beneficiariosError } = await supabaseClient
            .from('beneficiarios')
            .select('*');
        if (beneficiariosError) throw beneficiariosError;
        beneficiarios = beneficiariosData.map(b => ({
            ...b,
            razonSocial: b.razon_social,
            csf: b.csf_url ? {
                nombre: b.csf_nombre,
                datos: b.csf_url,
                fecha: b.csf_fecha
            } : null
        })) || [];

        // Cargar solicitudes
        const { data: solicitudesData, error: solicitudesError } = await supabaseClient
            .from('solicitudes')
            .select('*')
            .order('created_at', { ascending: false });
        if (solicitudesError) throw solicitudesError;
        
        solicitudes = solicitudesData.map(s => ({
            id: s.id,
            numero: s.numero,
            numeroConsecutivo: s.numero_consecutivo,
            sucursal: s.sucursal,
            empresaId: s.empresa_id,
            beneficiarioId: s.beneficiario_id,
            proveedor: s.proveedor,
            conceptoGeneral: s.concepto_general,
            montoConceptoGeneral: parseFloat(s.monto_concepto_general) || 0,
            conceptoPago: s.concepto_pago,
            claveAnuncio: s.clave_anuncio,
            subtotal: parseFloat(s.subtotal),
            descuento: parseFloat(s.descuento) || 0,
            porcentajeImpuestos: parseFloat(s.porcentaje_impuestos) || 16,
            impuestos: parseFloat(s.impuestos),
            total: parseFloat(s.total),
            banco: s.banco,
            cuenta: s.cuenta,
            clabe: s.clabe,
            ciudad: s.ciudad,
            estado: s.estado,
            pagada: s.pagada,
            fechaSolicitud: s.fecha_solicitud,
            fechaAutorizacion: s.fecha_autorizacion,
            fechaPago: s.fecha_pago,
            creadoPor: s.creado_por,
            solicitudesVinculadas: s.solicitudes_vinculadas ? JSON.parse(s.solicitudes_vinculadas) : [],
            comprobantePago: s.comprobante_pago_url ? {
                nombre: s.comprobante_pago_nombre,
                datos: s.comprobante_pago_url,
                tipo: s.comprobante_pago_nombre.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                fecha: s.fecha_pago || s.created_at
            } : null,
            archivos: []
        })) || [];

        // Cargar contadores
        const { data: contadoresData, error: contadoresError } = await supabaseClient
            .from('contadores')
            .select('*');
        if (contadoresError) throw contadoresError;
        
        contadores = {};
        contadoresData.forEach(c => {
            contadores[c.sucursal] = c.contador;
        });

        mostrarCargando(false);
    } catch (error) {
        console.error('Error cargando datos:', error);
        mostrarCargando(false);
        alert('Error al cargar datos. Usando datos locales.');
        cargarDatosDesdeLocalStorage();
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
            solicitudes_vinculadas: JSON.stringify(solicitud.solicitudesVinculadas || [])
        };

        const { data, error } = await supabaseClient
            .from('solicitudes')
            .insert([solicitudDB])
            .select();
        
        if (error) throw error;

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
            comprobante_pago_nombre: solicitud.comprobantePago?.nombre || null
        };

        const { error } = await supabaseClient
            .from('solicitudes')
            .update(solicitudDB)
            .eq('id', solicitud.id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error actualizando solicitud:', error);
        throw error;
    }
}

// Guardar empresa en Supabase
// Guardar empresa en Supabase
async function guardarEmpresaSupabase(empresa) {
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return empresa;
    }

    try {
        const empresaDB = {
            razon_social: empresa.razonSocial,
            rfc: empresa.rfc
        };

        if (empresa.id) {
            // Actualizar
            const { error } = await supabaseClient
                .from('empresas')
                .update(empresaDB)
                .eq('id', empresa.id);
            if (error) throw error;
            return empresa;
        } else {
            // Insertar
            const { data, error } = await supabaseClient
                .from('empresas')
                .insert([empresaDB])
                .select();
            if (error) throw error;
            return { 
                id: data[0].id, 
                razonSocial: data[0].razon_social, 
                rfc: data[0].rfc 
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
    if (!usarSupabase) {
        guardarDatosLocalStorage();
        return beneficiario;
    }

    try {
        const beneficiarioDB = {
            nombre: beneficiario.nombre,
            razon_social: beneficiario.razonSocial,
            rfc: beneficiario.rfc,
            banco: beneficiario.banco,
            cuenta: beneficiario.cuenta,
            clabe: beneficiario.clabe,
            csf_url: beneficiario.csf?.datos || null,
            csf_nombre: beneficiario.csf?.nombre || null,
            csf_fecha: beneficiario.csf?.fecha || null
        };

        if (beneficiario.id) {
            // Actualizar
            const { error } = await supabaseClient
                .from('beneficiarios')
                .update(beneficiarioDB)
                .eq('id', beneficiario.id);
            if (error) throw error;
            return beneficiario;
        } else {
            // Insertar
            const { data, error } = await supabaseClient
                .from('beneficiarios')
                .insert([beneficiarioDB])
                .select();
            if (error) throw error;
            return { ...beneficiario, id: data[0].id };
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