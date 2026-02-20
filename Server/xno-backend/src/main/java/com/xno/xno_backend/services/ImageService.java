package com.xno.xno_backend.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ImageService {

    Map uploadImage(MultipartFile file);

    boolean deleteImage(String publicId);
}
