// Simple API test script for the blog system
// Run this after starting the backend server

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Blog API Endpoints...\n');

  try {
    // Test 1: Get published blogs (public endpoint)
    console.log('1️⃣ Testing GET /blogs/published...');
    const publishedResponse = await fetch(`${API_BASE}/blogs/published`);
    console.log(`   Status: ${publishedResponse.status}`);
    if (publishedResponse.ok) {
      const data = await publishedResponse.json();
      console.log(`   ✅ Success: Found ${data.blogs?.length || 0} published blogs`);
    } else {
      console.log(`   ❌ Failed: ${publishedResponse.statusText}`);
    }

    // Test 2: Test authentication (should fail without token)
    console.log('\n2️⃣ Testing GET /blogs (without auth - should fail)...');
    const authResponse = await fetch(`${API_BASE}/blogs`);
    console.log(`   Status: ${authResponse.status}`);
    if (authResponse.status === 401) {
      console.log('   ✅ Success: Properly protected endpoint');
    } else {
      console.log(`   ⚠️ Unexpected: ${authResponse.statusText}`);
    }

    // Test 3: Test CORS (should allow admin dashboard)
    console.log('\n3️⃣ Testing CORS headers...');
    const corsResponse = await fetch(`${API_BASE}/blogs/published`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    console.log(`   Status: ${corsResponse.status}`);
    console.log(`   CORS Headers: ${corsResponse.headers.get('Access-Control-Allow-Origin')}`);

    console.log('\n🎉 API Tests Completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Complete Supabase setup in .env file');
    console.log('2. Run database migration: npx prisma migrate dev --name add-blog-schema');
    console.log('3. Seed database: node prisma/seed.js');
    console.log('4. Test admin login and blog management');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3000');
  }
}

// Run tests
testAPI();

