package com.shiol.crud.repository;

import com.shiol.crud.domain.Car;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Car entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    @Query("select car from Car car where car.user.login = ?#{principal.username}")
    List<Car> findByUserIsCurrentUser();
}
