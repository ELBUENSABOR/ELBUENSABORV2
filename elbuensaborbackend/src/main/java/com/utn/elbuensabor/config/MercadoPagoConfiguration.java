package com.utn.elbuensabor.config;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfiguration {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new IllegalStateException(
                    "Falta configurar mercadopago.access-token. Definí MERCADOPAGO_ACCESS_TOKEN con un token válido."
            );
        }
        MercadoPagoConfig.setAccessToken(accessToken);
        System.out.println("MercadoPago token configurado.");
    }
}
