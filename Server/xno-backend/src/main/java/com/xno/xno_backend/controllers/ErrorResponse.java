package com.xno.xno_backend.controllers;

import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class ErrorResponse {

    private final String message;

    public ErrorResponse(String message) {
        this.message = message;
    }

    public static ResponseEntity<ErrorResponse> build(String message) {
        return new ResponseEntity<>(new ErrorResponse(message), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static ResponseEntity<ErrorResponse> build(String message, HttpStatus status) {
        return new ResponseEntity<>(new ErrorResponse(message), status);
    }

    public static <T> ResponseEntity<Object> build(Result<T> result) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        if(result.getType() == null || result.getType() == ResultType.INVALID) {
            status = HttpStatus.BAD_REQUEST;
        } else if(result.getType() == ResultType.NOT_FOUND) {
            status = HttpStatus.NOT_FOUND;
        } else if(result.getType() == ResultType.UNAUTHORIZED) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (result.getType() == ResultType.FORBIDDEN) {
            status = HttpStatus.FORBIDDEN;
        }

        return new ResponseEntity<>(result.getMessages(), status);
    }
}
