// ============================================
// supabase-config.js - VERSIÓN CORREGIDA
// ============================================

// IMPORTANTE: Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://yzedhbaotnilaykokojh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZWRoYmFvdG5pbGF5a29rb2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Mzc2NDUsImV4cCI6MjA3NTAxMzY0NX0.KAIq-OsYfVtmEhaDxlwoX25JjKrDooRwoEwkoK4pKSQ';

// Verificar que la librería de Supabase esté cargada
if (!window.supabase) {
    console.error('❌ ERROR CRÍTICO: La librería de Supabase no está cargada');
    alert('Error: No se pudo cargar Supabase. Verifica tu conexión a internet.');
}

// Crear cliente de Supabase y exponerlo globalmente
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variable global para verificar si Supabase está disponible.
// Empieza en false: nadie debe asumir que Supabase está listo hasta que
// window.supabaseListo se resuelva (ver abajo).
window.usarSupabase = false;

// Verificar conexión
async function verificarConexionSupabase() {
    try {
        const { data, error } = await window.supabase.from('empresas').select('count');
        if (error) {
            console.warn('⚠️ Supabase no disponible, usando localStorage');
            window.usarSupabase = false;
        } else {
            window.usarSupabase = true;
        }
    } catch (e) {
        console.warn('⚠️ Supabase no disponible, usando localStorage');
        window.usarSupabase = false;
    }
}

// Promesa que el resto de la app debe esperar antes de leer window.usarSupabase
// o llamar a funciones que dependen de Supabase.
window.supabaseListo = verificarConexionSupabase();