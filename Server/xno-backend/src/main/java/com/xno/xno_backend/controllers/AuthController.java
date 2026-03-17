package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.InfoDTOs.MessageResponse;
import com.xno.xno_backend.models.DTOs.InfoDTOs.UserInfoResponse;
import com.xno.xno_backend.models.Role;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.repositories.AppRoleRepository;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.security.jwt.JwtUtils;
import com.xno.xno_backend.security.requests.LoginRequest;
import com.xno.xno_backend.security.requests.SignUpRequest;
import com.xno.xno_backend.services.AppUserService;
import com.xno.xno_backend.services.Result;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserService appUserService;
    private final JwtUtils jwtUtils;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppRoleRepository appRoleRepository;

    public AuthController(AuthenticationManager authenticationManager, AppUserService appUserService, JwtUtils jwtUtils, AppUserRepository userRepository, PasswordEncoder passwordEncoder, AppRoleRepository appRoleRepository) {
        this.authenticationManager = authenticationManager;
        this.appUserService = appUserService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.appRoleRepository = appRoleRepository;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        Result<MessageResponse> result = appUserService.registerUser(signUpRequest);

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.ok().body(result.getPayload());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Result<UserInfoResponse> result = appUserService.authenticateUser(loginRequest);

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, result.getPayload().getCookie().toString()).body(result.getPayload());

    }

    @GetMapping("/username")
    public String currentUsername(Authentication authentication) {
        return appUserService.currentUsername(authentication);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        Result<UserInfoResponse> result = appUserService.getUserDetails(authentication);

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.ok().body(result.getPayload());
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signOutUser() {
        ResponseCookie cookie = appUserService.signOut();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new MessageResponse("Successfully Signed Out"));
    }
}
