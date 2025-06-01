package com.battlearena.profile.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;
    
    private String username;  // Reference to auth service user
    
    private int xp;
    private int level;
    private String avatar;
    private List<String> skins;
    
    // Profile-specific fields
    private String displayName;
    private String bio;
    private List<String> achievements;
    private int totalMatches;
    private int wins;
    private int losses;
    private double winRate;
    private String preferredGameMode;
    private List<String> friends;
    private List<String> blockedUsers;
    private boolean isOnline;
    private String lastSeen;
} 