package com.shiol.crud.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.shiol.crud.IntegrationTest;
import com.shiol.crud.domain.Carro;
import com.shiol.crud.repository.CarroRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CarroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CarroResourceIT {

    private static final Integer DEFAULT_YEAR = 1;
    private static final Integer UPDATED_YEAR = 2;

    private static final String DEFAULT_LICENSE_PLATE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE_PLATE = "BBBBBBBBBB";

    private static final String DEFAULT_MODEL = "AAAAAAAAAA";
    private static final String UPDATED_MODEL = "BBBBBBBBBB";

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/carros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CarroRepository carroRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCarroMockMvc;

    private Carro carro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Carro createEntity(EntityManager em) {
        Carro carro = new Carro().year(DEFAULT_YEAR).licensePlate(DEFAULT_LICENSE_PLATE).model(DEFAULT_MODEL).color(DEFAULT_COLOR);
        return carro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Carro createUpdatedEntity(EntityManager em) {
        Carro carro = new Carro().year(UPDATED_YEAR).licensePlate(UPDATED_LICENSE_PLATE).model(UPDATED_MODEL).color(UPDATED_COLOR);
        return carro;
    }

    @BeforeEach
    public void initTest() {
        carro = createEntity(em);
    }

    @Test
    @Transactional
    void createCarro() throws Exception {
        int databaseSizeBeforeCreate = carroRepository.findAll().size();
        // Create the Carro
        restCarroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carro)))
            .andExpect(status().isCreated());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeCreate + 1);
        Carro testCarro = carroList.get(carroList.size() - 1);
        assertThat(testCarro.getYear()).isEqualTo(DEFAULT_YEAR);
        assertThat(testCarro.getLicensePlate()).isEqualTo(DEFAULT_LICENSE_PLATE);
        assertThat(testCarro.getModel()).isEqualTo(DEFAULT_MODEL);
        assertThat(testCarro.getColor()).isEqualTo(DEFAULT_COLOR);
    }

    @Test
    @Transactional
    void createCarroWithExistingId() throws Exception {
        // Create the Carro with an existing ID
        carro.setId(1L);

        int databaseSizeBeforeCreate = carroRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carro)))
            .andExpect(status().isBadRequest());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCarros() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        // Get all the carroList
        restCarroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carro.getId().intValue())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)))
            .andExpect(jsonPath("$.[*].licensePlate").value(hasItem(DEFAULT_LICENSE_PLATE)))
            .andExpect(jsonPath("$.[*].model").value(hasItem(DEFAULT_MODEL)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)));
    }

    @Test
    @Transactional
    void getCarro() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        // Get the carro
        restCarroMockMvc
            .perform(get(ENTITY_API_URL_ID, carro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(carro.getId().intValue()))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR))
            .andExpect(jsonPath("$.licensePlate").value(DEFAULT_LICENSE_PLATE))
            .andExpect(jsonPath("$.model").value(DEFAULT_MODEL))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR));
    }

    @Test
    @Transactional
    void getNonExistingCarro() throws Exception {
        // Get the carro
        restCarroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCarro() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        int databaseSizeBeforeUpdate = carroRepository.findAll().size();

        // Update the carro
        Carro updatedCarro = carroRepository.findById(carro.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCarro are not directly saved in db
        em.detach(updatedCarro);
        updatedCarro.year(UPDATED_YEAR).licensePlate(UPDATED_LICENSE_PLATE).model(UPDATED_MODEL).color(UPDATED_COLOR);

        restCarroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCarro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCarro))
            )
            .andExpect(status().isOk());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
        Carro testCarro = carroList.get(carroList.size() - 1);
        assertThat(testCarro.getYear()).isEqualTo(UPDATED_YEAR);
        assertThat(testCarro.getLicensePlate()).isEqualTo(UPDATED_LICENSE_PLATE);
        assertThat(testCarro.getModel()).isEqualTo(UPDATED_MODEL);
        assertThat(testCarro.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void putNonExistingCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, carro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(carro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(carro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCarroWithPatch() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        int databaseSizeBeforeUpdate = carroRepository.findAll().size();

        // Update the carro using partial update
        Carro partialUpdatedCarro = new Carro();
        partialUpdatedCarro.setId(carro.getId());

        partialUpdatedCarro.year(UPDATED_YEAR).licensePlate(UPDATED_LICENSE_PLATE).model(UPDATED_MODEL);

        restCarroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCarro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCarro))
            )
            .andExpect(status().isOk());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
        Carro testCarro = carroList.get(carroList.size() - 1);
        assertThat(testCarro.getYear()).isEqualTo(UPDATED_YEAR);
        assertThat(testCarro.getLicensePlate()).isEqualTo(UPDATED_LICENSE_PLATE);
        assertThat(testCarro.getModel()).isEqualTo(UPDATED_MODEL);
        assertThat(testCarro.getColor()).isEqualTo(DEFAULT_COLOR);
    }

    @Test
    @Transactional
    void fullUpdateCarroWithPatch() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        int databaseSizeBeforeUpdate = carroRepository.findAll().size();

        // Update the carro using partial update
        Carro partialUpdatedCarro = new Carro();
        partialUpdatedCarro.setId(carro.getId());

        partialUpdatedCarro.year(UPDATED_YEAR).licensePlate(UPDATED_LICENSE_PLATE).model(UPDATED_MODEL).color(UPDATED_COLOR);

        restCarroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCarro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCarro))
            )
            .andExpect(status().isOk());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
        Carro testCarro = carroList.get(carroList.size() - 1);
        assertThat(testCarro.getYear()).isEqualTo(UPDATED_YEAR);
        assertThat(testCarro.getLicensePlate()).isEqualTo(UPDATED_LICENSE_PLATE);
        assertThat(testCarro.getModel()).isEqualTo(UPDATED_MODEL);
        assertThat(testCarro.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void patchNonExistingCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, carro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(carro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(carro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCarro() throws Exception {
        int databaseSizeBeforeUpdate = carroRepository.findAll().size();
        carro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(carro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Carro in the database
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCarro() throws Exception {
        // Initialize the database
        carroRepository.saveAndFlush(carro);

        int databaseSizeBeforeDelete = carroRepository.findAll().size();

        // Delete the carro
        restCarroMockMvc
            .perform(delete(ENTITY_API_URL_ID, carro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Carro> carroList = carroRepository.findAll();
        assertThat(carroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
