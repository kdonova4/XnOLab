package com.xno.xno_backend.services;

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
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AppUserServiceImpl implements AppUserService{

    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AppUserServiceImpl(AppUserRepository appUserRepository, AppRoleRepository appRoleRepository, AuthenticationManager authenticationManager, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.appRoleRepository = appRoleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String currentUsername(Authentication authentication) {
        if(authentication != null) {
            return authentication.getName();
        } else {
            return "";
        }
    }

    @Override
    public Result<UserInfoResponse> getUserDetails(Authentication authentication) {
        Result<UserInfoResponse> result = new Result<>();

        if(authentication == null) {
            result.addMessages("Authentication Null", ResultType.UNAUTHORIZED);
            return result;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority()).toList();


        UserInfoResponse userInfoResponse = new UserInfoResponse(
                userDetails.getUserId(),
                userDetails.getUsername(),
                roles
        );
        result.setPayload(userInfoResponse);
        return result;
    }

    @Override
    public ResponseCookie signOut() {
        return jwtUtils.getCleanJwtCookie();
    }

    @Override
    public Result<?> registerUser(SignUpRequest signUpRequest) {
        Result<MessageResponse> result = new Result<>();
        if(appUserRepository.existsByUsername(signUpRequest.getUsername())) {
            result.addMessages("Username is already taken!", ResultType.INVALID);
            return result;
        }
        if(appUserRepository.existsByEmail(signUpRequest.getEmail())) {
            result.addMessages("Email is already taken!", ResultType.INVALID);
            return result;
        }

        AppUser appUser = new AppUser(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword())
        );

        Set<String> strRoles = signUpRequest.getRoles();
        Set<AppRole> roles = new HashSet<>();

        if(strRoles == null) {
            AppRole userRole = appRoleRepository.findByRoleName(Role.ROLE_USER)
                    .orElseThrow(() -> new NoSuchElementException("Error: Role is not found"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if(role.equals("admin")) {
                    AppRole adminRole = appRoleRepository.findByRoleName(Role.ROLE_ADMIN)
                            .orElseThrow(() -> new NoSuchElementException("Error: Role is not found"));
                    roles.add(adminRole);
                } else {
                    AppRole defaultRole = appRoleRepository.findByRoleName(Role.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
                    roles.add(defaultRole);
                }
            });
        }

        appUser.setRoles(roles);
        appUserRepository.save(appUser);
        return result;
    }

    @Override
    public Result<UserInfoResponse> authenticateUser(LoginRequest loginRequest) {
        Result<UserInfoResponse> result = new Result<>();
        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            result.addMessages("Bad Credentials", ResultType.UNAUTHORIZED);
            return result;
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl)  authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority()).toList();
        UserInfoResponse response = new UserInfoResponse(userDetails.getUserId(), jwtCookie, userDetails.getUsername(), roles);

        result.setPayload(response);

        return result;
    }
}
