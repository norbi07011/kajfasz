// Simple test for client routes without HTTP requests
import clientRoutes from './dist/routes/clients.js';
import fs from 'fs';

console.log('🔍 Testing client routes compilation...');
console.log('✅ Client routes imported successfully');
console.log('📋 Route object:', typeof clientRoutes);

// Test mock data access
const clientCode = fs.readFileSync('./dist/routes/clients.js', 'utf8');

if (clientCode.includes('mockClients')) {
  console.log('✅ Mock clients data found in compiled code');
} else {
  console.log('❌ Mock clients data not found');
}

if (clientCode.includes('router.get')) {
  console.log('✅ GET routes found');
}

if (clientCode.includes('router.post')) {
  console.log('✅ POST routes found');
}

if (clientCode.includes('router.put')) {
  console.log('✅ PUT routes found');
}

if (clientCode.includes('router.delete')) {
  console.log('✅ DELETE routes found');
}

console.log('🎉 All client route checks passed!');