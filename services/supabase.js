// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seu-projeto.supabase.co'; // substitua pelo seu URL do Supabase
const supabaseKey = 'SUA-CHAVE-API'; // substitua pela sua chave anon/public
export const supabase = createClient(supabaseUrl, supabaseKey);
