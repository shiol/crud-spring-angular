package com.shiol.crud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CarroTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Carro getCarroSample1() {
        return new Carro().id(1L).year(1).licensePlate("licensePlate1").model("model1").color("color1");
    }

    public static Carro getCarroSample2() {
        return new Carro().id(2L).year(2).licensePlate("licensePlate2").model("model2").color("color2");
    }

    public static Carro getCarroRandomSampleGenerator() {
        return new Carro()
            .id(longCount.incrementAndGet())
            .year(intCount.incrementAndGet())
            .licensePlate(UUID.randomUUID().toString())
            .model(UUID.randomUUID().toString())
            .color(UUID.randomUUID().toString());
    }
}
