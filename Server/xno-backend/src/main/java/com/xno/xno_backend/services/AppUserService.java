package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.InfoDTOs.MessageResponse;
import com.xno.xno_backend.models.DTOs.InfoDTOs.UserInfoResponse;
import com.xno.xno_backend.security.requests.LoginRequest;
import com.xno.xno_backend.security.requests.SignUpRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;

public interface AppUserService {

    String currentUsername(Authentication authentication);

    Result<UserInfoResponse> getUserDetails(Authentication authentication);

    ResponseCookie signOut();

    Result<?> registerUser(SignUpRequest signUpRequest);

    Result<UserInfoResponse> authenticateUser(LoginRequest loginRequest);


}
