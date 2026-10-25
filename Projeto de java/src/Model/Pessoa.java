
package model;

public class Pessoa {

    private Integer id;
    private String cpf;
    private String nome;
    private String usuarioDeLogin;
    private String senha;

    public Pessoa(String nome, String cpf, String senha) {
        this.nome = nome;
        this.cpf = cpf;
        this.senha = senha;
    }

    public Integer getId() {
        return id;
    }

    public void atribuirId(Integer id) {
        if (this.id != null || id == null || id <= 0) {
            throw new IllegalStateException("ID inválido ou já atribuído!");
        }

        this.id = id;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUsuarioDeLogin() {
        return usuarioDeLogin;
    }

    public void setUsuarioDeLogin(String usuarioDeLogin) {
        this.usuarioDeLogin = usuarioDeLogin;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
