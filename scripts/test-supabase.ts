import { supabase } from '../src/lib/supabase';

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('app_events').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Database query result:', data);
    
    // Test storage bucket access
    const { data: storageData, error: storageError } = await supabase.storage
      .from('images')
      .list('events', { limit: 1 });
    
    if (storageError) {
      console.log('⚠️ Storage bucket not accessible (this is normal if not set up yet):', storageError.message);
    } else {
      console.log('✅ Storage bucket accessible');
      console.log('📁 Storage contents:', storageData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSupabaseConnection();
