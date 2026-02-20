package com.xno.xno_backend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryImageService implements ImageService{

    private final Cloudinary cloudinary;

    public CloudinaryImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map uploadImage(MultipartFile file) {
        try {
            File uploadedFile = convertToFile(file);
            Map uploadResult = cloudinary.uploader().upload(uploadedFile, ObjectUtils.emptyMap());
            uploadedFile.delete();
            return uploadResult;
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public boolean deleteImage(String publicId) {
        Map<String, Object> options = ObjectUtils.asMap(
                "resource_type", "image",
                "invalidate", true
        );
        Map uploadResult = new HashMap<>();
        try {
            uploadResult = cloudinary.uploader().destroy(publicId, options);
        } catch (IOException e) {
            throw new RuntimeException("Image deletion failed");
        }

        if(uploadResult.get("result").equals("ok")) {
            return true;
        } else {
            return false;
        }
    }

    public File convertToFile(MultipartFile file) throws IOException {
        File convertedFile = File.createTempFile("upload-", file.getOriginalFilename());
        try (FileOutputStream fileOutputStream = new FileOutputStream(convertedFile)) {
            fileOutputStream.write(file.getBytes());
        }

        return convertedFile;
    }
}
