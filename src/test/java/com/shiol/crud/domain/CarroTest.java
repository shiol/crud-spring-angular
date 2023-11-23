package com.shiol.crud.domain;

import static com.shiol.crud.domain.CarroTestSamples.*;
import static com.shiol.crud.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.shiol.crud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CarroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Carro.class);
        Carro carro1 = getCarroSample1();
        Carro carro2 = new Carro();
        assertThat(carro1).isNotEqualTo(carro2);

        carro2.setId(carro1.getId());
        assertThat(carro1).isEqualTo(carro2);

        carro2 = getCarroSample2();
        assertThat(carro1).isNotEqualTo(carro2);
    }

    @Test
    void usuarioTest() throws Exception {
        Carro carro = getCarroRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        carro.setUsuario(usuarioBack);
        assertThat(carro.getUsuario()).isEqualTo(usuarioBack);

        carro.usuario(null);
        assertThat(carro.getUsuario()).isNull();
    }
}
