package com.xno.xno_backend.models.DTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenerationDetails {
    private int maxRows; // minimum is default 30
    private boolean wrapPlays;
}
