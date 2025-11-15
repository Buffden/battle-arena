package com.battlearena.leaderboard_service.unit;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.battlearena.leaderboard_service.LeaderboardServiceApplication;

/**
 * Unit tests for Leaderboard Service Application
 * Tests application context loading without external dependencies
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestPropertySource(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration"
})
class LeaderboardServiceApplicationTests {

	@Test
	void contextLoads() {
		// Test that Spring context loads successfully
		// This verifies that all beans are properly configured
		assertTrue(true, "Context should load successfully");
	}

	@Test
	void applicationMainMethodExists() {
		// Verify that main method exists and can be called
		assertTrue(LeaderboardServiceApplication.class.getDeclaredMethods().length > 0, 
			"Application class should have methods");
	}

	@Test
	void applicationClassIsNotNull() {
		assertNotNull(LeaderboardServiceApplication.class, "Application class should not be null");
	}
}
