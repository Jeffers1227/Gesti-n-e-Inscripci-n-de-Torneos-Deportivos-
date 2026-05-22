package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class SecurityTestController {

	@GetMapping("/public/ping")
	public MessageResponse publicPing() {
		return new MessageResponse("public ok");
	}

	@GetMapping("/private/ping")
	public MessageResponse privatePing() {
		return new MessageResponse("private ok");
	}

	@GetMapping("/admin/ping")
	public MessageResponse adminPing() {
		return new MessageResponse("admin ok");
	}

	public record MessageResponse(String message) {}
}
