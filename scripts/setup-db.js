#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database...');

  try {
    // Read and execute the seed.sql file
    const seedPath = path.join(__dirname, '..', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Split the SQL into individual statements
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          console.error('Statement:', statement);
          throw error;
        }
      }
    }

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('Tables created:');
    console.log('- users');
    console.log('- subscriptions');
    console.log('- cancellations');
    console.log('');
    console.log('Sample data inserted:');
    console.log('- 3 users with email addresses');
    console.log('- 3 subscriptions ($25 and $29 plans)');
    console.log('');
    console.log('RLS policies enabled for security');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 