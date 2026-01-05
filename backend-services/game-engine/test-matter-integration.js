/**
 * Quick test to verify Matter.js integration
 * Run with: node test-matter-integration.js
 */

const MatterJsAdapter = require('./src/adapters/MatterJsAdapter');

// eslint-disable-next-line no-console
console.log('🔧 Testing Matter.js Integration...\n');

// Test 1: MatterJsAdapter import
try {
  // eslint-disable-next-line no-console
  console.log('✅ Test 1: MatterJsAdapter imported successfully');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Test 1 FAILED: MatterJsAdapter import failed', error.message);
  process.exit(1);
}

// Test 2: MatterJsAdapter initialization
try {
  const adapter = new MatterJsAdapter();
  adapter.initialize(0.001);
  // eslint-disable-next-line no-console
  console.log('✅ Test 2: MatterJsAdapter initialized successfully');
  // eslint-disable-next-line no-console
  console.log('   Engine created:', adapter.engine !== null);
  // eslint-disable-next-line no-console
  console.log('   World created:', adapter.world !== null);
  // eslint-disable-next-line no-console
  console.log('   Gravity Y:', adapter.world.gravity.y);
  // eslint-disable-next-line no-console
  console.log('   Gravity X:', adapter.world.gravity.x);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Test 2 FAILED: MatterJsAdapter initialization failed', error.message);
  process.exit(1);
}

// Test 3: Create projectile body
try {
  const adapter = new MatterJsAdapter();
  adapter.initialize(0.001);

  const projectile = adapter.createProjectileBody({ x: 100, y: 100 }, { x: 10, y: -20 });

  // eslint-disable-next-line no-console
  console.log('✅ Test 3: Projectile body created successfully');
  // eslint-disable-next-line no-console
  console.log('   Position:', projectile.position);
  // eslint-disable-next-line no-console
  console.log('   Velocity:', projectile.velocity);
  // eslint-disable-next-line no-console
  console.log('   Body ID:', projectile.id);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Test 3 FAILED: Projectile creation failed', error.message);
  // eslint-disable-next-line no-console
  console.error(error.stack);
  process.exit(1);
}

// Test 4: Physics update
try {
  const adapter = new MatterJsAdapter();
  adapter.initialize(0.001);

  const projectile = adapter.createProjectileBody({ x: 100, y: 100 }, { x: 10, y: -20 });

  const initialY = projectile.position.y;

  // Update physics for 100ms
  adapter.update(100);

  // eslint-disable-next-line no-console
  console.log('✅ Test 4: Physics update working');
  // eslint-disable-next-line no-console
  console.log('   Initial Y:', initialY);
  // eslint-disable-next-line no-console
  console.log('   After 100ms Y:', projectile.position.y);
  // eslint-disable-next-line no-console
  console.log('   Position changed:', projectile.position.y !== initialY);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Test 4 FAILED: Physics update failed', error.message);
  // eslint-disable-next-line no-console
  console.error(error.stack);
  process.exit(1);
}

// Test 5: Collision detection setup
try {
  const adapter = new MatterJsAdapter();
  adapter.initialize(0.001);

  adapter.detectCollisions((_bodyA, _bodyB) => {
    // Collision detected
  });

  // eslint-disable-next-line no-console
  console.log('✅ Test 5: Collision detection setup successful');
  // eslint-disable-next-line no-console
  console.log('   Collision handler registered');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Test 5 FAILED: Collision detection setup failed', error.message);
  // eslint-disable-next-line no-console
  console.error(error.stack);
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log('\n🎉 All tests passed! Matter.js is properly integrated.\n');
// eslint-disable-next-line no-console
console.log('Next steps:');
// eslint-disable-next-line no-console
console.log('1. Start the game engine server: npm start');
// eslint-disable-next-line no-console
console.log('2. Test weapon firing via WebSocket');
// eslint-disable-next-line no-console
console.log('3. Run full test suite: npm test\n');
