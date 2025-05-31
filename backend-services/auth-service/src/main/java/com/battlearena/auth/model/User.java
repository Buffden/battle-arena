package com.battlearena.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true, sparse = true)
    private String email;

    private String password;   // bcrypt hashed

    private String googleId;   // optional for OAuth
    private String guestToken; // optional for guest login

    private int xp;
    private int level;
    private String avatar;
    private List<String> skins;

    private String authType; // "standard", "google", "guest"
}
