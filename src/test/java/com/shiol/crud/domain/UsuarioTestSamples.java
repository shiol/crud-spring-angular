package com.shiol.crud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UsuarioTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Usuario getUsuarioSample1() {
        return new Usuario()
            .id(1L)
            .firstName("firstName1")
            .lastName("lastName1")
            .email("email1")
            .login("login1")
            .password("password1")
            .phone("phone1");
    }

    public static Usuario getUsuarioSample2() {
        return new Usuario()
            .id(2L)
            .firstName("firstName2")
            .lastName("lastName2")
            .email("email2")
            .login("login2")
            .password("password2")
            .phone("phone2");
    }

    public static Usuario getUsuarioRandomSampleGenerator() {
        return new Usuario()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .login(UUID.randomUUID().toString())
            .password(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString());
    }
}
