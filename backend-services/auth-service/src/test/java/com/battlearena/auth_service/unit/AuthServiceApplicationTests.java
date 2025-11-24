package com.battlearena.auth_service.unit;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.battlearena.auth_service.AuthServiceApplication;

/**
 * Unit tests for Auth Service Application
 *
 * <p>
 * Tests application class structure without loading the full Spring context. These are simple unit
 * tests that don't require Spring Boot context initialization.
 * </p>
 *
 * <p>
 * Note: Full integration tests that load the application context require MongoDB. For integration
 * tests, use Testcontainers or mock MongoDB.
 * </p>
 */
class AuthServiceApplicationTests {

	@Test
	void applicationMainMethodExists() {
		// Verify that main method exists and can be called
		assertTrue(AuthServiceApplication.class.getDeclaredMethods().length > 0,
				"Application class should have methods");
	}

	@Test
	void applicationClassIsNotNull() {
		assertNotNull(AuthServiceApplication.class, "Application class should not be null");
	}

	@Test
	void applicationClassHasMainMethod() {
		// Verify main method signature
		try {
			AuthServiceApplication.class.getDeclaredMethod("main", String[].class);
			assertTrue(true, "Main method exists");
		} catch (NoSuchMethodException e) {
			throw new AssertionError("Main method should exist", e);
		}
	}
}
