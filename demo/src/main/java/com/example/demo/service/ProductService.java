package com.example.demo.service;

import com.example.demo.model.Product;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final List<Product> products = new ArrayList<>();

    public ProductService() {
        products.add(new Product(1L, "Mechanical Keyboard", "RGB backlit, tactile switches", 2499.00, "⌨️", "Electronics", 15));
        products.add(new Product(2L, "Wireless Mouse", "Ergonomic, 3200 DPI", 999.00, "🖱️", "Electronics", 30));
        products.add(new Product(3L, "27\" Monitor", "1080p IPS, 144Hz", 12999.00, "🖥️", "Electronics", 8));
        products.add(new Product(4L, "USB-C Hub", "7-in-1 multiport adapter", 1499.00, "🔌", "Electronics", 25));
        products.add(new Product(5L, "Headphones", "40hr battery, noise cancel", 4999.00, "🎧", "Electronics", 12));
        products.add(new Product(6L, "Laptop Stand", "Adjustable aluminium", 799.00, "💻", "Accessories", 40));
        products.add(new Product(7L, "Webcam 1080p", "Full HD with built-in mic", 1799.00, "📷", "Electronics", 20));
        products.add(new Product(8L, "Desk Lamp", "LED touch dimmer", 649.00, "💡", "Accessories", 35));
    }

    public List<Product> getAllProducts() { return products; }

    public Optional<Product> getProductById(Long id) {
        return products.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public List<Product> getProductsByCategory(String category) {
        return products.stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }
}