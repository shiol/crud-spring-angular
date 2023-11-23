package com.shiol.crud.domain;

import static com.shiol.crud.domain.CarroTestSamples.*;
import static com.shiol.crud.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.shiol.crud.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = getUsuarioSample1();
        Usuario usuario2 = new Usuario();
        assertThat(usuario1).isNotEqualTo(usuario2);

        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);

        usuario2 = getUsuarioSample2();
        assertThat(usuario1).isNotEqualTo(usuario2);
    }

    @Test
    void carroTest() throws Exception {
        Usuario usuario = getUsuarioRandomSampleGenerator();
        Carro carroBack = getCarroRandomSampleGenerator();

        usuario.addCarro(carroBack);
        assertThat(usuario.getCarros()).containsOnly(carroBack);
        assertThat(carroBack.getUsuario()).isEqualTo(usuario);

        usuario.removeCarro(carroBack);
        assertThat(usuario.getCarros()).doesNotContain(carroBack);
        assertThat(carroBack.getUsuario()).isNull();

        usuario.carros(new HashSet<>(Set.of(carroBack)));
        assertThat(usuario.getCarros()).containsOnly(carroBack);
        assertThat(carroBack.getUsuario()).isEqualTo(usuario);

        usuario.setCarros(new HashSet<>());
        assertThat(usuario.getCarros()).doesNotContain(carroBack);
        assertThat(carroBack.getUsuario()).isNull();
    }
}
