package com.xno.xno_backend.models.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CopyRequest {
    private List<Long> playIds;
    private Long playbookId;
}
