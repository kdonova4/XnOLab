package com.xno.xno_backend.models;

public class APIException extends RuntimeException {
    public APIException(String message) {
        super(message);
    }
}
