package com.shiol.crud.domain;

import static com.shiol.crud.domain.CarTestSamples.*;
import static com.shiol.crud.domain.UserTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.shiol.crud.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(User.class);
        User user1 = getUserSample1();
        User user2 = new User();
        assertThat(user1).isNotEqualTo(user2);

        user2.setId(user1.getId());
        assertThat(user1).isEqualTo(user2);

        user2 = getUserSample2();
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void carsTest() throws Exception {
        User user = getUserRandomSampleGenerator();
        Car carBack = getCarRandomSampleGenerator();

        user.addCars(carBack);
        assertThat(user.getCars()).containsOnly(carBack);
        assertThat(carBack.getUser()).isEqualTo(user);

        user.removeCars(carBack);
        assertThat(user.getCars()).doesNotContain(carBack);
        assertThat(carBack.getUser()).isNull();

        user.cars(new HashSet<>(Set.of(carBack)));
        assertThat(user.getCars()).containsOnly(carBack);
        assertThat(carBack.getUser()).isEqualTo(user);

        user.setCars(new HashSet<>());
        assertThat(user.getCars()).doesNotContain(carBack);
        assertThat(carBack.getUser()).isNull();
    }
}
