// ============================================
// CONFIGURACIÓN DEL ORGANIGRAMA Y FLUJO DE AUTORIZACIONES
// ============================================

const organigramaEmpresa = {
    // Definición de departamentos/sucursales/áreas
    departamentos: {
        // ============================================
        // SUCURSALES (reportan a Gerencia de Sucursales)
        // ============================================
        'AGS': { nombre: 'Aguascalientes', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        'LEO': { nombre: 'León', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        'CAN': { nombre: 'Cancún', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        'MTY': { nombre: 'Monterrey', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        'GDL': { nombre: 'Guadalajara', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        'VSA': { nombre: 'Villahermosa', tipo: 'sucursal', reportaA: 'GCS', nivelAutorizacion: 1 },
        
        // Coordinador de Sucursales (reporta a Gerencia de Sucursales)
        'COS': { nombre: 'Coordinador de Sucursales', tipo: 'coordinacion', reportaA: 'GCS', nivelAutorizacion: 1 },
        
        // ============================================
        // ÁREAS DE CENTRO (reportan a Gerencia de Centro)
        // ============================================
        'MON': { nombre: 'Coordinación de Monitoreo e Iluminación', tipo: 'coordinacion', reportaA: 'GCC', nivelAutorizacion: 1 },
        'CEN': { nombre: 'Coordinadora de Centro', tipo: 'coordinacion', reportaA: 'GCC', nivelAutorizacion: 1 },
        
        // ============================================
        // ÁREAS QUE REPORTAN DIRECTO A DIR. OPERACIONES
        // ============================================
        'CMP': { nombre: 'Compras', tipo: 'area', reportaA: 'DOP', nivelAutorizacion: 1 },
        'SEH': { nombre: 'Seguridad e Higiene', tipo: 'area', reportaA: 'CMP', reportaFinalA: 'DOP', nivelAutorizacion: 1 },
        
        // ============================================
        // GERENCIAS (pueden autorizar)
        // ============================================
        'GCS': { 
            nombre: 'Gerencia de Sucursales', 
            tipo: 'gerencia', 
            reportaA: 'DOP', 
            puedeAutorizar: true,
            nivelAutorizacion: 2
        },
        'GCC': { 
            nombre: 'Gerencia de Centro', 
            tipo: 'gerencia', 
            reportaA: 'DOP', 
            puedeAutorizar: true,
            nivelAutorizacion: 2
        },
        
        // ============================================
        // DIRECCIONES (pueden autorizar - máxima autoridad)
        // ============================================
        'DOP': { 
            nombre: 'Dirección de Operaciones', 
            tipo: 'direccion', 
            reportaA: 'DIR', 
            puedeAutorizar: true,
            nivelAutorizacion: 3
        },
        'DIR': { 
            nombre: 'Dirección General', 
            tipo: 'direccion', 
            reportaA: null, 
            puedeAutorizar: true,
            nivelAutorizacion: 4  // Máxima autoridad
        },
        
        // ============================================
        // ÁREAS STAFF (Contabilidad y Tesorería)
        // ============================================
        'CONT': { 
            nombre: 'Contabilidad', 
            tipo: 'staff', 
            reportaA: 'DIR', 
            soloRevisa: true,
            puedeAutorizar: false,
            nivelAutorizacion: 0  // No autoriza
        },
        'TES': { 
            nombre: 'Tesorería', 
            tipo: 'staff', 
            reportaA: 'DIR', 
            soloPaga: true,
            puedeAutorizar: false,
            nivelAutorizacion: 0  // No autoriza, solo paga
        }
    },
    
    // ============================================
    // OBTENER FLUJO COMPLETO DE AUTORIZACIÓN
    // ============================================
    obtenerFlujoAutorizacion: function(departamentoOrigen, empresaId) {
        const flujo = [];
        let actual = departamentoOrigen;
        const visitados = new Set(); // Evitar ciclos
        
        // 1. Agregar el departamento origen
        const dptoOrigen = this.departamentos[actual];
        if (dptoOrigen) {
            flujo.push({
                codigo: actual,
                nombre: dptoOrigen.nombre,
                tipo: dptoOrigen.tipo,
                accion: 'solicita',
                nivelAutorizacion: dptoOrigen.nivelAutorizacion || 1
            });
        }
        
        // 2. Construir la cadena de autorizaciones siguiendo reportaA
        while (actual && !visitados.has(actual)) {
            visitados.add(actual);
            const dpto = this.departamentos[actual];
            if (!dpto) break;
            
            // Caso especial: SEH pasa primero por CMP para revisión
            if (actual === 'SEH' && dpto.reportaA === 'CMP') {
                flujo.push({
                    codigo: 'CMP',
                    nombre: this.departamentos['CMP'].nombre,
                    tipo: 'area',
                    accion: 'revisa',
                    nivelAutorizacion: this.departamentos['CMP'].nivelAutorizacion
                });
                actual = dpto.reportaFinalA;
                continue;
            }
            
            // Avanzar al siguiente nivel
            actual = dpto.reportaA;
            
            if (actual) {
                const siguienteDpto = this.departamentos[actual];
                if (siguienteDpto) {
                    flujo.push({
                        codigo: actual,
                        nombre: siguienteDpto.nombre,
                        tipo: siguienteDpto.tipo,
                        accion: siguienteDpto.puedeAutorizar ? 'autoriza' : 'revisa',
                        nivelAutorizacion: siguienteDpto.nivelAutorizacion || 0
                    });
                }
            }
        }
        
        // 3. Agregar Contabilidad antes de Dirección General (si no es DESPACHO S/C)
        const indexDirGeneral = flujo.findIndex(f => f.codigo === 'DIR');
        if (indexDirGeneral > -1) {
            const empresa = empresas.find(e => e.id === empresaId);
            const esDespacho = empresa && empresa.razonSocial.toUpperCase().includes('DESPACHO S/C');
            
            if (!esDespacho) {
                flujo.splice(indexDirGeneral, 0, {
                    codigo: 'CONT',
                    nombre: 'Contabilidad',
                    tipo: 'staff',
                    accion: 'revisa',
                    nivelAutorizacion: 0
                });
            }
        }
        
        // 4. Agregar Tesorería al final (siempre)
        flujo.push({
            codigo: 'TES',
            nombre: 'Tesorería',
            tipo: 'staff',
            accion: 'paga',
            nivelAutorizacion: 0
        });
        
        return flujo;
    },
    
    // ============================================
    // VERIFICAR SI UN ROL/DEPARTAMENTO PUEDE AUTORIZAR A OTRO
    // ============================================
    puedeAutorizar: function(autorizador, solicitante, empresaId) {
        const flujo = this.obtenerFlujoAutorizacion(solicitante, empresaId);
        
        // Buscar si el autorizador está en el flujo con acción 'autoriza'
        const nivelAutorizador = flujo.find(nivel => 
            nivel.codigo === autorizador && nivel.accion === 'autoriza'
        );
        
        return nivelAutorizador !== undefined;
    },
    
    // ============================================
    // OBTENER NIVEL DE AUTORIZACIÓN DE UN DEPARTAMENTO/ROL
    // ============================================
    obtenerNivelAutorizacion: function(codigo) {
        const dpto = this.departamentos[codigo];
        return dpto ? (dpto.nivelAutorizacion || 0) : 0;
    },
    
    // ============================================
    // VERIFICAR SI UN USUARIO TIENE MAYOR JERARQUÍA QUE OTRO
    // ============================================
    tieneMayorJerarquia: function(codigo1, codigo2) {
        const nivel1 = this.obtenerNivelAutorizacion(codigo1);
        const nivel2 = this.obtenerNivelAutorizacion(codigo2);
        return nivel1 > nivel2;
    },
    
    // ============================================
    // OBTENER GERENCIA A LA QUE PERTENECE UN DEPARTAMENTO
    // ============================================
    obtenerGerencia: function(departamento) {
        let actual = departamento;
        const visitados = new Set();
        
        while (actual && !visitados.has(actual)) {
            visitados.add(actual);
            const dpto = this.departamentos[actual];
            if (!dpto) return null;
            if (dpto.tipo === 'gerencia') return actual;
            actual = dpto.reportaA;
        }
        return null;
    },
    
    // ============================================
    // OBTENER TODOS LOS DEPARTAMENTOS QUE REPORTAN A UNA GERENCIA
    // ============================================
    obtenerDepartamentosDeGerencia: function(gerencia) {
        const departamentos = [];
        for (const [codigo, dpto] of Object.entries(this.departamentos)) {
            if (dpto.reportaA === gerencia || this.obtenerGerencia(codigo) === gerencia) {
                departamentos.push(codigo);
            }
        }
        return departamentos;
    }
};

// Exportar para uso global
window.organigramaEmpresa = organigramaEmpresa;