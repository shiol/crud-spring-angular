package com.shiol.crud.repository;

import com.shiol.crud.domain.Carro;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Carro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarroRepository extends JpaRepository<Carro, Long> {}
