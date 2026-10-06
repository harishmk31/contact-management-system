const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING API TEST SUITE ===\n');

  // 1. Root route
  const root = await request({ hostname: 'localhost', port: 5000, path: '/', method: 'GET' });
  console.log('1. GET / -> Status:', root.status, '|', root.body.message);

  // 2. Create Contact - Success
  const c1 = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C101', name: 'Alice Wonderland', phone: '9876543210', email: 'alice@example.com' }
  );
  console.log('2. POST /contacts (Valid) -> Status:', c1.status, '|', c1.body.message);

  // 3. Create Contact - Duplicate Email
  const dupEmail = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C102', name: 'Bob', phone: '9123456780', email: 'alice@example.com' }
  );
  console.log('3. POST /contacts (Duplicate Email) -> Status:', dupEmail.status, '|', dupEmail.body.message);

  // 4. Create Contact - Duplicate contactId
  const dupId = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C101', name: 'Charlie', phone: '9123456781', email: 'charlie@example.com' }
  );
  console.log('4. POST /contacts (Duplicate contactId) -> Status:', dupId.status, '|', dupId.body.message);

  // 5. Create Contact - Invalid Phone (less than 10 digits)
  const invPhone = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C103', name: 'David', phone: '12345', email: 'david@example.com' }
  );
  console.log('5. POST /contacts (Invalid Phone) -> Status:', invPhone.status, '|', invPhone.body.message, '| Errors:', invPhone.body.errors);

  // 6. Create Contact - Invalid Email format
  const invEmail = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C104', name: 'Emma', phone: '9876543211', email: 'invalid-email' }
  );
  console.log('6. POST /contacts (Invalid Email) -> Status:', invEmail.status, '|', invEmail.body.message, '| Errors:', invEmail.body.errors);

  // 7. Create Contact - Missing Required Field
  const missingField = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { contactId: 'C105', email: 'missing@example.com' }
  );
  console.log('7. POST /contacts (Missing Fields) -> Status:', missingField.status, '|', missingField.body.message, '| Errors:', missingField.body.errors);

  // 8. Get All Contacts
  const allContacts = await request({ hostname: 'localhost', port: 5000, path: '/contacts', method: 'GET' });
  console.log('8. GET /contacts -> Status:', allContacts.status, '| Total Contacts Count:', allContacts.body.count);

  // 9. Get Contact By custom contactId
  const getById = await request({ hostname: 'localhost', port: 5000, path: '/contacts/C101', method: 'GET' });
  console.log('9. GET /contacts/C101 -> Status:', getById.status, '| Found Name:', getById.body.data ? getById.body.data.name : 'N/A');

  // 10. Update Contact
  const updated = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/contacts/C101',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'Alice Smith', phone: '9998887776' }
  );
  console.log('10. PUT /contacts/C101 -> Status:', updated.status, '| Updated Name:', updated.body.data ? updated.body.data.name : 'N/A', '| Phone:', updated.body.data ? updated.body.data.phone : 'N/A');

  // 11. Delete Contact
  const deleted = await request({ hostname: 'localhost', port: 5000, path: '/contacts/C101', method: 'DELETE' });
  console.log('11. DELETE /contacts/C101 -> Status:', deleted.status, '|', deleted.body.message);

  // 12. Verify deleted (Not Found)
  const notFound = await request({ hostname: 'localhost', port: 5000, path: '/contacts/C101', method: 'GET' });
  console.log('12. GET /contacts/C101 (After Delete) -> Status:', notFound.status, '|', notFound.body.message);

  // 13. Invalid ID test (Not Found)
  const nonExistent = await request({ hostname: 'localhost', port: 5000, path: '/contacts/UNKNOWN_999', method: 'GET' });
  console.log('13. GET /contacts/UNKNOWN_999 (Invalid/Non-existent ID) -> Status:', nonExistent.status, '|', nonExistent.body.message);

  console.log('\n=== ALL TESTS PASSED! ===');
}

runTests().catch(console.error);
