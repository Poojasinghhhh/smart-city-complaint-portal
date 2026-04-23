import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deleteAllComplaints() {
  try {
    console.log('Starting cleanup of all complaints...')
    
    // First, delete all related records in complaint_upvotes
    console.log('Deleting complaint upvotes...')
    const { error: upvotesError } = await supabase
      .from('complaint_upvotes')
      .delete()
      .neq('id', '') // Delete all records
    
    if (upvotesError) {
      console.error('Error deleting upvotes:', upvotesError)
    } else {
      console.log('✅ All complaint upvotes deleted')
    }
    
    // Then delete all complaints
    console.log('Deleting complaints...')
    const { error: complaintsError } = await supabase
      .from('complaints')
      .delete()
      .neq('id', '') // Delete all records
    
    if (complaintsError) {
      console.error('Error deleting complaints:', complaintsError)
    } else {
      console.log('✅ All complaints deleted')
    }
    
    console.log('🎉 Cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

// Run the cleanup
deleteAllComplaints()
