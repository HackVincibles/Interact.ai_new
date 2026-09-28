import { parse } from 'pg-connection-string';
const url = "postgresql://postgres:Carryminati%40001@db.skejbzeoisulhaebtfrt.supabase.co:5432/postgres";
console.log(parse(url));
