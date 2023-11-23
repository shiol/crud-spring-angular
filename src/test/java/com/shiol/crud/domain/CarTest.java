package com.shiol.crud.domain;

import static com.shiol.crud.domain.CarTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.shiol.crud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CarTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Car.class);
        Car car1 = getCarSample1();
        Car car2 = new Car();
        assertThat(car1).isNotEqualTo(car2);

        car2.setId(car1.getId());
        assertThat(car1).isEqualTo(car2);

        car2 = getCarSample2();
        assertThat(car1).isNotEqualTo(car2);
    }
}
