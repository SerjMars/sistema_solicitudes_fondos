// IMPORTANTE: Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://yzedhbaotnilaykokojh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZWRoYmFvdG5pbGF5a29rb2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Mzc2NDUsImV4cCI6MjA3NTAxMzY0NX0.KAIq-OsYfVtmEhaDxlwoX25JjKrDooRwoEwkoK4pKSQ';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variable para verificar si Supabase está disponible
let usarSupabase = true;

// Verificar conexión
async function verificarConexionSupabase() {
    try {
        const { data, error } = await supabaseClient.from('empresas').select('count');
        if (error) {
            console.warn('Supabase no disponible, usando localStorage');
            usarSupabase = false;
        }
    } catch (e) {
        console.warn('Supabase no disponible, usando localStorage');
        usarSupabase = false;
    }
}

verificarConexionSupabase();