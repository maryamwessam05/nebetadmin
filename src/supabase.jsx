
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gjflnplyyumvixumcfjd.supabase.co'
const supabaseKey = "sb_publishable_IOqrpA2TLVs-CfQg_iMGsw_Y27Wgtss"
export const supabase = createClient(supabaseUrl, supabaseKey)