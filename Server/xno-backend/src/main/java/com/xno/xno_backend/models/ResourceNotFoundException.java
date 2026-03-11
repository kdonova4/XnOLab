package com.xno.xno_backend.models;

public class ResourceNotFoundException extends RuntimeException {
    String entityName;
    String fieldName;
    Long fieldId;

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entityName, String fieldName, Long fieldId) {
        super(String.format("%s not found with %s: %d", entityName, fieldName, fieldId));
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldId = fieldId;
    }
}
