import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfhdbjbihlptkfxhmwth.supabase.co';
const supabaseKey = 'sb_publishable_srfMsyNnjJTAqcjv-0y7lQ_-hJsD1Av'; // Возьми в Settings -> API

export const supabase = createClient(supabaseUrl, supabaseKey);