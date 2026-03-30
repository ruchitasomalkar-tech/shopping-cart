package com.example.demo.controller;

import com.example.demo.model.Cart;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestParam String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Map<String, Object> body) {
        String sessionId = (String) body.get("sessionId");
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());
        return ResponseEntity.ok(cartService.addToCart(sessionId, productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeFromCart(@RequestBody Map<String, Object> body) {
        String sessionId = (String) body.get("sessionId");
        Long productId = Long.valueOf(body.get("productId").toString());
        return ResponseEntity.ok(cartService.removeFromCart(sessionId, productId));
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateQuantity(@RequestBody Map<String, Object> body) {
        String sessionId = (String) body.get("sessionId");
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());
        return ResponseEntity.ok(cartService.updateQuantity(sessionId, productId, quantity));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clearCart(@RequestParam String sessionId) {
        return ResponseEntity.ok(cartService.clearCart(sessionId));
    }
}