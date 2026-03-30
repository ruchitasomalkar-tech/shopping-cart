package com.example.demo.service;

import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CartService {

    @Autowired
    private ProductService productService;

    private final Map<String, Cart> carts = new HashMap<>();

    private Cart getOrCreateCart(String sessionId) {
        return carts.computeIfAbsent(sessionId, k -> new Cart());
    }

    public Cart getCart(String sessionId) {
        return getOrCreateCart(sessionId);
    }

    public Cart addToCart(String sessionId, Long productId, int quantity) {
        Cart cart = getOrCreateCart(sessionId);
        Product product = productService.getProductById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
        } else {
            cart.getItems().add(new CartItem(product, quantity));
        }
        return cart;
    }

    public Cart removeFromCart(String sessionId, Long productId) {
        Cart cart = getOrCreateCart(sessionId);
        cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
        return cart;
    }

    public Cart updateQuantity(String sessionId, Long productId, int quantity) {
        if (quantity <= 0) return removeFromCart(sessionId, productId);
        Cart cart = getOrCreateCart(sessionId);
        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(quantity));
        return cart;
    }

    public Cart clearCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        cart.getItems().clear();
        return cart;
    }
}