package com.xno.xno_backend.controllers;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    private final JdbcTemplate jdbcTemplate;

    public DevController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/reset-db")
    public void resetDatabase() {
        jdbcTemplate.execute("CALL xno.reset_xno_database()");
    }

}
