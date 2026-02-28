package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.InfoDTOs.UserInfoResponse;
import com.xno.xno_backend.models.Role;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.repositories.AppRoleRepository;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.security.jwt.JwtUtils;
import com.xno.xno_backend.security.requests.LoginRequest;
import com.xno.xno_backend.security.requests.SignUpRequest;
import com.xno.xno_backend.services.AppUserServiceImpl;
import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import io.jsonwebtoken.lang.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class AppUserServiceTest {

    @Mock
    AppUserRepository appUserRepository;

    @Mock
    AppRoleRepository appRoleRepository;

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    JwtUtils jwtUtils;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    Authentication authentication;

    @InjectMocks
    AppUserServiceImpl service;

    private AppUser appUser;
    private AppRole appRole;
    private UserInfoResponse userInfoResponse;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setup() {
        appRole = new AppRole(1L, Role.ROLE_USER);
        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "password1234", false, Set.of(appRole));

        SimpleGrantedAuthority role = new SimpleGrantedAuthority(appRole.getRoleName().name());
        userDetails = new UserDetailsImpl(appUser.getAppUserId(), appUser.getUsername(),
                appUser.getEmail(), appUser.getPassword(), List.of(role));
        userInfoResponse = new UserInfoResponse(appUser.getAppUserId(), appUser.getUsername(), List.of(appRole.getRoleName().name()));
    }

    @Test
    void shouldGetUserDetailsWhileAuthenticated() {
        when(authentication.getPrincipal()).thenReturn(userDetails);

        Result<UserInfoResponse> actual = service.getUserDetails(authentication);

        assertEquals(userInfoResponse, actual.getPayload());
    }

    @Test
    void shouldReturnUnauthorizedWhenAuthenticationNull() {
        Result<UserInfoResponse> result = service.getUserDetails(null);

        assertEquals(ResultType.UNAUTHORIZED, result.getType());
        assertNull(result.getPayload());
        assertTrue(result.getMessages().contains("Authentication Null"));
    }

    @Test
    void shouldRegisterValidUser() {
        SignUpRequest signUpRequest = new SignUpRequest(appUser.getEmail(), appUser.getUsername(), appUser.getPassword(), Set.of("user"));
        AppUser mockOut = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "$2y$10$OsunFx2AqJv962Jp7xQZEezNWGjyH.Q2divobmVS.VVR4MbGPv3bm", false, Set.of(appRole));


        when(appUserRepository.existsByUsername(appUser.getUsername())).thenReturn(false);
        when(appUserRepository.existsByEmail(appUser.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(appUser.getPassword())).thenReturn("$2y$10$OsunFx2AqJv962Jp7xQZEezNWGjyH.Q2divobmVS.VVR4MbGPv3bm");
        when(appRoleRepository.findByRoleName(Role.ROLE_USER)).thenReturn(Optional.of(appRole));
        when(appUserRepository.save(any(AppUser.class))).thenReturn(mockOut);

        Result<?> actual = service.registerUser(signUpRequest);

        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    @Test
    void shouldNotRegisterInvalidUser() {
        SignUpRequest signUpRequest = new SignUpRequest(appUser.getEmail(), appUser.getUsername(), appUser.getPassword(), Set.of("user"));

        when(appUserRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(true);

        Result<?> actual = service.registerUser(signUpRequest);
        assertEquals(ResultType.INVALID, actual.getType());
        assertTrue(actual.getMessages().contains("Username is already taken!"));

        when(appUserRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(true);
        when(appUserRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(false);

        actual = service.registerUser(signUpRequest);
        assertEquals(ResultType.INVALID, actual.getType());
        assertTrue(actual.getMessages().contains("Email is already taken!"));
    }

    @Test
    void shouldAuthenticateUser() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        when(jwtUtils.generateJwtCookie(any(UserDetailsImpl.class))).thenReturn(null);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        Result<UserInfoResponse> actual = service.authenticateUser(new LoginRequest(appUser.getUsername(), appUser.getPassword()));

        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    @Test
    void shouldNotAuthenticateUser() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(BadCredentialsException.class);

        Result<UserInfoResponse> actual = service.authenticateUser(new LoginRequest(appUser.getUsername(), appUser.getPassword()));

        assertEquals(ResultType.UNAUTHORIZED, actual.getType());
        assertTrue(actual.getMessages().contains("Bad Credentials"));
    }

}
