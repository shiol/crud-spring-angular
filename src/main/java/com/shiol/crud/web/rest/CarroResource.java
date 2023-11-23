package com.shiol.crud.web.rest;

import com.shiol.crud.domain.Carro;
import com.shiol.crud.repository.CarroRepository;
import com.shiol.crud.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.shiol.crud.domain.Carro}.
 */
@RestController
@RequestMapping("/api/carros")
@Transactional
public class CarroResource {

    private final Logger log = LoggerFactory.getLogger(CarroResource.class);

    private static final String ENTITY_NAME = "carro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CarroRepository carroRepository;

    public CarroResource(CarroRepository carroRepository) {
        this.carroRepository = carroRepository;
    }

    /**
     * {@code POST  /carros} : Create a new carro.
     *
     * @param carro the carro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new carro, or with status {@code 400 (Bad Request)} if the carro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Carro> createCarro(@RequestBody Carro carro) throws URISyntaxException {
        log.debug("REST request to save Carro : {}", carro);
        if (carro.getId() != null) {
            throw new BadRequestAlertException("A new carro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Carro result = carroRepository.save(carro);
        return ResponseEntity
            .created(new URI("/api/carros/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /carros/:id} : Updates an existing carro.
     *
     * @param id the id of the carro to save.
     * @param carro the carro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated carro,
     * or with status {@code 400 (Bad Request)} if the carro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the carro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Carro> updateCarro(@PathVariable(value = "id", required = false) final Long id, @RequestBody Carro carro)
        throws URISyntaxException {
        log.debug("REST request to update Carro : {}, {}", id, carro);
        if (carro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, carro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!carroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Carro result = carroRepository.save(carro);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, carro.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /carros/:id} : Partial updates given fields of an existing carro, field will ignore if it is null
     *
     * @param id the id of the carro to save.
     * @param carro the carro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated carro,
     * or with status {@code 400 (Bad Request)} if the carro is not valid,
     * or with status {@code 404 (Not Found)} if the carro is not found,
     * or with status {@code 500 (Internal Server Error)} if the carro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Carro> partialUpdateCarro(@PathVariable(value = "id", required = false) final Long id, @RequestBody Carro carro)
        throws URISyntaxException {
        log.debug("REST request to partial update Carro partially : {}, {}", id, carro);
        if (carro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, carro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!carroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Carro> result = carroRepository
            .findById(carro.getId())
            .map(existingCarro -> {
                if (carro.getYear() != null) {
                    existingCarro.setYear(carro.getYear());
                }
                if (carro.getLicensePlate() != null) {
                    existingCarro.setLicensePlate(carro.getLicensePlate());
                }
                if (carro.getModel() != null) {
                    existingCarro.setModel(carro.getModel());
                }
                if (carro.getColor() != null) {
                    existingCarro.setColor(carro.getColor());
                }

                return existingCarro;
            })
            .map(carroRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, carro.getId().toString())
        );
    }

    /**
     * {@code GET  /carros} : get all the carros.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of carros in body.
     */
    @GetMapping("")
    public List<Carro> getAllCarros() {
        log.debug("REST request to get all Carros");
        return carroRepository.findAll();
    }

    /**
     * {@code GET  /carros/:id} : get the "id" carro.
     *
     * @param id the id of the carro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the carro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Carro> getCarro(@PathVariable Long id) {
        log.debug("REST request to get Carro : {}", id);
        Optional<Carro> carro = carroRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(carro);
    }

    /**
     * {@code DELETE  /carros/:id} : delete the "id" carro.
     *
     * @param id the id of the carro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarro(@PathVariable Long id) {
        log.debug("REST request to delete Carro : {}", id);
        carroRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
